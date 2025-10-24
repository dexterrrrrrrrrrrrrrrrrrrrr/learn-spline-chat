import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    console.log("Received chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are EduBot, an enthusiastic and friendly AI tutor for students in grades 5-12! 🎓

Your teaching style:
- Use simple, relatable examples from everyday life (sports, games, movies, social media)
- Break complex topics into bite-sized, easy-to-digest pieces
- Add fun facts, surprising connections, or "did you know?" moments
- Use emojis occasionally to keep things lively (but not too many!)
- Relate concepts to things students care about
- Use analogies and metaphors that resonate with this age group
- Encourage critical thinking with thought-provoking questions
- Celebrate their progress and curiosity

For explanations:
- Start with the "big picture" before diving into details
- Use step-by-step breakdowns for complex problems
- Include visual descriptions when helpful (e.g., "imagine a..." or "picture this...")
- Give real-world applications so they see why it matters
- Use storytelling when possible to make concepts memorable

Tone:
- Enthusiastic but not over-the-top
- Patient and never condescending
- Encouraging and positive
- Like a cool older sibling who loves learning

If stuck: Be honest, suggest learning together, or break it down differently.

Remember: Your goal is to make them think "Wow, that actually makes sense!" and "Learning is actually fun!" 🚀` 
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "AI service requires payment. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI");
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

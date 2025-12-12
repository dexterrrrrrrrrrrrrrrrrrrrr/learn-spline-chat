import { useState, useCallback } from "react";
import { toast } from "sonner";

type Message = { 
  role: "user" | "assistant"; 
  content: string;
  topic?: string;
  imageUrl?: string;
  imageLoading?: boolean;
  showAnimation?: boolean;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateTopicImage = async (topic: string, context: string): Promise<string | null> => {
    try {
      const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-topic-image`;
      const resp = await fetch(IMAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ topic, context }),
      });

      if (!resp.ok) {
        console.error("Image generation failed:", resp.status);
        return null;
      }

      const data = await resp.json();
      return data.imageUrl || null;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  };

  const extractTopic = (userMessage: string): string => {
    // Extract the main topic from the user's question
    const cleanMessage = userMessage
      .replace(/^(explain|teach me|help me with|what is|how does|tell me about|describe)\s*/i, "")
      .replace(/\?$/, "")
      .trim();
    return cleanMessage || userMessage;
  };

  const sendMessage = useCallback(async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    const topic = extractTopic(input);
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";
    const upsertAssistant = (nextChunk: string, updates?: Partial<Message>) => {
      assistantContent += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { 
            ...m, 
            content: assistantContent,
            ...updates,
          } : m));
        }
        return [...prev, { 
          role: "assistant", 
          content: assistantContent,
          topic,
          imageLoading: true,
          showAnimation: true,
        }];
      });
    };

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        if (resp.status === 429) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (resp.status === 402) {
          toast.error("AI service unavailable. Please contact support.");
        } else {
          toast.error(errorData.error || "Failed to get response");
        }
        setMessages(prev => prev.slice(0, -1));
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }

      // Only generate image if response is 150+ words
      const wordCount = assistantContent.split(/\s+/).filter(w => w.length > 0).length;
      
      if (wordCount >= 150) {
        const imageUrl = await generateTopicImage(topic, input);
        upsertAssistant("", { imageUrl: imageUrl || undefined, imageLoading: false });
      } else {
        upsertAssistant("", { imageLoading: false });
      }

      setIsLoading(false);
    } catch (e) {
      console.error("Chat error:", e);
      toast.error("Failed to send message");
      setMessages(prev => prev.slice(0, -1));
      setIsLoading(false);
    }
  }, [messages]);

  return { messages, isLoading, sendMessage };
}

import { useEffect, useRef } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { FloatingElements } from "@/components/FloatingElements";
import { GraduationCap, Sparkles, Volume2 } from "lucide-react";

const Index = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const { speak, isSpeaking, currentMessageId } = useTextToSpeech();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Floating animated elements */}
      <FloatingElements />
      
      {/* Gradient orbs for visual interest */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />
      
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent animate-pulse">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EduBot
            </h1>
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Your AI-powered educational assistant • Hover messages to listen 🔊
          </p>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 animate-in fade-in duration-700">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="text-center space-y-2 max-w-md">
                <h2 className="text-2xl font-semibold text-foreground">Welcome to EduBot!</h2>
                <p className="text-muted-foreground">
                  I'm here to help you learn anything. Ask me about math, science, history, languages, or any educational topic!
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                {[
                  "Explain photosynthesis",
                  "Help me with algebra",
                  "Teach me about World War II",
                  "How do I learn Spanish?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="p-4 rounded-xl bg-card hover:bg-accent/10 border border-border text-left text-sm text-card-foreground transition-all hover:shadow-md hover:border-primary/50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <ChatMessage 
                  key={idx} 
                  role={msg.role} 
                  content={msg.content}
                  messageId={`msg-${idx}`}
                  imageUrl={msg.imageUrl}
                  imageLoading={msg.imageLoading}
                  isSpeaking={isSpeaking}
                  isCurrentlySpeaking={currentMessageId === `msg-${idx}`}
                  onSpeak={speak}
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div className="bg-card rounded-2xl px-4 py-3 border border-border">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-background pt-4 border-t border-border">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Index;

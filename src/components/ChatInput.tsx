import { useState, FormEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything about education..."
        disabled={disabled}
        className={cn(
          "min-h-[60px] max-h-[200px] resize-none rounded-2xl",
          "bg-card border-border focus-visible:ring-primary",
          "transition-all duration-200"
        )}
      />
      <Button
        type="submit"
        disabled={disabled || !input.trim()}
        size="icon"
        className="h-[60px] w-[60px] rounded-2xl bg-gradient-to-br from-primary to-accent hover:shadow-md transition-all duration-200"
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
}

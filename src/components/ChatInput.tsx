import { useState, FormEvent, KeyboardEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string, file?: File) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((input.trim() || selectedFile) && !disabled) {
      onSend(input.trim(), selectedFile || undefined);
      setInput("");
      setSelectedFile(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {selectedFile && (
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl">
          <Paperclip className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground truncate flex-1">
            {selectedFile.name}
          </span>
          <button
            type="button"
            onClick={removeFile}
            className="p-1 hover:bg-background rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}
      <div className="flex gap-2 items-end">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="h-[60px] w-[60px] rounded-2xl border-border hover:bg-accent/10 transition-all duration-200"
        >
          <Paperclip className="w-5 h-5" />
        </Button>
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
          disabled={disabled || (!input.trim() && !selectedFile)}
          size="icon"
          className="h-[60px] w-[60px] rounded-2xl bg-gradient-to-br from-primary to-accent hover:shadow-md transition-all duration-200"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}

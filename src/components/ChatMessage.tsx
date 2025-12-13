import { cn } from "@/lib/utils";
import { Bot, User, Volume2, VolumeX, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { AnimatedExplanation } from "./AnimatedExplanation";
import { InteractiveImage } from "./InteractiveImage";
import { StepByStepExplanation } from "./StepByStepExplanation";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  messageId: string;
  topic?: string;
  imageUrl?: string;
  imageLoading?: boolean;
  isSpeaking?: boolean;
  isCurrentlySpeaking?: boolean;
  showAnimation?: boolean;
  onSpeak?: (text: string, messageId: string) => void;
}

export function ChatMessage({ 
  role, 
  content, 
  messageId,
  topic,
  imageUrl,
  imageLoading,
  isSpeaking,
  isCurrentlySpeaking,
  showAnimation = false,
  onSpeak 
}: ChatMessageProps) {
  const isUser = role === "user";
  const isAssistant = role === "assistant";

  return (
    <div className={cn(
      "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 group",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm animate-in zoom-in duration-300">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      <div className="flex flex-col gap-3 max-w-[80%]">
        {/* Interactive Step-by-Step Explanation */}
        {isAssistant && topic && content && content.length > 50 && (
          <StepByStepExplanation 
            content={content} 
            topic={topic} 
            isVisible={showAnimation} 
          />
        )}
        
        {/* 5-Second Animated Explanation */}
        {isAssistant && topic && (
          <AnimatedExplanation topic={topic} isVisible={showAnimation} />
        )}

        {/* Topic Image - Interactive */}
        {isAssistant && (imageLoading || imageUrl) && (
          <div className="animate-in fade-in duration-500">
            {imageLoading && !imageUrl ? (
              <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-border">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="relative">
                    <ImageIcon className="w-8 h-8 animate-pulse" />
                    <Loader2 className="w-4 h-4 absolute -bottom-1 -right-1 animate-spin text-primary" />
                  </div>
                  <span className="text-xs">Generating illustration...</span>
                </div>
              </div>
            ) : imageUrl ? (
              <InteractiveImage 
                src={imageUrl} 
                alt="Educational illustration"
              />
            ) : null}
          </div>
        )}

        {/* Message Content */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm transition-all",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground border border-border hover:shadow-md"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        </div>
        
        {/* Voice button for assistant messages */}
        {isAssistant && onSpeak && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSpeak(content, messageId)}
              className={cn(
                "h-8 px-3 gap-2 text-xs text-muted-foreground hover:text-foreground",
                isCurrentlySpeaking && "text-primary"
              )}
            >
              {isCurrentlySpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  Listen
                </>
              )}
            </Button>
            {isCurrentlySpeaking && (
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
                <span className="w-1.5 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
                <span className="w-1.5 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                <span className="w-1.5 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
              </div>
            )}
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center animate-in zoom-in duration-300">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}

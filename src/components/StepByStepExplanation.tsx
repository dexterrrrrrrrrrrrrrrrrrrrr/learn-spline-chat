import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw,
  Lightbulb,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "./ui/button";

interface Step {
  title: string;
  content: string;
  icon?: string;
}

interface StepByStepExplanationProps {
  content: string;
  topic: string;
  isVisible: boolean;
}

// Parse content into steps - looks for numbered lists or creates steps from paragraphs
function parseSteps(content: string, topic: string): Step[] {
  const lines = content.split('\n').filter(line => line.trim());
  const steps: Step[] = [];
  
  // Try to find numbered steps (1. 2. 3. or Step 1, Step 2, etc.)
  const numberedPattern = /^(\d+[\.\)]|step\s*\d+[:\.]?)/i;
  let currentStep: Step | null = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (numberedPattern.test(trimmed)) {
      if (currentStep) steps.push(currentStep);
      const title = trimmed.replace(numberedPattern, '').trim();
      currentStep = { title: title.slice(0, 50), content: title };
    } else if (currentStep) {
      currentStep.content += ' ' + trimmed;
    } else if (trimmed.length > 20) {
      // First substantial content becomes intro
      steps.push({ 
        title: "Let's Explore!", 
        content: trimmed,
        icon: "intro"
      });
    }
  }
  
  if (currentStep) steps.push(currentStep);
  
  // If no numbered steps found, split by sentences
  if (steps.length < 2) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const stepTitles = ["Introduction", "Key Concept", "How It Works", "Real Example", "Summary"];
    return sentences.slice(0, 5).map((sentence, i) => ({
      title: stepTitles[i] || `Part ${i + 1}`,
      content: sentence.trim() + '.',
      icon: i === 0 ? "intro" : i === sentences.length - 1 ? "summary" : "concept"
    }));
  }
  
  return steps;
}

const stepIcons: Record<string, React.ReactNode> = {
  intro: <BookOpen className="w-5 h-5" />,
  concept: <Lightbulb className="w-5 h-5" />,
  summary: <Sparkles className="w-5 h-5" />,
  default: <ArrowRight className="w-5 h-5" />
};

export function StepByStepExplanation({ content, topic, isVisible }: StepByStepExplanationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const steps = parseSteps(content, topic);
  
  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !isVisible) return;
    
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= steps.length) {
          setIsPlaying(false);
          return prev;
        }
        setCompletedSteps(s => new Set([...s, prev]));
        return next;
      });
    }, 4000); // 4 seconds per step
    
    return () => clearInterval(timer);
  }, [isPlaying, isVisible, steps.length]);
  
  // Mark current step as viewed after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setCompletedSteps(s => new Set([...s, currentStep]));
    }, 2000);
    return () => clearTimeout(timer);
  }, [currentStep]);
  
  if (!isVisible || steps.length === 0) return null;
  
  const goToStep = (index: number) => {
    setCurrentStep(index);
    setIsPlaying(false);
  };
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(s => new Set([...s, currentStep]));
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const restart = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setIsPlaying(true);
  };
  
  const step = steps[currentStep];
  
  return (
    <div className="w-full bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 rounded-2xl p-4 border border-border shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <span className="text-sm font-medium text-foreground">Step-by-Step Guide</span>
        </div>
        <div className="flex items-center gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300 hover:scale-125",
                i === currentStep 
                  ? "bg-primary w-6" 
                  : completedSteps.has(i) 
                    ? "bg-primary/60" 
                    : "bg-muted-foreground/30"
              )}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
          Step {currentStep + 1} of {steps.length}
        </span>
        {completedSteps.has(currentStep) && (
          <CheckCircle2 className="w-4 h-4 text-green-500 animate-in zoom-in duration-300" />
        )}
      </div>
      
      {/* Main content card */}
      <div 
        key={currentStep}
        className="bg-card rounded-xl p-4 border border-border shadow-sm animate-in fade-in slide-in-from-right-4 duration-500"
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
            "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md"
          )}>
            {stepIcons[step.icon || "default"]}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground mb-1 text-sm">
              {step.title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.content}
            </p>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 w-8 p-0"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={restart}
          className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3" />
          Restart
        </Button>
      </div>
      
      {/* Auto-play indicator */}
      {isPlaying && (
        <div className="mt-2 overflow-hidden">
          <div 
            className="h-0.5 bg-primary rounded-full animate-pulse"
            style={{
              animation: 'progress 4s linear infinite'
            }}
          />
        </div>
      )}
      
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}

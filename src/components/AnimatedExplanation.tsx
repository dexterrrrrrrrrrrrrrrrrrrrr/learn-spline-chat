import { Atom, BookOpen, Calculator, FlaskConical, Globe, Lightbulb, Music, Palette, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedExplanationProps {
  topic: string;
  isVisible: boolean;
}

type AnimationType = "science" | "math" | "history" | "language" | "art" | "music" | "general";

const detectAnimationType = (topic: string): AnimationType => {
  const lowerTopic = topic.toLowerCase();
  
  if (/photosynthesis|atom|molecule|chemistry|physics|biology|cell|dna|energy|science|planet|space|gravity|electron/i.test(lowerTopic)) {
    return "science";
  }
  if (/math|algebra|geometry|equation|calcul|number|fraction|percent|trigonometry|graph/i.test(lowerTopic)) {
    return "math";
  }
  if (/history|war|century|ancient|civilization|empire|revolution|president|king|queen/i.test(lowerTopic)) {
    return "history";
  }
  if (/language|spanish|french|german|english|grammar|vocabulary|translate|speak/i.test(lowerTopic)) {
    return "language";
  }
  if (/art|paint|draw|color|sculpture|museum|artist/i.test(lowerTopic)) {
    return "art";
  }
  if (/music|song|instrument|rhythm|melody|note|piano|guitar/i.test(lowerTopic)) {
    return "music";
  }
  return "general";
};

const ScienceAnimation = () => (
  <div className="relative w-full h-32 overflow-hidden">
    {/* Central atom */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-8 h-8 rounded-full bg-primary animate-pulse" />
      {/* Electron orbits */}
      {[0, 60, 120].map((rotation, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-primary/30 rounded-full"
          style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
        >
          <div
            className="absolute w-3 h-3 bg-accent rounded-full animate-orbit"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        </div>
      ))}
    </div>
    {/* Floating molecules */}
    {[...Array(5)].map((_, i) => (
      <FlaskConical
        key={i}
        className="absolute text-primary/20 animate-float-particle"
        style={{
          left: `${15 + i * 20}%`,
          animationDelay: `${i * 0.5}s`,
          width: 16 + i * 4,
          height: 16 + i * 4,
        }}
      />
    ))}
  </div>
);

const MathAnimation = () => (
  <div className="relative w-full h-32 overflow-hidden flex items-center justify-center">
    {/* Floating numbers and symbols */}
    {["π", "∑", "∞", "√", "÷", "×", "=", "+"].map((symbol, i) => (
      <span
        key={i}
        className="absolute text-2xl font-bold text-primary/40 animate-float-math"
        style={{
          left: `${10 + i * 12}%`,
          animationDelay: `${i * 0.2}s`,
          animationDuration: `${2 + (i % 3)}s`,
        }}
      >
        {symbol}
      </span>
    ))}
    {/* Central calculator icon */}
    <Calculator className="w-12 h-12 text-primary animate-bounce-slow" />
    {/* Graph line animation */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
      <path
        d="M 0 80 Q 50 20 100 50 T 200 30"
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeDasharray="300"
        className="animate-draw-line"
      />
    </svg>
  </div>
);

const HistoryAnimation = () => (
  <div className="relative w-full h-32 overflow-hidden">
    {/* Timeline */}
    <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-expand-width" />
    {/* Timeline dots */}
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary animate-pop-in"
        style={{
          left: `${15 + i * 18}%`,
          animationDelay: `${0.5 + i * 0.3}s`,
        }}
      />
    ))}
    {/* Floating book icons */}
    {[...Array(3)].map((_, i) => (
      <BookOpen
        key={i}
        className="absolute text-accent/30 animate-float-particle"
        style={{
          left: `${20 + i * 30}%`,
          top: `${20 + (i % 2) * 40}%`,
          animationDelay: `${i * 0.4}s`,
          width: 20,
          height: 20,
        }}
      />
    ))}
  </div>
);

const LanguageAnimation = () => (
  <div className="relative w-full h-32 overflow-hidden flex items-center justify-center">
    {/* Floating language bubbles */}
    {["Hola", "Bonjour", "Hello", "Ciao", "你好"].map((word, i) => (
      <span
        key={i}
        className="absolute px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-float-bubble"
        style={{
          left: `${10 + i * 18}%`,
          animationDelay: `${i * 0.3}s`,
        }}
      >
        {word}
      </span>
    ))}
    <Globe className="w-10 h-10 text-primary animate-spin-slow" />
  </div>
);

const ArtAnimation = () => (
  <div className="relative w-full h-32 overflow-hidden flex items-center justify-center">
    <Palette className="w-12 h-12 text-primary animate-wiggle" />
    {/* Paint splashes */}
    {["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181"].map((color, i) => (
      <div
        key={i}
        className="absolute w-6 h-6 rounded-full animate-splash"
        style={{
          backgroundColor: color,
          left: `${20 + i * 15}%`,
          top: `${30 + (i % 2) * 30}%`,
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

const MusicAnimation = () => (
  <div className="relative w-full h-32 overflow-hidden flex items-center justify-center">
    <Music className="w-10 h-10 text-primary animate-bounce-slow" />
    {/* Musical notes */}
    {["♪", "♫", "♬", "♩", "♭"].map((note, i) => (
      <span
        key={i}
        className="absolute text-2xl text-accent/50 animate-float-note"
        style={{
          left: `${15 + i * 18}%`,
          animationDelay: `${i * 0.25}s`,
        }}
      >
        {note}
      </span>
    ))}
    {/* Sound waves */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-primary/40 rounded-full animate-sound-wave"
          style={{
            height: 20 + (i % 3) * 10,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  </div>
);

const GeneralAnimation = () => (
  <div className="relative w-full h-32 overflow-hidden flex items-center justify-center">
    <Lightbulb className="w-12 h-12 text-primary animate-glow" />
    {/* Sparkles */}
    {[...Array(8)].map((_, i) => (
      <Sparkles
        key={i}
        className="absolute text-accent/40 animate-twinkle"
        style={{
          left: `${10 + i * 12}%`,
          top: `${20 + (i % 3) * 25}%`,
          animationDelay: `${i * 0.15}s`,
          width: 12 + (i % 3) * 4,
          height: 12 + (i % 3) * 4,
        }}
      />
    ))}
  </div>
);

const animations: Record<AnimationType, React.FC> = {
  science: ScienceAnimation,
  math: MathAnimation,
  history: HistoryAnimation,
  language: LanguageAnimation,
  art: ArtAnimation,
  music: MusicAnimation,
  general: GeneralAnimation,
};

export function AnimatedExplanation({ topic, isVisible }: AnimatedExplanationProps) {
  const animationType = detectAnimationType(topic);
  const AnimationComponent = animations[animationType];

  if (!isVisible) return null;

  return (
    <div className={cn(
      "rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden",
      "animate-in fade-in zoom-in-95 duration-500"
    )}>
      <AnimationComponent />
    </div>
  );
}

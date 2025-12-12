import { BookOpen, Atom, Calculator, Globe, Lightbulb, Microscope } from "lucide-react";

const icons = [
  { Icon: BookOpen, delay: "0s", duration: "20s", left: "5%", size: 24 },
  { Icon: Atom, delay: "3s", duration: "25s", left: "15%", size: 20 },
  { Icon: Calculator, delay: "7s", duration: "22s", left: "85%", size: 22 },
  { Icon: Globe, delay: "2s", duration: "28s", left: "75%", size: 26 },
  { Icon: Lightbulb, delay: "5s", duration: "18s", left: "45%", size: 20 },
  { Icon: Microscope, delay: "10s", duration: "24s", left: "92%", size: 18 },
];

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map(({ Icon, delay, duration, left, size }, idx) => (
        <div
          key={idx}
          className="absolute animate-float text-primary/10"
          style={{
            left,
            animationDelay: delay,
            animationDuration: duration,
          }}
        >
          <Icon size={size} />
        </div>
      ))}
    </div>
  );
}

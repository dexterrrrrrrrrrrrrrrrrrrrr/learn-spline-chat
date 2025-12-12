import { Sparkles, BookOpen, Pencil, Lightbulb } from "lucide-react";

export function AnimatedRobot() {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Floating sparkles */}
      {[...Array(6)].map((_, i) => (
        <Sparkles
          key={`sparkle-${i}`}
          className="absolute text-yellow-400 animate-twinkle-float"
          style={{
            left: `${10 + i * 15}%`,
            top: `${5 + (i % 3) * 30}%`,
            animationDelay: `${i * 0.3}s`,
            width: 12 + (i % 3) * 4,
            height: 12 + (i % 3) * 4,
          }}
        />
      ))}

      {/* Floating letters */}
      {["A", "B", "C"].map((letter, i) => (
        <span
          key={letter}
          className="absolute text-2xl font-bold animate-float-letter"
          style={{
            left: `${5 + i * 35}%`,
            top: `${10 + i * 20}%`,
            animationDelay: `${i * 0.5}s`,
            color: ["#FF6B6B", "#4ECDC4", "#FFE66D"][i],
            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          {letter}
        </span>
      ))}

      {/* Floating numbers */}
      {["1", "2", "3"].map((num, i) => (
        <span
          key={num}
          className="absolute text-xl font-bold animate-float-number"
          style={{
            right: `${5 + i * 20}%`,
            bottom: `${15 + i * 15}%`,
            animationDelay: `${i * 0.4}s`,
            color: ["#A78BFA", "#F472B6", "#34D399"][i],
            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          {num}
        </span>
      ))}

      {/* Floating book */}
      <BookOpen
        className="absolute left-2 bottom-8 text-blue-400 animate-float-book"
        style={{ width: 28, height: 28 }}
      />

      {/* Floating pencil */}
      <Pencil
        className="absolute right-4 top-12 text-orange-400 animate-float-pencil"
        style={{ width: 24, height: 24, transform: "rotate(-30deg)" }}
      />

      {/* Floating lightbulb */}
      <Lightbulb
        className="absolute right-8 bottom-16 text-yellow-300 animate-glow-pulse"
        style={{ width: 26, height: 26 }}
      />

      {/* Robot body */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-robot-bob">
        {/* Antenna */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-1 h-6 bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-full">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-red-400 to-pink-500 rounded-full animate-antenna-blink shadow-lg shadow-pink-400/50" />
        </div>

        {/* Head */}
        <div className="relative w-24 h-20 bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 rounded-3xl shadow-2xl border-4 border-cyan-200/50">
          {/* Face screen */}
          <div className="absolute inset-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
            {/* Eyes */}
            <div className="flex justify-center gap-4 mt-3">
              <div className="relative">
                <div className="w-6 h-6 bg-white rounded-full animate-eye-blink">
                  <div className="absolute top-1 left-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                    <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-6 h-6 bg-white rounded-full animate-eye-blink" style={{ animationDelay: "0.1s" }}>
                  <div className="absolute top-1 left-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                    <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                  </div>
                </div>
              </div>
            </div>

            {/* Smile */}
            <div className="flex justify-center mt-1">
              <div className="w-8 h-3 border-b-4 border-cyan-400 rounded-b-full animate-smile" />
            </div>
          </div>

          {/* Ear lights */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full animate-ear-glow shadow-lg shadow-green-400/50" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full animate-ear-glow shadow-lg shadow-green-400/50" style={{ animationDelay: "0.5s" }} />
        </div>

        {/* Body */}
        <div className="relative w-20 h-16 mx-auto -mt-1 bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 rounded-2xl shadow-xl border-4 border-cyan-200/50">
          {/* Chest panel */}
          <div className="absolute inset-2 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl">
            {/* Heart */}
            <div className="flex justify-center mt-2">
              <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-red-500 rounded-full animate-heart-beat shadow-lg shadow-pink-500/50" />
            </div>
            {/* Buttons */}
            <div className="flex justify-center gap-1.5 mt-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-button-blink"
                  style={{
                    background: ["#4ADE80", "#FACC15", "#F87171"][i],
                    animationDelay: `${i * 0.3}s`,
                    boxShadow: `0 0 8px ${["#4ADE80", "#FACC15", "#F87171"][i]}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Arms */}
        <div className="absolute -left-6 top-24 w-4 h-10 bg-gradient-to-b from-cyan-300 to-cyan-400 rounded-full animate-wave-left origin-top" />
        <div className="absolute -right-6 top-24 w-4 h-10 bg-gradient-to-b from-cyan-300 to-cyan-400 rounded-full animate-wave-right origin-top" />

        {/* Hands */}
        <div className="absolute -left-8 top-32 w-5 h-5 bg-gradient-to-br from-cyan-200 to-cyan-300 rounded-full animate-wave-left origin-top" style={{ animationDelay: "0.1s" }} />
        <div className="absolute -right-8 top-32 w-5 h-5 bg-gradient-to-br from-cyan-200 to-cyan-300 rounded-full animate-wave-right origin-top" style={{ animationDelay: "0.1s" }} />
      </div>

      {/* Glow effect under robot */}
      <div className="absolute left-1/2 bottom-8 -translate-x-1/2 w-20 h-4 bg-cyan-400/30 rounded-full blur-xl animate-glow-pulse" />
    </div>
  );
}

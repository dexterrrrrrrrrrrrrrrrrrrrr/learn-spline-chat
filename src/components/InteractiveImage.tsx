import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface InteractiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function InteractiveImage({ src, alt, className }: InteractiveImageProps) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate rotation based on mouse position relative to center
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 10;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 10;

    setTransform({ rotateX, rotateY, scale: 1.02 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-xl cursor-move perspective-1000",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating animation wrapper */}
      <div className="animate-float-image">
        {/* 3D transform wrapper */}
        <div
          className="transition-transform duration-200 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
          }}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-contain rounded-xl"
          />
          
          {/* Shine effect on hover */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
            style={{
              transform: `translateX(${transform.rotateY * 5}px)`,
            }}
          />
        </div>
      </div>

      {/* Floating particles around the image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30 animate-float-particle"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 2)}s`,
            }}
          />
        ))}
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl blur-xl opacity-50 animate-pulse -z-10" />
    </div>
  );
}

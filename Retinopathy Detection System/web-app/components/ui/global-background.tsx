
'use client'

import { useEffect, useState, useRef } from "react";
import { useMousePositionRef } from "@/components/hooks/use-mouse-position-ref";

export function GlobalBackground() {
  /* Replace manual event listeners with hook */
  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useMousePositionRef(containerRef as any);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;
    const updatePosition = () => {
      // Smooth update using the ref values
      setPosition({ 
        x: positionRef.current.x, 
        y: positionRef.current.y 
      });
      // Loop continues even if not visible, but for background it's fine.
      // Alternatively use setInterval like in demo, but requestAnimationFrame is smoother.
      // However, demo used setInterval(..., 16), let's stick to that for consistency if preferred,
      // or use RAF for better battery life (browser stops RAF in background tabs).
      animationFrameId = requestAnimationFrame(updatePosition);
    };
    
    // Start loop
    animationFrameId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none -z-50 overflow-hidden bg-white">
      <div
        className="absolute inset-0 transition-opacity duration-300"
        // @ts-ignore - dynamic style for mouse tracking
        style={{
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 50%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.4]"
        // @ts-ignore - dynamic style for pattern
        style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}


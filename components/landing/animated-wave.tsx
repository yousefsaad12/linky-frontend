"use client";

import { memo, useEffect, useRef } from "react";

export const AnimatedWave = memo(function AnimatedWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const fpsIntervalRef = useRef(1000 / 20); // Cap at 20 FPS
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "·∘○◯◌●◉";
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Intersection observer to pause animation when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const render = (timestamp: number) => {
      if (!isVisibleRef.current) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }

      const elapsed = timestamp - lastTimeRef.current;
      
      if (elapsed > fpsIntervalRef.current) {
        lastTimeRef.current = timestamp - (elapsed % fpsIntervalRef.current);
        
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const cols = Math.floor(rect.width / 32); // Increased spacing for better performance
        const rows = Math.floor(rect.height / 32);

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const px = (x + 0.5) * (rect.width / cols);
            const py = (y + 0.5) * (rect.height / rows);

            const wave1 = Math.sin(x * 0.2 + time * 2) * Math.cos(y * 0.15 + time);
            const wave2 = Math.sin((x + y) * 0.1 + time * 1.5);
            const wave3 = Math.cos(x * 0.1 - y * 0.1 + time * 0.8);
            
            const combined = (wave1 + wave2 + wave3) / 3;
            const normalized = (combined + 1) / 2;
            
            const charIndex = Math.floor(normalized * (chars.length - 1));
            const alpha = 0.15 + normalized * 0.5;

            ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            ctx.fillText(chars[charIndex], px, py);
          }
        }

        time += 0.03;
      }
      
      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
});

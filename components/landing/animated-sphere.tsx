"use client";

import { memo, useEffect, useRef } from "react";

export const AnimatedSphere = memo(function AnimatedSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const fpsIntervalRef = useRef(1000 / 30); // Cap at 30 FPS

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯";
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

    const render = (timestamp: number) => {
      const elapsed = timestamp - lastTimeRef.current;
      
      if (elapsed > fpsIntervalRef.current) {
        lastTimeRef.current = timestamp - (elapsed % fpsIntervalRef.current);
        
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const radius = Math.min(rect.width, rect.height) * 0.525;

        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const step = 12;
        const points: { x: number; y: number; z: number; char: string }[] = [];

        // Generate sphere points with reduced resolution
        for (let phi = 0; phi < Math.PI * 2; phi += 0.2) {
          for (let theta = 0; theta < Math.PI; theta += 0.2) {
            const x = Math.sin(theta) * Math.cos(phi + time * 0.5);
            const y = Math.sin(theta) * Math.sin(phi + time * 0.5);
            const z = Math.cos(theta);

            // Rotate around Y axis
            const rotY = time * 0.3;
            const newX = x * Math.cos(rotY) - z * Math.sin(rotY);
            const newZ = x * Math.sin(rotY) + z * Math.cos(rotY);

            // Rotate around X axis
            const rotX = time * 0.2;
            const newY = y * Math.cos(rotX) - newZ * Math.sin(rotX);
            const finalZ = y * Math.sin(rotX) + newZ * Math.cos(rotX);

            const depth = (finalZ + 1) / 2;
            const charIndex = Math.floor(depth * (chars.length - 1));

            points.push({
              x: centerX + newX * radius,
              y: centerY + newY * radius,
              z: finalZ,
              char: chars[charIndex],
            });
          }
        }

        // Sort by z for depth
        points.sort((a, b) => a.z - b.z);

        // Draw points
        points.forEach((point) => {
          const alpha = 0.2 + (point.z + 1) * 0.4;
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          ctx.fillText(point.char, point.x, point.y);
        });

        time += 0.02;
      }
      
      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
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

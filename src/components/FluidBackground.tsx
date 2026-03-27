"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement for the mask
  const maskX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const maskY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let simulation: any = null;

    const initSimulation = async () => {
      try {
        const { default: webGLFluidSimulation } = await import("webgl-fluid");

        simulation = webGLFluidSimulation(canvas, {
          IMMEDIATE: false,
          TRIGGER: "hover",
          SIM_RESOLUTION: 128,
          DYE_RESOLUTION: 1024,
          CAPTURE_RESOLUTION: 512,
          DENSITY_DISSIPATION: 3.5,
          VELOCITY_DISSIPATION: 2.5,
          PRESSURE: 0.1,
          PRESSURE_ITERATIONS: 20,
          CURL: 3,
          SPLAT_RADIUS: 0.25,
          SPLAT_FORCE: 6000,
          SHADING: true,
          COLORFUL: true,
          COLOR_UPDATE_SPEED: 10,
          PAUSED: false,
          BACK_COLOR: { r: 0, g: 0, b: 0 },
          TRANSPARENT: true,
          BLOOM: false,
          SUNRAYS: false,
        });
      } catch (e) {
        console.error("WebGL Fluid Simulation error:", e);
      }
    };

    initSimulation();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const imageUrl =
    "https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?q=80&w=2188&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full h-full bg-background transition-colors duration-500 rounded-[inherit]">
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          opacity: resolvedTheme === "dark" ? 0.35 : 0.17,
          filter: "saturate(1.2) contrast(1.1)",
          maskImage: useMotionTemplate`radial-gradient(circle at ${maskX}px ${maskY}px, black 0%, transparent 500px)`,
          WebkitMaskImage: useMotionTemplate`radial-gradient(circle at ${maskX}px ${maskY}px, black 0%, transparent 500px)`,
        }}
      />
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          pointerEvents: "auto",
          opacity: 0.7,
        }}
      />
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Square, Triangle, Circle, Star, Hexagon } from "lucide-react";

const shapes = [Square, Triangle, Circle, Star, Hexagon];
const pastelColors = [
  "rgba(255, 179, 186, 0.4)", // Pink
  "rgba(255, 223, 186, 0.4)", // Peach
  "rgba(255, 255, 186, 0.4)", // Yellow
  "rgba(186, 255, 201, 0.4)", // Green
  "rgba(186, 225, 255, 0.4)", // Blue
];

const AnimatedShape = ({ shape: Shape, color, size, x, y, mouseX, mouseY }) => {
  const springConfig = { stiffness: 100, damping: 10 };
  const xMotion = useSpring(x, springConfig);
  const yMotion = useSpring(y, springConfig);

  useEffect(() => {
    const unsubscribeX = mouseX.onChange((latestX) => {
      const dx = latestX - x;
      xMotion.set(x + dx * 0.1);
    });
    const unsubscribeY = mouseY.onChange((latestY) => {
      const dy = latestY - y;
      yMotion.set(y + dy * 0.1);
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, x, y, xMotion, yMotion]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: xMotion,
        top: yMotion,
        color: color,
      }}
    >
      <Shape size={size} />
    </motion.div>
  );
};

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const [animatedShapes, setAnimatedShapes] = useState<JSX.Element[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useSpring(0);
  const mouseY = useSpring(0);

  useEffect(() => {
    const newShapes = Array.from({ length: 30 }, (_, i) => {
      const Shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color =
        pastelColors[Math.floor(Math.random() * pastelColors.length)];
      const size = Math.random() * 60 + 20; // Random size between 20 and 80
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      return (
        <AnimatedShape
          key={i}
          shape={Shape}
          color={color}
          size={size}
          x={x}
          y={y}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      );
    });
    setAnimatedShapes(newShapes);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      {animatedShapes}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-bold mb-8 text-center z-10 text-foreground"
      >
        Welcome to KanCubic
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Button onClick={onStart} size="lg" className="text-lg px-8 py-6">
          Start Organizing
        </Button>
      </motion.div>
    </div>
  );
}

import { Variants } from "framer-motion";

// fadeIn function
export const fadeIn = (
  direction: "up" | "down" | "left" | "right"
): Variants => {
  return {
    hidden: {
      y: direction === "up" ? 80 : direction === "down" ? -80 : 0,
      // ... existing code ...
      x: direction === "left" ? 80 : direction === "right" ? -80 : 0,
    },
    show: {
      // ... existing code ...
      opacity: 1,
      transition: {
        type: "tween",
        duration: 1.4,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

export const scaleUp = (): Variants => ({
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
});

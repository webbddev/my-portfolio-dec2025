"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useIntro } from "@/context/IntroContext";
import { useTranslations } from "next-intl";

// HOW TO ADD MORE IMAGES:
// Simply add more paths to this array! The animation will automatically
// calculate the total duration and loop through all of them.
const STROBE_IMAGES = [
  "/projects/personal-banker-app/pb-1.png",
  "/projects/photographers-animated-portfolio/phot-1.png",
  "/projects/tbpro-shampoo/tbpro-1.png",
  "/projects/tbpro-shampoo/tbpro-3.png",
  "/projects/personal-banker-app/pb-2.png",
  "/projects/personal-banker-app/pb-3.png",
];

const CustomIntro = () => {
  const t = useTranslations("customIntro");
  const { isIntroComplete, setIntroComplete } = useIntro();
  const [phase, setPhase] = useState<"counter" | "strobe" | "name" | "done">(
    "counter",
  );
  const [counter, setCounter] = useState(0);
  const [strobeIndex, setStrobeIndex] = useState(0);

  useEffect(() => {
    if (isIntroComplete) return;

    // Phase 1: Counter (0 -> 100 over 1.2s)
    let startTime = Date.now();
    const duration = 1400;

    const counterInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for counter
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCounter(Math.floor(easeOutQuart * 100));

      if (progress === 1) {
        clearInterval(counterInterval);
        
        // Skip the strobe phase entirely on mobile screens (width < 768px)
        if (window.innerWidth < 768) {
          setPhase("name");
        } else {
          setPhase("strobe");
        }
      }
    }, 16);

    return () => clearInterval(counterInterval);
  }, [isIntroComplete]);

  useEffect(() => {
    if (phase !== "strobe") return;

    // HOW TO MANIPULATE FLASH SPEED:
    // Change this value (in milliseconds).
    // 100 = very fast cinematic flash. 300 = slower, more visible flash (0.3s per image).
    const strobeDuration = 300;

    const strobeInterval = setInterval(() => {
      setStrobeIndex((prev) => {
        if (prev >= STROBE_IMAGES.length - 1) {
          clearInterval(strobeInterval);
          setPhase("name");
          return prev;
        }
        return prev + 1;
      });
    }, strobeDuration);

    return () => clearInterval(strobeInterval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "name") return;

    // Phase 3 & 4: Name Reveal and Dissolve
    // Hold the name for 0.8s, then trigger dissolve by setting phase to "done"
    const holdTimer = setTimeout(() => {
      setPhase("done");
    }, 800);

    return () => clearTimeout(holdTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;

    // Wait for the dissolve animation to finish (0.8s), then unmount
    const finishTimer = setTimeout(() => {
      setIntroComplete();
    }, 800);

    return () => clearTimeout(finishTimer);
  }, [phase, setIntroComplete]);

  if (isIntroComplete) return null;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden"
        >
          {/* Phase 1: Counter */}
          {phase === "counter" && (
            <div className="text-foreground font-sans font-semibold tracking-tighter text-[70px] md:text-[120px]">
              {counter.toString().padStart(3, "0")}
            </div>
          )}

          {/* Phase 2: Strobe Montage */}
          {phase === "strobe" && (
            <div className="relative w-full h-full md:w-[60vw] md:h-[70vh] overflow-hidden md:rounded-3xl">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={strobeIndex}
                  initial={{ opacity: 0, filter: "blur(6px)", scale: 0.9 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(6px)", scale: 1.1 }}
                  transition={{ duration: 0.75, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={STROBE_IMAGES[strobeIndex]}
                    alt="Project Flash"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Phase 3: Name Drop */}
          {phase === "name" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="text-foreground/60 font-sans font-black tracking-tight text-4xl sm:text-6xl md:text-[100px] lg:text-[140px] uppercase text-center px-4"
            >
              {t("welcome")}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomIntro;

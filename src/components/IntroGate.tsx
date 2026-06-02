"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIntro } from "@/context/IntroContext";

const IntroGate = ({ children }: { children: ReactNode }) => {
  const { isIntroComplete } = useIntro();

  return (
    <AnimatePresence>
      {isIntroComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroGate;

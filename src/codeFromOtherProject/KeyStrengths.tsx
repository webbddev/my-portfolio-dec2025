"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
// import { TextReveal } from "./ui/text-reveal";
import { AuroraText } from "@/components/ui/aurora-text";

const KeyStrengths = () => {
  const { theme } = useTheme();
  const t = useTranslations("KeyStrengths");
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["60%", "-10%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["-40%", "30%"]);
  const x4 = useTransform(scrollYProgress, [0, 1], ["20%", "-15%"]);
  const x5 = useTransform(scrollYProgress, [0, 1], ["-30%", "15%"]);

  const dividerColor = "bg-yellow-500 dark:bg-yellow-400";

  const yellowTones = ["#FBBF24", "#F59E0B", "#D97706"]; // Amber 400, 500, 600
  const grayTones = ["#9CA3AF", "#6B7280", "#4B5563"]; // Gray 400, 500, 600

  const lightModeTones = [
    "#004D40", // Dark Teal
    "#00796B", // Medium Teal
    "#4DB6AC", // Light Teal
    "#81C784", // Very Light Green
    "#1976D2", // Dark Blue
    "#2196F3", // Medium Blue
    "#90CAF9", // Light Blue
    "#FFD700", // Bright gold
    "#FFC700", // Deep gold
    "#FEBE10", // Warm yellow
  ];

  const darkModeTones = [
    "#F5F1ED", // Off-white
    "#E8E3DD", // Light warm gray
    "#D4CCBF", // Warm beige
    "#B8B0A0", // Muted warm gray
    "#8A8274", // Medium taupe
    "#FFE680", // Light gold
    "#FFD700", // Bright gold
    "#FFC700", // Deep gold
    "#FFAA00", // Amber
    "#FF9500", // Orange gold
  ];

  const mixedTones = theme === "dark" ? darkModeTones : lightModeTones;

  return (
    <section ref={targetRef} className="section overflow-hidden" id="strengths">
      <div className="container">
        <h2 className="text-4xl md:text-7xl lg:text-8xl capitalize">
          {t("title")}
        </h2>

        <div className="mt-10 md:mt-16 lg:mt-20 space-y-4 md:space-y-8 lg:space-y-11 text-center text-2xl md:text-4xl lg:text-5xl ">
          {/* Line 1 */}
          <motion.div style={{ x: x1 }}>
            <p>
              <AuroraText colors={mixedTones}>{t("skill1")}</AuroraText>
            </p>
          </motion.div>

          {/* Line 2 */}
          <motion.div
            style={{ x: x2 }}
            className="flex items-center justify-center gap-3"
          >
            <p>{t("skill2")}</p>
            <div className={`w-10 h-1 md:w-32 ${dividerColor}`} />
          </motion.div>

          {/* Line 3 */}
          <motion.div style={{ x: x3 }}>
            <p>{t("skill3")}</p>
          </motion.div>

          {/* Line 4 */}
          <motion.div
            style={{ x: x4 }}
            className="flex items-center justify-center gap-3"
          >
            <p>
              <AuroraText colors={mixedTones}>{t("skill5")}</AuroraText>
            </p>
            <div className={`w-10 h-1 md:w-32 ${dividerColor}`} />
            <p>{t("skill6")}</p>
          </motion.div>

          {/* Line 5 */}
          <motion.div style={{ x: x5 }}>
            <p>{t("skill4")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default KeyStrengths;

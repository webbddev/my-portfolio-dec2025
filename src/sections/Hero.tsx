"use client";

import { useEffect, useRef, useState } from "react";
import sideFacingImage from "@/assets/images/nicolas2.png"; // Profile view (looking left)
import frontFacingImage from "@/assets/images/nicolas-front-1.png"; // Front-facing view
import Image from "next/image";
import Button from "@/components/Button";
import SplitType from "split-type";
import {
  useAnimate,
  motion,
  useScroll,
  useTransform,
  useMotionValue,
} from "motion/react";
import { stagger } from "motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import FluidBackground from "@/components/FluidBackground";
import { useIntro } from "@/context/IntroContext";

const Hero = () => {
  const t = useTranslations("hero");
  const { resolvedTheme } = useTheme();
  const { isIntroComplete } = useIntro();
  const [mounted, setMounted] = useState(false);
  const [titleScope, titleAnimate] = useAnimate();
  const [subtitleScope, subtitleAnimate] = useAnimate();
  const scrollingDiv = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: scrollingDiv,
    offset: ["start end", "end end"],
  });

  // Image widens from 100% to 240% as user scrolls
  const portraitWidth = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["100%", "170%"] : ["100%", "240%"],
  );

  // Image scales up slightly for dramatic effect
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // SMOOTH GRADUAL CROSS-FADE
  const sideFacingImageOpacity = useTransform(
    scrollYProgress,
    [0, 0.1],
    [1, 0],
  );
  const frontOpacity = useTransform(scrollYProgress, [0.12, 0.2], [0, 1]);

  // Optional: Slight rotation to simulate head turning
  const imageRotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  const currentTheme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const isDarkTheme = currentTheme === "dark";

  // Dynamic color value for text and buttons on desktop
  const textColor = useMotionValue(isDarkTheme ? "#ffffff" : "#000000");

  useEffect(() => {
    const updateTextColor = (pos: number) => {
      // Transition window: map scroll position 0.0 -> 0.4 directly to the color blend
      let blend = pos / 0.8;
      if (blend < 0) blend = 0;
      if (blend > 1) blend = 1;

      // START COLORS (At Scroll Position 0 / On Load)
      // Dark mode starts white; Light mode starts dark (pure black or a deep gray)
      const startR = isDarkTheme ? 255 : 0;
      const startG = isDarkTheme ? 255 : 0;
      const startB = isDarkTheme ? 255 : 0;

      // END COLORS (As User Scrolls Down)
      // Both themes transition to pure white to stand out against the backdrop
      const endR = 255;
      const endG = 255;
      const endB = 255;

      const r = Math.round(startR + (endR - startR) * blend);
      const g = Math.round(startG + (endG - startG) * blend);
      const b = Math.round(startB + (endB - startB) * blend);

      textColor.set(`rgb(${r}, ${g}, ${b})`);
    };

    const unsubscribe = scrollYProgress.on("change", updateTextColor);

    // Initialize color on mount or theme change
    updateTextColor(scrollYProgress.get());

    return () => unsubscribe();
  }, [isDarkTheme, scrollYProgress, textColor]);

  // Adjust font weight dynamically for readability as background darkens
  const fontWeight = useTransform(scrollYProgress, [0.0, 0.4], [200, 500]);

  // Mobile fallbacks using standard theme-aware tokens
  const mobileTitleColor = "var(--foreground)";
  const mobileBodyColor = "var(--muted-foreground)";

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    new SplitType(titleScope.current, {
      types: "lines,chars,words",
      tagName: "span",
    });

    new SplitType(subtitleScope.current, {
      types: "lines,chars,words",
      tagName: "span",
    });
  }, []);

  // Intro animations
  useEffect(() => {
    if (!isIntroComplete) return;

    titleAnimate(
      titleScope.current.querySelectorAll(".word"),
      { translate: "0" },
      { duration: 0.5, delay: stagger(0.2) },
    );

    subtitleAnimate(
      subtitleScope.current.querySelectorAll(".word"),
      { translate: "0" },
      { duration: 0.5, delay: (i: number) => 0.4 + i * 0.1 },
    );
  }, [isIntroComplete]);

  return (
    <section className="relative" id="hero">
      <div className="grid md:grid-cols-12 md:h-screen items-stretch relative md:sticky top-0 md:overflow-hidden">
        <FluidBackground />

        {/* Left Side Content */}
        <div className="md:col-span-7 flex flex-col justify-center z-10 pointer-events-none mb-10 md:mb-0 relative">
          <div className="container max-w-full 2xl:max-w-[1050px] pointer-events-auto">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[45px] md:text-[50px] lg:text-[60px] xl:text-[65px] 2xl:text-[75px] leading-[1.1] tracking-tight mt-40 md:mt-0 uppercase"
              ref={titleScope}
              style={{
                color: isMobile ? mobileTitleColor : (textColor as any),
                fontWeight: isMobile ? 600 : fontWeight,
              }}
            >
              {t("title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl md:text-[20px] 2xl:text-[28px] mt-8 max-w-3xl pointer-events-auto leading-relaxed"
              ref={subtitleScope}
              style={{
                color: isMobile ? mobileBodyColor : (textColor as any),
              }}
            >
              {t("subtitle")}
            </motion.p>

            {/* CTA Buttons */}
            <div className="flex flex-col lg:flex-row md:items-start mt-10 items-start gap-3 pointer-events-auto">
              {/* Button 1: View Work */}
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={isIntroComplete ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div
                  style={{
                    color: isMobile ? mobileTitleColor : (textColor as any),
                  }}
                >
                  <Button
                    variant="secondary"
                    href="#projects"
                    className="text-[14px] md:text-[16px] border lg:border-2"
                    iconAfter={
                      <div className="overflow-hidden size-5">
                        <div className="h-5 w-10 flex group-hover/button:-translate-x-1/2 transition-transform duration-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
                            />
                          </svg>
                        </div>
                      </div>
                    }
                  >
                    <span>{t("viewWorkButton")}</span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Button 2: Download CV */}
              <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={isIntroComplete ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div
                  style={{
                    color: isMobile ? mobileTitleColor : (textColor as any),
                  }}
                >
                  <Button
                    variant="primary"
                    href="/Nikolay-Tetradov-CV.pdf"
                    className="text-[14px] md:text-[16px] hover:bg-green-700"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    iconAfter={
                      <div className="overflow-hidden size-5">
                        <div className="h-5 w-10 flex group-hover/button:-translate-x-1/2 transition-transform duration-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5h3c.83 0 1.5-.67 1.5-1.5V6c0-2.48 1.51-4.5 3.5-4.5s3.5 2.02 3.5 4.5v9c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5V6.71c0-2.58 2.17-4.71 4.71-4.71h3c2.58 0 4.71 2.13 4.71 4.71v9c0 .83.67 1.5 1.5 1.5z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5h3c.83 0 1.5-.67 1.5-1.5V6c0-2.48 1.51-4.5 3.5-4.5s3.5 2.02 3.5 4.5v9c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5V6.71c0-2.58 2.17-4.71 4.71-4.71h3c2.58 0 4.71 2.13 4.71 4.71v9c0 .83.67 1.5 1.5 1.5z"
                            />
                          </svg>
                        </div>
                      </div>
                    }
                  >
                    <span>{t("downloadCvButton")}</span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Button 3: Let's Talk */}
              <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={isIntroComplete ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.div
                  style={{
                    color: isMobile ? mobileTitleColor : (textColor as any),
                  }}
                >
                  <Button
                    variant="text"
                    href="#contact"
                    className="text-[14px] md:text-[16px]"
                  >
                    {t("letsTalkButton")}
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Side - Image Layout */}
        <div className="md:col-span-5 relative h-[550px] md:h-screen flex items-center md:items-stretch">
          <motion.div
            className="absolute inset-0 flex items-center justify-center md:justify-end origin-center"
            style={{
              width: portraitWidth,
              right: 0,
              marginLeft: "auto",
            }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-xl md:rounded-none">
              {/* Profile View (Left) */}
              <motion.div
                className="absolute inset-0 hidden md:block"
                style={{
                  opacity: sideFacingImageOpacity,
                  scale: imageScale,
                  rotateY: imageRotate,
                }}
              >
                <Image
                  src={sideFacingImage}
                  className="h-full w-full object-cover object-center md:object-[70%_center] lg:object-[65%_center]"
                  alt={t("portraitAlt")}
                  priority
                />
              </motion.div>

              {/* Front-Facing View (Desktop) */}
              <motion.div
                className="absolute inset-0 md:flex items-center justify-center hidden"
                style={{
                  opacity: frontOpacity,
                  scale: imageScale,
                }}
              >
                <Image
                  src={frontFacingImage}
                  className="h-full w-full object-cover object-center"
                  alt={t("portraitAltFront")}
                  priority
                />
              </motion.div>

              {/* Front-Facing View (Mobile Static) */}
              <div className="absolute inset-0 flex items-center justify-center md:hidden">
                <Image
                  src={frontFacingImage}
                  className="h-full w-full object-cover object-center"
                  alt={t("portraitAltFront")}
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Spacer for Scroll Triggers */}
      <div
        className="hidden md:block h-[200vh] relative"
        ref={scrollingDiv}
      ></div>
    </section>
  );
};

export default Hero;

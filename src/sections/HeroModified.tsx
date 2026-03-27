"use client";

import { useEffect, useRef, useState } from "react";
import heroImage from "@/assets/images/hero-image.jpg";
import aboutMeImage from "@/assets/images/nicolas2.png"; // Profile view (looking left)
import frontFacingImage from "@/assets/images/nicolas-front-1.png"; // Front-facing view
import Image from "next/image";
import Button from "@/components/Button";
import SplitType from "split-type";
import { useAnimate, motion, useScroll, useTransform } from "motion/react";
import { stagger } from "motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import FluidBackground from "@/components/FluidBackground";


const HeroModified = () => {
  const t = useTranslations("hero");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [titleScope, titleAnimate] = useAnimate();
  const [subtitleScope, subtitleAnimate] = useAnimate();
  const scrollingDiv = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false); // New state for mobile detection

  const { scrollYProgress } = useScroll({
    target: scrollingDiv,
    offset: ["start end", "end end"],
  });

  // Image widens from 100% to 240% as user scrolls
  //   const portraitWidth = useTransform(scrollYProgress, [0, 1], ["100%", "240%"]);
  const portraitWidth = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["100%", "170%"] : ["100%", "240%"], // Example: smaller range for mobile
  );

  // Image scales up slightly for dramatic effect
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Smoother, longer cross-fade between profile and front-facing image
  // Extended the range for smoother transitions on mobile
  const profileOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const frontOpacity = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

  // Optional: Slight rotation to simulate head turning
  const imageRotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  // Determine text colors based on theme
  // Light mode: Dark to Light (as the dark image covers it)
  // Dark mode: Light to Dark (as the light part of image covers it)
  const colors = mounted 
    ? (resolvedTheme === "dark" ? ["#ffffff", "#ede8e8ed"] : ["#000000", "#ffffff"])
    : ["#000000", "#ffffff"]; // Default to dark text for light-mode visibility

  const textColor = useTransform(
    scrollYProgress,
    [0.3, 0.8],
    colors
  );

  // Optional: Adjust font weight for better visibility/aesthetics
  const fontWeight = useTransform(
    scrollYProgress,
    [0.3, 0.9],
    [200, 500]
  );

  // Define mobile colors using CSS variables to be robust against hydration and theme-switching delays
  const mobileTitleColor = "var(--foreground)";
  const mobileBodyColor = "var(--muted-foreground)";

  useEffect(() => {
    setMounted(true);
    // Function to check if it's a mobile screen
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint is 768px
    };

    // Set initial state
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Title animation
    new SplitType(titleScope.current, {
      types: "lines,chars,words",
      tagName: "span",
    });

    titleAnimate(
      titleScope.current.querySelectorAll(".word"),
      {
        translate: "0",
      },
      { duration: 0.5, delay: stagger(0.2) }
    );

    // Subtitle animation
    new SplitType(subtitleScope.current, {
      types: "lines,chars,words",
      tagName: "span",
    });

    subtitleAnimate(
      subtitleScope.current.querySelectorAll(".word"),
      {
        translate: "0",
      },
      { duration: 0.5, delay: (i: number) => 2.0 + i * 0.1 }
    );
  }, []);

  return (
    <section className="relative" id="hero">
      <div className="grid md:grid-cols-12 md:h-screen items-stretch relative md:sticky top-0 md:overflow-hidden">
        <FluidBackground />
        {/* Left Side Content */}
        <div className="md:col-span-7 flex flex-col justify-center z-10 pointer-events-none mb-10 md:mb-0 relative">
          <div className="container max-w-full 2xl:max-w-[1030px] pointer-events-auto">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-5xl md:text-6xl lg:text-7xl mt-40 md:mt-0 uppercase tracking-tight font-semibold text-zinc-900! dark:text-zinc-100! md:text-inherit md:dark:text-inherit"
              ref={titleScope}
              style={{ color: isMobile ? "inherit" : textColor, fontWeight: isMobile ? 600 : fontWeight }} 
            >
              {t("title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl md:text-2xl mt-8 max-w-3xl pointer-events-auto leading-relaxed text-zinc-700! dark:text-zinc-300! md:text-inherit md:dark:text-inherit"
              ref={subtitleScope}
              style={{ color: isMobile ? "inherit" : textColor }}
            >
              {t("subtitle")}
            </motion.p>


            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row md:items-center mt-10 items-start gap-6 pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 3.6 }}
              >
                <motion.div 
                  style={{ color: isMobile ? "inherit" : textColor }}
                  className="text-zinc-900! dark:text-zinc-100! md:text-inherit md:dark:text-inherit"
                >
                  <Button
                    variant="secondary"
                    href="#projects"
                    iconAfter={
                    <div className="overflow-hidden size-5">
                      <div className="h-5 w-10 flex group-hover/button:-translate-x-1/2 transition-transform duration-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg "
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
                          xmlns="http://www.w3.org/2000/svg "
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

              <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 3.6 }}
              >
                <motion.div 
                  style={{ color: isMobile ? "inherit" : textColor }}
                  className="text-zinc-900! dark:text-zinc-100! md:text-inherit md:dark:text-inherit"
                >
                  <Button
                    variant="primary"
                    href="/Byhalova Natalia - CV.pdf"
                    className="hover:bg-red-orange-300"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    iconAfter={
                    <div className="overflow-hidden size-5">
                      <div className="h-5 w-10 flex group-hover/button:-translate-x-1/2 transition-transform duration-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg "
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
                          xmlns="http://www.w3.org/2000/svg "
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

              <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 4.1 }}
              >
                <motion.div 
                  style={{ color: isMobile ? "inherit" : textColor }}
                  className="text-zinc-900! dark:text-zinc-100! md:text-inherit md:dark:text-inherit"
                >
                  <Button variant="text" href="#contact">
                    {t("letsTalkButton")}
                  </Button>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Side - Image with scroll effects */}
        {/* FIXED: Better initial positioning for iPad and mobile */}
        <div className="md:col-span-5 relative h-[550px] md:h-screen flex items-center md:items-stretch">
          <motion.div
            className="absolute inset-0 flex items-center justify-center md:justify-end origin-center"
            style={{
              width: portraitWidth,
              right: 0,
              marginLeft: "auto",
            }}
          >
            {/* Container for both images */}
            <div className="relative w-full h-full overflow-hidden rounded-xl md:rounded-none">
              {/* Profile Image (Looking Left) - Fades out as you scroll on desktop */}
              <motion.div
                className="absolute inset-0 hidden md:block"
                style={{
                  opacity: profileOpacity,
                  scale: imageScale,
                  rotateY: imageRotate,
                }}
              >
                <Image
                  src={aboutMeImage}
                  className="h-full w-full object-cover object-center"
                  alt={t("portraitAlt")}
                  priority
                />
              </motion.div>

              {/* Front-Facing Image - Fades in as you scroll on desktop */}
              {/* FIXED: Centered positioning with object-center */}
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

              {/* Front-Facing Image - Static on mobile */}
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

      {/* Spacer for scroll animation */}
      {/* FIXED: Adjusted spacer height for better mobile experience by hiding it */}
      <div className="hidden md:block h-[200vh] relative" ref={scrollingDiv}></div>
    </section>
  );
};

export default HeroModified;

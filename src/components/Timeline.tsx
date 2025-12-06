"use client";

import { useScroll, useTransform, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

/**
 * Timeline Component
 * Displays work experience in a vertical timeline with scroll-based animations.
 * This component fetches its own data using `next-intl`.
 */
export interface TimelineEntry {
  flag: string;
  country: string;
  date: string;
  title: string;
  job: string;
  contents: string[];
}

export const Timeline = () => {
  const t = useTranslations("experiences");
  const data = t.raw("entries") as TimelineEntry[];
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Refs for measuring and tracking scroll position
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, expandedItems]);

  // Track scroll progress for animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 40%", "end 80%"],
  });

  // Transform values for scroll-based animations
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section className="section" id="experience" ref={containerRef}>
      <div className="container overflow-x-hidden">
        <h2 className="text-4xl md:text-7xl lg:text-8xl">{t("heading")}</h2>

        <div
          ref={ref}
          className="mx-auto relative mt-10 md:mt-16 lg:mt-20 pb-10 md:pb-16 lg:pb-20 max-w-5xl"
        >
          {data.map((item, index) => {
            const isExpanded = expandedItems.includes(index);
            return (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="flex justify-start pt-10 md:pt-16 lg:pt-20 md:gap-10 first:pt-0"
              >
                {/* Timeline marker and date section */}
                <div className="sticky z-10 flex flex-col items-center self-start max-w-xs md:flex-row top-40 lg:max-w-sm md:w-full">
                  {/* Country flag with animation */}
                  <motion.div
                    whileInView={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                    className="absolute flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 -left-[13px] md:-left-[15px] lg:-left-[25px]"
                  >
                    <Image
                      src={item.flag}
                      alt={item.country}
                      width={64}
                      height={64}
                      className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-stone-400 dark:border-stone-600 shadow-lg"
                    />
                  </motion.div>

                  {/* Desktop view date and title with staggered animation */}
                  <motion.div
                    whileInView={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                    className="flex-col hidden gap-2 text-xl font-bold md:flex md:pl-20 md:text-3xl lg:text-4xl text-stone-900 dark:text-stone-100"
                  >
                    <motion.h3
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                    >
                      {item.date}
                    </motion.h3>
                    <motion.h3
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                      className="text-2xl lg:text-3xl text-stone-700 dark:text-stone-300"
                    >
                      {item.title}
                    </motion.h3>
                    <motion.h3
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.6 }}
                      className="text-2xl lg:text-3xl text-stone-600 dark:text-stone-400"
                    >
                      {item.job}
                    </motion.h3>
                  </motion.div>
                </div>

                {/* Timeline content section */}
                <motion.div
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
                  className="relative w-full pl-16 pr-4 md:pl-4 md:pr-0"
                >
                  {/* Mobile view date and title with animation */}
                  <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                    className="block mb-4 text-xl font-bold text-left text-stone-900 dark:text-stone-100 md:hidden"
                  >
                    <h3 className="mb-1">{item.date}</h3>
                    <h3 className="text-lg text-stone-700 dark:text-stone-300">
                      {item.title}
                    </h3>
                    <h3 className="text-lg text-stone-600 dark:text-stone-400">
                      {item.job}
                    </h3>
                  </motion.div>

                  {/* Experience description with staggered content animation */}
                  <div>
                    <div
                      className={
                        !isExpanded ? "line-clamp-7 lg:line-clamp-none" : ""
                      }
                    >
                      {item.contents.map((content, contentIndex) => (
                        <motion.p
                          key={contentIndex}
                          whileInView={{ opacity: 1, y: 0 }}
                          initial={{ opacity: 0, y: 20 }}
                          transition={{
                            duration: 0.6,
                            delay: index * 0.2 + 0.6 + contentIndex * 0.1,
                          }}
                          className="mb-3 text-md md:text-xl 2xl:text-2xl font-normal text-stone-700 dark:text-stone-300"
                        >
                          {content}
                        </motion.p>
                      ))}
                    </div>
                    <button
                      onClick={() => toggleExpand(index)}
                      className="mt-2 font-semibold text-red-orange-500 hover:underline lg:hidden"
                    >
                      {isExpanded ? t("readLess") : t("readMore")}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}

          {/* Animated timeline line */}
          <motion.div
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              height: height + "px",
            }}
            className="absolute md:left-1 left-1 top-0 overflow-hidden w-0.5 bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-stone-400 dark:via-stone-600 to-transparent to-99% mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
          >
            {/* Scroll progress indicator */}
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-0.5 bg-linear-to-t from-red-orange-500 via-red-orange-300 to-transparent from-0% via-10% rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

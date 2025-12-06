"use client";

import { useScroll, useTransform, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Timeline Component
 * Displays work experience in a vertical timeline with scroll-based animations
 * @param {Array} data - Array of timeline entries containing work experience details
 */
export const Timeline = ({ data }) => {
  // Refs for measuring and tracking scroll position
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  // Track scroll progress for animation
  // Set up scroll tracking for the timeline container
  // The `target` is the container element
  // The `offset` option is an array of two values:
  // - `start 40%` means the animation will start when 40% of the container is scrolled into view
  // - `end 80%` means the animation will end when 80% of the container is scrolled out of view
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 40%", "end 80%"],
  });

  // Transform values for scroll-based animations
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="sm:px-10 px-5 lg:px-15 min-h-screen mt-20 md:mt-30"
      ref={containerRef}
    >
      {/* Animated title */}
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 1 }}
        className="font-bold text-3xl md:text-4xl"
      >
        My Work Experience
      </motion.h2>

      <div ref={ref} className="relative pb-20">
        {data.map((item, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            {/* Timeline marker and date section */}
            <div className="sticky z-40 flex flex-col items-center self-start max-w-xs md:flex-row top-40 lg:max-w-sm md:w-full">
              {/* Country flag with animation */}
              <motion.div
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                className="absolute flex items-center justify-center w-12 h-12 -left-[15px]"
              >
                <img
                  src={item.flag}
                  alt={item.country}
                  className="w-12 h-12 rounded-full object-cover border-2 border-neutral-700 shadow-lg"
                />
              </motion.div>

              {/* Desktop view date and title with staggered animation */}
              <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                className="flex-col hidden gap-2 text-xl font-bold md:flex md:pl-20 md:text-4xl text-neutral-300"
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
                  className="text-3xl text-neutral-400"
                >
                  {item.title}
                </motion.h3>
                <motion.h3
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.6 }}
                  className="text-3xl text-neutral-500"
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
              className="relative w-full pl-20 pr-4 md:pl-4"
            >
              {/* Mobile view date and title with animation */}
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                className="block mb-4 text-2xl font-bold text-left text-neutral-300 md:hidden"
              >
                <h3>{item.date}</h3>
                <h3>{item.job}</h3>
              </motion.div>

              {/* Experience description with staggered content animation */}
              {item.contents.map((content, contentIndex) => (
                <motion.p
                  key={contentIndex}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2 + 0.6 + contentIndex * 0.1,
                  }}
                  className="mb-3 font-normal text-neutral-400"
                >
                  {content}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        ))}

        {/* Animated timeline line */}
        <motion.div
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            height: height + "px",
          }}
          className="absolute md:left-1 left-1 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          {/* Scroll progress indicator */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-lavender/50 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </motion.div>
      </div>
    </div>
  );
};

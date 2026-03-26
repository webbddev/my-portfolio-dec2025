"use client";
import { projectsData } from "@/data/projects-data";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "../../i18n/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * Projects Section - Premium List View
 * Displays portfolio projects in a sophisticated, minimalist list with hover previews.
 */
const Projects = () => {
  const locale = useLocale();
  const t = useTranslations();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <section className="section bg-stone-50 dark:bg-zinc-950 transition-colors duration-500" id="projects">
      <div className="container">
        {/* Section Heading */}
        <div className="mb-12 md:mb-20 lg:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase leading-none">
            {t("projects.heading")}
          </h2>
          <p className="max-w-xs text-stone-500 dark:text-zinc-400 text-sm md:text-base uppercase tracking-widest font-medium">
            Exploring the boundary between sophisticated logic and refined user experience.
          </p>
        </div>

        {/* Project List */}
        <div className="flex flex-col border-t border-stone-200 dark:border-zinc-800">
          {projectsData.map(({ thumbnail, slug, id }) => (
            <Link
              key={slug}
              locale={locale}
              href={`/projects/${slug}`}
              onMouseEnter={() => setHoveredSlug(slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              className="group relative flex flex-col md:flex-row items-start md:items-center justify-between py-10 md:py-16 border-b border-stone-200 dark:border-zinc-800 transition-all duration-300"
            >
              {/* Row index/number */}
              <span className="hidden md:block text-stone-400 dark:text-zinc-600 font-mono text-sm group-hover:text-stone-900 dark:group-hover:text-white transition-colors duration-300">
                / 0{id}
              </span>

              {/* Project Title */}
              <div className="flex-1 md:px-12 z-10">
                <h3 className="text-3xl md:text-5xl lg:text-7xl font-semibold tracking-tight transition-all duration-500 group-hover:translate-x-2 md:group-hover:translate-x-4">
                  {t(`projectDetail.${slug}.title`)}
                </h3>
                <div className="mt-2 text-stone-500 dark:text-zinc-500 text-sm md:text-lg opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  {t(`projectDetail.${slug}.category`)}
                </div>
              </div>

              {/* Project Link Icon (Desktop) */}
              <div className="hidden md:flex items-center justify-center size-16 md:size-24 rounded-full border border-stone-200 dark:border-zinc-800 group-hover:bg-stone-900 group-hover:border-stone-900 dark:group-hover:bg-white dark:group-hover:border-white transition-all duration-500 overflow-hidden">
                <ArrowUpRight className="size-8 md:size-10 text-stone-400 dark:text-zinc-500 group-hover:text-white dark:group-hover:text-black transition-all duration-500 -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>

              {/* Mobile View Thumbnail (always visible small) */}
              <div className="mt-6 md:hidden w-full aspect-video rounded-sm overflow-hidden border border-stone-200 dark:border-zinc-800">
                <Image
                  src={thumbnail}
                  alt={t(`projectDetail.${slug}.title`)}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Hover Image Preview (Desktop) */}
              <AnimatePresence>
                {hoveredSlug === slug && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-[35%] lg:left-[45%] top-1/2 -translate-y-1/2 w-64 lg:w-96 aspect-video z-20 pointer-events-none rounded-lg overflow-hidden shadow-2xl -skew-x-2 -rotate-2"
                  >
                    <Image
                      src={thumbnail}
                      alt={t(`projectDetail.${slug}.title`)}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-stone-900/10 dark:bg-white/5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

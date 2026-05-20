"use client";

import React, { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { projectsData } from "@/data/projects-data";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "../../i18n/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

const CATEGORY_KEYS = [
  "all",
  "aiChatbot",
  "voiceAi",
  "automations",
  "landing"
];

export default function PortfolioGrid() {
  const [activeTab, setActiveTab] = useState("all");
  const locale = useLocale();
  const t = useTranslations("portfolioGrid");
  const tProjects = useTranslations("projectDetail");
  const router = useRouter();

  // Mapping existing projects to the requested categories
  const portfolioItems = [
    {
      ...projectsData.find((p) => p.slug === "personal-banker-app")!,
      categories: ["aiChatbot"],
    },
    {
      ...projectsData.find((p) => p.slug === "ai-journalist-1tv")!,
      categories: ["voiceAi", "automations"],
    },
    {
      ...projectsData.find((p) => p.slug === "residential-harmony")!,
      categories: ["landing"],
    },
  ];

  const filteredItems =
    activeTab === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.categories.includes(activeTab));

  const currentInfo = {
    title: t(`content.${activeTab}.title`),
    subtitle: t(`content.${activeTab}.subtitle`),
    features: t.raw(`content.${activeTab}.features`) as string[],
  };

  return (
    <section className="section container mx-auto py-20 px-4 md:px-8 bg-background transition-colors duration-500" id="portfolio">
      <h2 className="text-4xl md:text-7xl lg:text-8xl mb-16 text-foreground">{t("heading")}</h2>
      {/* --- FILTER TABS --- */}
      <div className="flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-4 border-b border-border mb-16">
        {CATEGORY_KEYS.map((catKey) => (
          <button
            key={catKey}
            onClick={() => setActiveTab(catKey)}
            className={`pb-6 text-sm lg:text-xl font-bold tracking-tighter transition-all relative cursor-pointer ${
              activeTab === catKey
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t(`categories.${catKey}`)}
            {activeTab === catKey && (
              <motion.span
                layoutId="activeTabIndicator"
                className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-foreground z-10"
              />
            )}
          </button>
        ))}
      </div>

      {/* --- GRID SYSTEM --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-border">
        {/* Dynamic Title Block */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-16 bg-card dark:bg-zinc-800/80 aspect-square border-r border-b border-border transition-all duration-500 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2
                className="text-xl sm:text-3xl md:text-[32px] lg:text-6xl font-black leading-[0.85] tracking-tighter mb-8 whitespace-pre-line text-foreground break-words"
              >
                {currentInfo.title}
              </h2>

              <div
                className="flex items-center gap-4 text-[10px] md:text-[12px] lg:text-[14px] font-black tracking-[0.4em] uppercase text-muted-foreground mb-8"
              >
                <div className="flex gap-1">
                  <span className="w-1 h-4 bg-foreground animate-pulse"></span>
                  <span className="w-1 h-4 bg-muted"></span>
                  <span className="w-1 h-4 bg-foreground"></span>
                </div>
                {currentInfo.subtitle}
              </div>

              <ul className="flex flex-col gap-4">
                {currentInfo.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    className="flex items-center gap-3 text-sm md:text-xl font-medium text-muted-foreground tracking-tight"
                  >
                    <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Project Blocks */}
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/projects/${item.slug}`}
                locale={locale}
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new Event("start-page-transition"));

                  setTimeout(() => {
                    router.push(`/projects/${item.slug}`);

                    setTimeout(() => {
                      window.dispatchEvent(new Event("end-page-transition"));
                    }, 100);
                  }, 400); // Overlay assumes 400ms fade-in
                }}
                className="group relative aspect-square w-full overflow-hidden bg-muted border-r border-b border-border cursor-pointer transform-gpu block"
              >
                <Image
                  src={item.thumbnail}
                  alt={tProjects(`${item.slug}.title`)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:blur-[2px]"
                />

                <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:bg-black/60" />

                <div className="absolute inset-0 px-6 py-3 lg:p-16 flex flex-col justify-end transition-all duration-500 transform-gpu group-hover:-translate-y-4">
                  <div className="transition-all duration-500">
                    <p className="text-[10px] md:text-[12px] lg:text-[14px] font-bold tracking-[0.25em] uppercase text-gray-300 mb-3">
                      {tProjects(`${item.slug}.category`)}
                    </p>
                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tighter leading-none whitespace-pre-line">
                      {tProjects(`${item.slug}.title`)}
                    </h3>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-white font-bold text-xs opacity-0 transition-all duration-500 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 uppercase tracking-widest">
                    {t("viewProject")}
                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

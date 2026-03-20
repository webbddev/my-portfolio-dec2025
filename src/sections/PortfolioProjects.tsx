"use client";
import React from "react";
import Button from "@/components/Button";
import { projectsData } from "@/data/projects-data";
import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "../../i18n/navigation";

const PortfolioProjects = () => {
  const locale = useLocale();
  const router = useRouter();

  const t = useTranslations();

  const classNames = [
    "md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-auto",
    "md:col-span-2 md:row-span-1 aspect-[4/5] md:aspect-auto",
    "md:col-span-2 md:row-span-1 aspect-video md:aspect-auto",
  ];

  return (
    <section className="section " id="projects">
      <div className="container">
        {/* Header Content */}
        <h2 className="text-4xl md:text-7xl lg:text-8xl mb-16">
          {t("projects.heading")}
        </h2>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[minmax(250px,auto)]">
          {projectsData.map((project, index) => (
            <Link
              key={project.slug}
              locale={locale}
              href={`/projects/${project.slug}`}
              className={`group/project relative overflow-hidden rounded-sm bg-zinc-100 hover:border-black transition-all duration-500 ${
                classNames[index % classNames.length]
              }`}
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new Event("start-page-transition"));
                
                setTimeout(() => {
                  router.push(`/projects/${project.slug}`);
                  
                  setTimeout(() => {
                    window.dispatchEvent(new Event("end-page-transition"));
                  }, 100);
                }, 400); // Overlay assumes 400ms fade-in
              }}
            >
              <Image
                src={project.thumbnail}
                alt={t("projects.imageAlt", {
                  name: t(`projectDetail.${project.slug}.title`),
                })}
                className="h-full w-full object-cover transition-transform duration-700 grayscale group-hover/project:grayscale-0 group-hover/project:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover/project:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                <div className="translate-y-2 group-hover/project:translate-y-0 transition-all duration-500">
                  <div className="flex justify-between items-end border-b border-white/30 pb-4">
                    <div>
                      <h3 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-tighter leading-none">
                        {t(`projectDetail.${project.slug}.title`)}
                      </h3>
                    </div>

                    <div className="shrink-0 -mb-1">
                      <Button
                        variant="secondary"
                        className="size-9 md:size-10 p-0 rounded-full bg-white border-white flex items-center justify-center overflow-hidden group-hover/project:bg-white hover:bg-white"
                        iconAfter={
                          <div className="size-5 md:size-6 overflow-hidden">
                            <div className="flex transition-transform duration-300 group-hover/project:-translate-x-5 md:group-hover/project:-translate-x-6">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="size-5 md:size-6 shrink-0 text-black"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                                />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="size-5 md:size-6 shrink-0 text-black"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                                />
                              </svg>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioProjects;

import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/data/projects-data";
import { getTranslations } from "next-intl/server";
import { ExternalLink, Github } from "lucide-react";
import ProjectGallery from "@/components/Gallery";
import { RouteTransitionLink } from "@/components/RouteTransitionLink";
import FluidBackground from "@/components/FluidBackground";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return notFound();

  const t = await getTranslations({ locale, namespace: "projectDetail" });
  const common = await getTranslations({ locale, namespace: "common" });

  const techStack = t.raw(`${slug}.techStack`) as string[];
  const keyFeatures = t.raw(`${slug}.keyFeatures`) as {
    featTitle: string;
    featDescription: string;
  }[];

  const liveLink = t(`${slug}.links.live`);
  const githubLink = t(`${slug}.links.github`);

  return (
    <div className="min-h-screen font-sans relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FluidBackground />
      </div>

      {/* Container max-width expands naturally at your 1920px breakpoint */}
      <main className="max-w-450 2xl:max-w-[1800px] mx-auto px-6 pt-20 pb-12 md:px-10 2xl:px-14 md:pt-30 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 2xl:gap-24">
          {/* Left Column: Details panel */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="mb-6">
              {/* Category label */}
              <span className="text-[14px] xl:text-[15px] 2xl:text-[17px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
                {t(`${slug}.category`)}
              </span>
              {/* Main App Title */}
              <h1 className="text-4xl md:text-5xl 2xl:text-6xl font-extrabold tracking-tight mb-6 leading-tight whitespace-pre-line wrap-break-word">
                {t(`${slug}.title`)}
              </h1>
              {/* Short Description */}
              <p className="text-muted-foreground dark:text-white/80 text-[17px] xl:text-[19px] 2xl:text-[21px] leading-relaxed tracking-wide md:tracking-[1px] mb-6">
                {t(`${slug}.shortOverview`)}
              </p>

              {/* Scaled links for ultra-wide environments */}
              {(liveLink || githubLink) && (
                <div className="flex flex-wrap gap-4 mt-2">
                  {liveLink && (
                    <a
                      href={liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 2xl:px-6 2xl:py-3 bg-stone-900 text-white rounded-md text-base 2xl:text-lg hover:bg-stone-700 transition-colors"
                    >
                      <ExternalLink size={16} className="2xl:w-5 2xl:h-5" />
                      Live Demo
                    </a>
                  )}
                  {githubLink && (
                    <a
                      href={githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 2xl:px-6 2xl:py-3 border border-border text-foreground rounded-md text-base 2xl:text-lg hover:bg-accent transition-colors"
                    >
                      <Github size={16} className="2xl:w-5 2xl:h-5" />
                      Source Code
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="h-px bg-border w-full mb-6" />

            {/* Meta tags with enhanced sizing hierarchy */}
            <div className="space-y-6 mb-8 2xl:space-y-7">
              <div>
                <span className="text-[14px] 2xl:text-[15px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1 block transition-colors duration-500">
                  {common("techStack")}
                </span>
                <span className="text-[17px] xl:text-[18px] 2xl:text-[20px] font-semibold leading-relaxed transition-colors duration-500">
                  {techStack.join(", ")}
                </span>
              </div>
              <div>
                <span className="text-[14px] 2xl:text-[15px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1 block transition-colors duration-500">
                  {common("industry")}
                </span>
                <span className="text-[17px] xl:text-[18px] 2xl:text-[20px] font-semibold transition-colors duration-500">
                  {t(`${slug}.industry`)}
                </span>
              </div>
              <div>
                <span className="text-[14px] 2xl:text-[15px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1 block transition-colors duration-500">
                  {common("role")}
                </span>
                <span className="text-[17px] xl:text-[18px] 2xl:text-[20px] font-semibold transition-colors duration-500">
                  {t(`${slug}.roleDescription`)}
                </span>
              </div>
            </div>

            <div className="h-px bg-border w-full mb-6 transition-colors duration-500" />

            {/* Left side mini Key Features list */}
            {keyFeatures && keyFeatures.length > 0 && (
              <div>
                <span className="text-[14px] 2xl:text-[15px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 block">
                  {common("keyFeaturesTitle")}
                </span>
                <div className="space-y-6 2xl:space-y-7">
                  {keyFeatures.map((feature, i) => (
                    <div key={i} className="group">
                      <h3 className="text-[17px] xl:text-[18px] 2xl:text-[20px] font-bold mb-2 group-hover:text-primary transition-colors">
                        {feature.featTitle}
                      </h3>
                      <p className="text-[16px] xl:text-[18px] 2xl:text-[19px] text-muted-foreground leading-relaxed tracking-wider">
                        {feature.featDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Hero Assets & Detailed Copy */}
          <div className="lg:col-span-8">
            <div className="relative rounded-2xl overflow-hidden bg-muted mb-8 border border-border shadow-sm aspect-16/10 w-full transition-colors duration-2000">
              {project?.thumbnail ? (
                <Image
                  src={project.thumbnail}
                  alt={t(`${slug}.title`)}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400">
                  No thumbnail available
                </div>
              )}
            </div>

            <div className="w-full">
              {/* Detailed Overview paragraph scaled up */}
              <p className="text-[18px] md:text-[20px] 2xl:text-[22px] text-foreground/90 leading-relaxed tracking-wide md:tracking-[1px] mb-10 2xl:mb-12">
                {t(`${slug}.detailedOverview`)}
              </p>

              <section className="mb-12">
                {/* Challenge and Solution Title */}
                <h2 className="text-2xl md:text-3xl 2xl:text-4xl font-bold mb-4">
                  {common("challengeAndSolutionTitle")}
                </h2>
                {/* Challenge and Solution Text Description */}
                <p className="text-[17px] md:text-[20px] 2xl:text-[21px] text-muted-foreground leading-relaxed tracking-wide md:tracking-[1px] mb-10">
                  {t(`${slug}.challengeAndSolutionDescription`)}
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Project Gallery header context */}
        {project?.gallery && (
          <div className="mt-4 lg:mt-8 2xl:mt-14">
            <h2 className="font-bold mb-6 text-left md:text-center uppercase tracking-[0.3em] text-base 2xl:text-lg text-muted-foreground/50">
              {common("projectGallery")}
            </h2>
            <ProjectGallery gallery={project.gallery} />
          </div>
        )}

        {/* Navigation back button */}
        <div className="pt-12 mt-12 border-t border-border flex justify-center lg:justify-start">
          <RouteTransitionLink
            href="/#projects"
            locale={locale}
            className="inline-flex items-center px-8 py-4 2xl:px-10 2xl:py-5 bg-stone-900/10 dark:bg-white/20 border border-stone-900/10 dark:border-white/15 text-stone-800 dark:text-stone-200 backdrop-blur-sm rounded-md hover:bg-stone-900/20 dark:hover:bg-white/10 shadow-sm hover:shadow-md transition-all duration-500 text-base 2xl:text-lg"
          >
            <span className="mr-3">{"←"}</span>
            {common("backToProjects")}
          </RouteTransitionLink>
        </div>
      </main>
    </div>
  );
}

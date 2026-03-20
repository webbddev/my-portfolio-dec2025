import Image from 'next/image';
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/data/projects-data";
import { getTranslations } from "next-intl/server";
import { ExternalLink, Github } from 'lucide-react';
import ProjectGallery from '@/components/Gallery';
import { RouteTransitionLink } from '@/components/RouteTransitionLink';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

// Optional SEO Metadata for Next.js - Uncomment and adapt if needed
/*
export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "projectDetail" });
  return {
    title: t(`${slug}.title`),
    description: t(`${slug}.shortOverview`)
  };
}
*/

export default async function ProjectDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return notFound();

  // Get translations
  const t = await getTranslations({ locale, namespace: "projectDetail" });
  const common = await getTranslations({ locale, namespace: "common" });

  const techStack = t.raw(`${slug}.techStack`) as string[];
  const keyFeatures = t.raw(`${slug}.keyFeatures`) as { featTitle: string; featDescription: string }[];
  
  const liveLink = t(`${slug}.links.live`);
  const githubLink = t(`${slug}.links.github`);

  return (
    <div className="min-h-screen font-sans">
      <main className="max-w-400 mx-auto px-6 pt-20 pb-12 md:px-10 md:pt-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Fixed Sidebar */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="mb-6">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/80 mb-3 block">
                {t(`${slug}.category`)}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight break-all wrap-break-word">
                {t(`${slug}.title`)}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
                {t(`${slug}.shortOverview`)}
              </p>

              {/* Project Links */}
              {(liveLink || githubLink) && (
                <div className="flex flex-wrap gap-4 mt-2">
                  {liveLink && (
                    <a
                      href={liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-md text-sm hover:bg-stone-700 transition-colors"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                  {githubLink && (
                    <a
                      href={githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-md text-sm hover:bg-accent transition-colors"
                    >
                      <Github size={16} />
                      Source Code
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="h-px bg-border w-full mb-6" />

            {/* Metadata Section */}
            <div className="space-y-6 mb-8">
              <div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-1 block transition-colors duration-500">
                  {common("techStack")}
                </span>
                <span className="text-sm md:text-base font-semibold leading-relaxed transition-colors duration-500">
                  {techStack.join(", ")}
                </span>
              </div>
              <div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-1 block transition-colors duration-500">
                  {common("industry")}
                </span>
                <span className="text-sm md:text-base font-semibold transition-colors duration-500">
                  {t(`${slug}.industry`)}
                </span>
              </div>
              <div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-1 block transition-colors duration-500">
                  {common("role")}
                </span>
                <span className="text-sm md:text-base font-semibold transition-colors duration-500">
                  {t(`${slug}.roleDescription`)}
                </span>
              </div>
            </div>

            <div className="h-px bg-border w-full mb-6 transition-colors duration-500" />

            {/* Features Sidebar */}
            {keyFeatures && keyFeatures.length > 0 && (
              <div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 block">
                  {common("keyFeaturesTitle")}
                </span>
                <div className="space-y-6">
                  {keyFeatures.map((feature, i) => (
                    <div key={i} className="group">
                      <h3 className="text-sm md:text-base font-bold mb-2 group-hover:text-primary transition-colors">
                        {feature.featTitle}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {feature.featDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back Button for mobile view could go here, but let's keep it at the very bottom */}
          </div>

          {/* Right Column: All content here spans the width of the main image */}
          <div className="lg:col-span-8">
            {/* Main Hero Image */}
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

            {/* Content Body - Spans Full Column Width */}
            <div className="w-full">
              <p className="text-xl md:text-2xl text-foreground/90 font-medium leading-relaxed mb-10">
                {t(`${slug}.detailedOverview`)}
              </p>

              {/* The Challenge and Solution Section */}
              <section className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {common("challengeAndSolutionTitle")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-10 text-lg">
                  {t(`${slug}.challengeAndSolutionDescription`)}
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Gallery Section at the bottom */}
        {project?.gallery && (
          <div className="mt-4 lg:mt-8">
            <h2 className="font-bold mb-0 text-left md:text-center uppercase tracking-[0.3em] text-[10px] md:text-xs text-muted-foreground/50">
              {common("projectGallery")}
            </h2>
            <ProjectGallery gallery={project.gallery} />
          </div>
        )}

        {/* Back Button Wrapper */}
        <div className="pt-12 mt-12 border-t border-border flex justify-center lg:justify-start">
          <RouteTransitionLink
            href="/#projects"
            locale={locale}
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all duration-500 shadow-lg hover:shadow-xl dark:shadow-primary/10"
          >
            <span className="mr-3">{"←"}</span>
            {common("backToProjects")}
          </RouteTransitionLink>
        </div>
      </main>
    </div>
  );
}
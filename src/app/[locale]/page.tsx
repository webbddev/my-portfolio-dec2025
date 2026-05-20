import {
  FAQs,
  Footer,
  Hero,
  Intro,
  KeyStrengths,
  PortfolioGrid,
  PortfolioProjects,
  Projects,
  Testimonials,
  WorkExperience,
} from "@/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      {/* <PortfolioProjects /> */}
      {/* <PortfolioGrid_v2 /> */}
      <PortfolioGrid />
      {/* <Projects /> */}
      <WorkExperience />
      <Testimonials />
      <FAQs />
      <KeyStrengths />
      <Footer />
    </>
  );
}

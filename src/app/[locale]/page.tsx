import PortfolioGrid_v2 from "@/codeFromOtherProject/PortfolioGrid_v2";
import SkiperuiCard from "@/codeFromOtherProject/Skiper";
import {
  FAQs,
  Footer,
  Header,
  Hero,
  HeroModified,
  Intro,
  KeyStrengths,
  PortfolioProjects,
  Projects,
  Testimonials,
  Testimonials_NoImage,
  WorkExperience,
} from "@/sections";

export default function Home() {
  return (
    <>
      {/* <Header /> */}
      {/* <Hero /> */}
      <HeroModified />
      <Intro />
      {/* <SkiperuiCard /> */}
      <PortfolioProjects />
      {/* <PortfolioGrid_v2 /> */}
      {/* <Projects /> */}
      <WorkExperience />
      <Testimonials_NoImage />
      {/* <Testimonials /> */}
      <FAQs />
      <KeyStrengths />
      <Footer />
    </>
  );
}

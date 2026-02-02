import KeyStrengths from "@/codeFromOtherProject/KeyStrengths";
import PortfolioGrid_v1 from "@/codeFromOtherProject/PortfolioGrid_v1";
import PortfolioGrid_v2 from "@/codeFromOtherProject/PortfolioGrid_v2";
import SkiperuiCard from "@/codeFromOtherProject/Skiper";
import WorkExperience from "@/components/WorkExperience";
import {
  FAQs,
  Footer,
  Header,
  Hero,
  HeroModified,
  Intro,
  Projects,
  Testimonials,
  Testimonials_NoImage,
} from "@/sections";

export default function Home() {
  return (
    <>
      {/* <Header /> */}
      {/* <Hero /> */}
      <HeroModified />
      <Intro />
      {/* <SkiperuiCard /> */}
      <PortfolioGrid_v1 />
      {/* <PortfolioGrid_v2 /> */}
      <Projects />
      <WorkExperience />
      <Testimonials_NoImage />
      {/* <Testimonials /> */}
      <FAQs />
      <KeyStrengths />
      <Footer />
    </>
  );
}

import WorkExperience from "@/components/WorkExperience";
import {
  FAQs,
  Footer,
  Header,
  Hero,
  Intro,
  Projects,
  Testimonials,
  Testimonials_NoImage,
} from "@/sections";

export default function Home() {
  return (
    <>
      {/* <Header /> */}
      <Hero />
      <Intro />
      <Projects />
      <WorkExperience />
      <Testimonials_NoImage />
      {/* <Testimonials /> */}
      <FAQs />
      <Footer />
    </>
  );
}

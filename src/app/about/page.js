import AboutHero from "./_components/AboutHero";
import Story from "./_components/Story";
import Why from "./_components/Why";
import Drives from "./_components/Drives";
import HowWeWork from "./_components/HowWeWork";
import AboutCTA from "./_components/AboutCTA";

export const metadata = {
  title: "About | Growth Station",
  description: "Why Growth Station exists, what makes us different, and who we build growth for in Egypt and the GCC.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <Story />
      <Why />
      <Drives />
      <HowWeWork />
      <AboutCTA />
    </main>
  );
}

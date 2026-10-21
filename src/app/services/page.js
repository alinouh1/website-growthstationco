import ServiceHero from "./_components/ServiceHero";
import Ribbon from "./_components/Ribbon";
import ServiceShowcase from "./_components/ServiceShowcase";
import WhyUs from "./_components/WhyUs";
import ServiceCTA from "./_components/ServiceCTA";
export const metadata = { title: "Services | Growth Station" };

export default function ServicePage() {
  return (
    <main>
      <ServiceHero />
      <Ribbon />
      <ServiceShowcase />
      <WhyUs />
      <ServiceCTA />
    </main>
  );
}

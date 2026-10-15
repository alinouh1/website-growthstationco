import Hero from "./_home/Hero";
import Ribbon from "./_home/Ribbon";
import Services from "./_home/Services";
import Gallery from "./_home/Gallery";
import Approach from "./_home/Approach";
import Why from "./_home/Why";
import Process from "./_home/Process";
import Team from "./_home/Team";
import Recruiting from "./_home/Recruiting";

export default function Home() {
  return (
    <main>
      <Hero />
      <Ribbon />
      {/* المعرض جوه نفس سكشن الخدمات: نفس الخلفية ومفيش خط فاصل */}
      <Services><Gallery /></Services>
      <Approach />
      <Why />
      <Process />
      <Team />
      <Recruiting />
    </main>
  );
}

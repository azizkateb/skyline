import { AboutSection } from "@/components/about-section";
import { Showcase } from "@/components/showcase";
import { Features } from "@/components/features";
import { Comparison } from "@/components/comparison";
import { Testimonials } from "@/components/testimonials";
import { Stats } from "@/components/stats";
import { Resources } from "@/components/resources";
import { CtaBanner } from "@/components/cta-banner";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";

export default function Home() {
  return (
    <main id="main-content" className="homepage">
      <Hero />
      <Reveal delay={0.05}><AboutSection /></Reveal>
      <Reveal delay={0.06}><Features /></Reveal>
      <Reveal delay={0.07}><Showcase /></Reveal>
      <Reveal delay={0.08}><Comparison /></Reveal>
      <Reveal delay={0.09}><Testimonials /></Reveal>
      <Reveal delay={0.10}><Stats /></Reveal>
      <Reveal delay={0.11}><Resources /></Reveal>
      <Reveal delay={0.12}><CtaBanner /></Reveal>
      <Footer />
    </main>
  );
}

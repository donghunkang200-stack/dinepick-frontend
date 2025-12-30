import Layout from "../components/layout/Layout";
import Hero from "../components/home/Hero";
import CategoryChips from "../components/home/CategoryChips";
import SectionGrid from "../components/home/SectionGrid";
import Testimonials from "../components/home/Testimonials";
import CTASection from "../components/home/CTASection";

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <CategoryChips />

      <SectionGrid title="섹션 제목" />
      <SectionGrid title="섹션 제목" />
      <SectionGrid title="섹션 제목" />

      <Testimonials />
      <CTASection />
    </Layout>
  );
}

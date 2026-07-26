import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { VideoSection } from "@/components/home/video-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { ServicesSection } from "@/components/home/services-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dename Agricultural Supplier | Ethiopia's Premier B2B Agricultural supply platform",
  description:
    "Dename Agricultural Supplier — Hosaena, Hadiya Zone, Ethiopia. Multi-product agricultural supply: ginger, coffee, rosemary, turmeric, garlic, cardamom, black pepper, and honey for bulk buyers and exporters.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <VideoSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <ServicesSection />
      <TestimonialsSection />
    </>
  );
}

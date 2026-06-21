import HeroSection from "@/components/HeroSection";
import FeaturedBooks from "@/components/FeaturedBooks";
import TopLibrarians from "@/components/TopLibrarians";
import PopularCategories from "@/components/PopularCategories";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <FeaturedBooks />

      <TopLibrarians />

      <PopularCategories />
    </>
  );
}

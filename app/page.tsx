import { HeroSection } from "@/components/hero-section"
import { FeaturedListings } from "@/components/featured-listings"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedListings />
      <FeaturesSection />
      <Footer />
    </>
  )
}

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PromoBannerStrip from "@/components/PromoBannerStrip";
import { PromoBannerPlacement } from "@prisma/client";
import NewArrivals from "@/components/NewArrivals";
import CuratedRituals from "@/components/CuratedRituals";
import JournalSection from "@/components/JournalSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <HeroSection />
        <div className="max-w-7xl mx-auto px-8 mt-4 mb-8">
          <PromoBannerStrip placement={PromoBannerPlacement.HOME} />
        </div>
        <NewArrivals />
        <CuratedRituals />
        <JournalSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}

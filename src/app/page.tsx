import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
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
        <NewArrivals />
        <CuratedRituals />
        <JournalSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicPromoBannerZone from "@/components/DynamicPromoBannerZone";
import CartClient from "./CartClient";

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto min-h-screen">
        <div className="mb-10 space-y-8">
          <DynamicPromoBannerZone zone="cart.top" />
          <DynamicPromoBannerZone zone="cart.coupon" />
        </div>
        <CartClient />
        <div className="mt-14">
          <DynamicPromoBannerZone zone="cart.bottom" />
        </div>
      </main>
      <Footer />
    </>
  );
}

import BannerForm, { type BannerInitial } from "../BannerForm";
import { PromoBannerPlacement } from "@prisma/client";

export default function NewBannerPage() {
  const initial: BannerInitial = {
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    linkLabel: "",
    sortOrder: 0,
    isActive: true,
    autoplayMs: 6000,
    placement: PromoBannerPlacement.COUPON,
  };

  return <BannerForm initial={initial} backHref="/admin/coupons" />;
}

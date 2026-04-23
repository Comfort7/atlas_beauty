import PromoBannerStrip from "@/components/PromoBannerStrip";
import { getBannerPlacementForZone, type BannerZoneId } from "@/lib/homepage-layout";

type Props = {
  zone: BannerZoneId;
  className?: string;
};

export default async function DynamicPromoBannerZone({ zone, className }: Props) {
  const placement = await getBannerPlacementForZone(zone);
  if (!placement) return null;
  return <PromoBannerStrip placement={placement} className={className} />;
}

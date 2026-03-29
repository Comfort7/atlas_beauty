import { SHIPPING_METHODS } from "@/lib/constants";

interface ShippingRate {
  id: string;
  name: string;
  description: string;
  rate: number;
  estimatedDays: string;
}

export const shippingService = {
  calculateRates(
    subtotal: number,
    _weight?: number,
    _country?: string
  ): ShippingRate[] {
    const rates: ShippingRate[] = [];

    for (const method of Object.values(SHIPPING_METHODS)) {
      let rate: number = method.baseRate;

      // Free shipping threshold
      if (method.freeThreshold && subtotal >= method.freeThreshold) {
        rate = 0;
      }

      rates.push({
        id: method.id,
        name: method.name,
        description: method.description,
        rate,
        estimatedDays: method.description,
      });
    }

    return rates;
  },
};

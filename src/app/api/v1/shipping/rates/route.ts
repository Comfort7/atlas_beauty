import { NextRequest } from "next/server";
import { shippingService } from "@/services/shipping.service";
import { validateBody } from "@/helpers/validate-request";
import { successResponse, handleError } from "@/helpers/api-response";
import { z } from "zod";

const shippingRateSchema = z.object({
  subtotal: z.number().min(0),
  weight: z.number().min(0).optional(),
  country: z.string().length(2).default("US"),
});

// POST /api/v1/shipping/rates
export async function POST(request: NextRequest) {
  try {
    const result = await validateBody(request, shippingRateSchema);
    if ("error" in result) return result.error;

    const rates = shippingService.calculateRates(
      result.data.subtotal,
      result.data.weight,
      result.data.country
    );

    return successResponse(rates);
  } catch (error) {
    return handleError(error);
  }
}

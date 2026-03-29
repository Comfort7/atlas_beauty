import { NextRequest } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { successResponse, handleError, errorResponse } from "@/helpers/api-response";
import { withAdmin } from "@/helpers/auth-guard";

// POST /api/v1/admin/images - Upload image to Cloudinary
export const POST = withAdmin(async (request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return errorResponse("No file provided", 400, "VALIDATION_ERROR");
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse(
        "Invalid file type. Allowed: JPEG, PNG, WebP, GIF",
        400,
        "VALIDATION_ERROR"
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return errorResponse("File too large. Maximum 5MB", 400, "VALIDATION_ERROR");
    }

    // Convert to base64 data URI for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const folder = (formData.get("folder") as string) || "atlas-beauty/products";
    const result = await uploadImage(base64, folder);

    return successResponse(result, 201);
  } catch (error) {
    return handleError(error);
  }
});

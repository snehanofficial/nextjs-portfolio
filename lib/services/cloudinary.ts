import { z } from "zod";

const cloudinaryEnvSchema = z.object({
  cloudName: z.string().min(1),
  apiKey: z.string().min(1),
  apiSecret: z.string().min(1),
});

function getCloudinaryEnv() {
  const parsed = cloudinaryEnvSchema.safeParse({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  });

  if (!parsed.success) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  return parsed.data;
}

export type UploadedAsset = {
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: "IMAGE" | "RAW" | "VIDEO";
  format: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  originalName: string | null;
};

function basicAuthHeader(apiKey: string, apiSecret: string) {
  const encoded = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  return `Basic ${encoded}`;
}

function normalizeResourceType(resourceType: string): UploadedAsset["resourceType"] {
  if (resourceType === "video") {
    return "VIDEO";
  }

  if (resourceType === "raw") {
    return "RAW";
  }

  return "IMAGE";
}

export async function uploadToCloudinary(
  file: File,
  resourceType: "image" | "raw",
  folder: string,
) {
  const { apiKey, apiSecret, cloudName } = getCloudinaryEnv();
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const formData = new FormData();

  formData.set("file", file);
  formData.set("folder", folder);
  formData.set("use_filename", "true");
  formData.set("unique_filename", "true");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(apiKey, apiSecret),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Cloudinary upload failed.");
  }

  const payload = (await response.json()) as Record<string, unknown>;

  return {
    publicId: String(payload.public_id ?? ""),
    url: String(payload.url ?? ""),
    secureUrl: String(payload.secure_url ?? ""),
    resourceType: normalizeResourceType(String(payload.resource_type ?? resourceType)),
    format: payload.format ? String(payload.format) : null,
    width: typeof payload.width === "number" ? payload.width : null,
    height: typeof payload.height === "number" ? payload.height : null,
    bytes: typeof payload.bytes === "number" ? payload.bytes : null,
    originalName: payload.original_filename
      ? String(payload.original_filename)
      : file.name || null,
  } satisfies UploadedAsset;
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "raw" | "video",
) {
  const { apiKey, apiSecret, cloudName } = getCloudinaryEnv();
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`;
  const formData = new FormData();

  formData.set("public_id", publicId);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(apiKey, apiSecret),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Cloudinary delete failed.");
  }
}

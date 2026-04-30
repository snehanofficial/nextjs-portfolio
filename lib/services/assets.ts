import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary, type UploadedAsset } from "@/lib/services/cloudinary";

export async function upsertAssetRecord(
  asset: UploadedAsset,
  altText?: string | null,
) {
  return prisma.asset.upsert({
    where: { publicId: asset.publicId },
    create: {
      publicId: asset.publicId,
      url: asset.url,
      secureUrl: asset.secureUrl,
      resourceType: asset.resourceType,
      format: asset.format,
      width: asset.width,
      height: asset.height,
      bytes: asset.bytes,
      originalName: asset.originalName,
      altText: altText ?? null,
    },
    update: {
      url: asset.url,
      secureUrl: asset.secureUrl,
      resourceType: asset.resourceType,
      format: asset.format,
      width: asset.width,
      height: asset.height,
      bytes: asset.bytes,
      originalName: asset.originalName,
      altText: altText ?? null,
    },
  });
}

export async function isAssetOrphaned(assetId: string) {
  const [projectCount, skillCount, resumeCount] = await Promise.all([
    prisma.project.count({ where: { coverAssetId: assetId } }),
    prisma.skill.count({ where: { logoAssetId: assetId } }),
    prisma.resume.count({ where: { assetId } }),
  ]);

  return projectCount + skillCount + resumeCount === 0;
}

export async function deleteAssetIfOrphaned(assetId: string) {
  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });

  if (!asset) {
    return false;
  }

  const orphaned = await isAssetOrphaned(assetId);

  if (!orphaned) {
    return false;
  }

  await deleteFromCloudinary(
    asset.publicId,
    asset.resourceType === "RAW"
      ? "raw"
      : asset.resourceType === "VIDEO"
        ? "video"
        : "image",
  );

  await prisma.asset.delete({
    where: { id: assetId },
  });

  return true;
}

export async function listOrphanedAssets() {
  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "asc" },
  });

  const orphaned: typeof assets = [];

  for (const asset of assets) {
    if (await isAssetOrphaned(asset.id)) {
      orphaned.push(asset);
    }
  }

  return orphaned;
}

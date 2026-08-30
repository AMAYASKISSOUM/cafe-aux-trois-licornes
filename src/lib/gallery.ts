import { GALLERY_IMAGES, type GalleryImageDef } from "@/lib/gallery-data";

/** Data-access seam: swap the body for a Drizzle query once gallery_images is seeded. */
export async function getGalleryImages(): Promise<GalleryImageDef[]> {
  return GALLERY_IMAGES.slice().sort((a, b) => a.order - b.order);
}

export async function getGalleryPreview(limit = 6): Promise<GalleryImageDef[]> {
  return (await getGalleryImages()).slice(0, limit);
}

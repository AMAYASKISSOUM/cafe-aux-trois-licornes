import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { buttonVariants } from "@/components/ui/button";
import { getGalleryPreview } from "@/lib/gallery";
import { localized } from "@/lib/i18n-utils";
import { cn } from "@/lib/cn";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

const MOSAIC_SPANS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

export async function GalleryPreview() {
  const [t, tCommon, locale] = await Promise.all([
    getTranslations("home.galleryPreview"),
    getTranslations("common"),
    getLocale(),
  ]);
  const images = await getGalleryPreview(6);

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} />
          <Link href="/galerie" className={buttonVariants({ variant: "secondary", size: "sm" })}>
            {tCommon("seeAll")}
          </Link>
        </div>

        {/* Mobile: horizontal snap strip */}
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:hidden">
          {images.map((img) => (
            <div key={img.slug} className="aspect-[4/5] w-[72vw] flex-none snap-start">
              <ImagePlaceholder label={localized(img.label, locale)} className="h-full w-full" />
            </div>
          ))}
        </div>

        {/* Desktop: editorial mosaic */}
        <RevealGroup
          className="mt-10 hidden auto-rows-[minmax(140px,1fr)] grid-cols-4 grid-rows-2 gap-3 sm:grid"
          style={{ gridAutoFlow: "dense" }}
        >
          {images.map((img, i) => (
            <RevealItem key={img.slug} className={cn("h-full w-full", MOSAIC_SPANS[i % MOSAIC_SPANS.length])}>
              <ImagePlaceholder label={localized(img.label, locale)} className="h-full w-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

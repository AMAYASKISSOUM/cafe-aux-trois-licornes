import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants, ButtonArrow } from "@/components/ui/button";
import { getGalleryPreview } from "@/lib/gallery";
import { localized } from "@/lib/i18n-utils";
import { Reveal } from "@/components/ui/reveal";
import { GalleryPreviewInteractive } from "@/components/home/gallery-preview-interactive";

export async function GalleryPreview() {
  const [t, tCommon, locale] = await Promise.all([
    getTranslations("home.galleryPreview"),
    getTranslations("common"),
    getLocale(),
  ]);
  const images = await getGalleryPreview(6);
  const localizedImages = images.map((img) => ({
    slug: img.slug,
    src: img.src,
    ratio: img.ratio,
    alt: localized(img.label, locale),
  }));

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={t("eyebrow")} heading={t("heading")} reveal="line" />
          <Link href="/galerie" className={buttonVariants({ variant: "secondary", size: "sm" })}>
            {tCommon("seeAll")}
            <ButtonArrow />
          </Link>
        </Reveal>

        <GalleryPreviewInteractive
          images={localizedImages}
          labels={{
            close: tCommon("close"),
            previous: tCommon("previous"),
            next: tCommon("next"),
            openImage: tCommon("openImage"),
          }}
        />
      </Container>
    </section>
  );
}

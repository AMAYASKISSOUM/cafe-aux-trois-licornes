import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { getGalleryImages } from "@/lib/gallery";
import { localized } from "@/lib/i18n-utils";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { GalleryMasonry } from "@/components/gallery/gallery-masonry";

export async function generateMetadata({ params }: PageProps<"/[locale]/galerie">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "galleryPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/galerie", locale),
  };
}

export default async function GalleryPage({ params }: PageProps<"/[locale]/galerie">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tCommon] = await Promise.all([getTranslations("galleryPage"), getTranslations("common")]);
  const images = await getGalleryImages();
  const localizedImages = images.map((img) => ({
    slug: img.slug,
    src: img.src,
    ratio: img.ratio,
    alt: localized(img.label, locale),
  }));

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} heading={t("heading")} intro={t("intro")} />
      <Container className="py-16 sm:py-20">
        <GalleryMasonry
          images={localizedImages}
          labels={{
            close: tCommon("close"),
            previous: tCommon("previous"),
            next: tCommon("next"),
            openImage: tCommon("openImage"),
          }}
        />
      </Container>
    </>
  );
}

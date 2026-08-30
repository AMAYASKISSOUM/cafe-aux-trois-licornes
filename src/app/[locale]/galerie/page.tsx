import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { getGalleryImages } from "@/lib/gallery";
import { localized } from "@/lib/i18n-utils";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Photo } from "@/components/ui/photo";

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
  const t = await getTranslations("galleryPage");
  const images = await getGalleryImages();

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} heading={t("heading")} intro={t("intro")} />
      <Container className="py-16 sm:py-20">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((img) => (
            <div key={img.slug} className="mb-4 break-inside-avoid">
              <Photo
                alt={localized(img.label, locale)}
                label={localized(img.label, locale)}
                ratio={img.ratio}
                src={img.src}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}

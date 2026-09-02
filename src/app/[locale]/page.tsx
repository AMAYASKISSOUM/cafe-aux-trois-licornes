import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { FeaturedMenu } from "@/components/home/featured-menu";
import { Experience } from "@/components/home/experience";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { EditorialBand } from "@/components/home/editorial-band";
import { ReviewsSection } from "@/components/home/reviews-section";
import { ReservationCta } from "@/components/home/reservation-cta";
import { LocationSection } from "@/components/home/location-section";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: buildAlternates("/", locale) };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Intro />
      <FeaturedMenu />
      <Experience />
      <GalleryPreview />
      <EditorialBand />
      <ReviewsSection />
      <ReservationCta />
      <LocationSection />
    </>
  );
}

import type { AppPathname } from "@/i18n/routing";

export interface NavItem {
  href: AppPathname;
  labelKey: "home" | "menu" | "about" | "gallery" | "reviews" | "contact";
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/menu", labelKey: "menu" },
  { href: "/a-propos", labelKey: "about" },
  { href: "/galerie", labelKey: "gallery" },
  { href: "/avis", labelKey: "reviews" },
  { href: "/contact", labelKey: "contact" },
];

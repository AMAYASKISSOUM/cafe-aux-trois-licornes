import { localized } from "@/lib/i18n-utils";

interface CategoryLike {
  slug: string;
  name: { fr: string; en: string };
}

export function CategoryNav({
  categories,
  locale,
}: {
  categories: CategoryLike[];
  locale: string;
}) {
  return (
    <nav aria-label="Catégories" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {categories.map((c) => (
        <a
          key={c.slug}
          href={`#${c.slug}`}
          className="flex-none whitespace-nowrap rounded-[var(--radius-sm)] border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-petrol hover:text-petrol-ink"
        >
          {localized(c.name, locale)}
        </a>
      ))}
    </nav>
  );
}

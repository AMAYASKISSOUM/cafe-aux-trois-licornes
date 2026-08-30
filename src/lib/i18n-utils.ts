export function localized(field: { fr: string; en: string }, locale: string): string {
  return locale === "en" ? field.en : field.fr;
}

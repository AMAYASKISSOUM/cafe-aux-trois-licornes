import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on every page route except API routes, the admin app, Next internals,
  // root-level generated metadata routes (icon/apple-icon have no extension in
  // their URL, so the dot-exclusion below doesn't catch them), and files with
  // an extension (static assets).
  matcher: ["/((?!api|admin|_next|icon|apple-icon|favicon|.*\\..*).*)"],
};

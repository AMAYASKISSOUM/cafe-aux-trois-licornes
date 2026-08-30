import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on every page route except API routes, the admin app, Next internals
  // and files with an extension (static assets).
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};

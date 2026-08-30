import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminSignInRoute = createRouteMatcher(["/admin/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    if (!isAdminSignInRoute(req)) {
      await auth.protect();
    }
    return;
  }
  return intlMiddleware(req);
});

export const config = {
  // Run on every route except Next internals, root-level generated metadata
  // routes (icon/apple-icon have no extension in their URL, so the dot
  // exclusion below doesn't catch them), and files with an extension
  // (static assets). Admin routes are included now — auth() requires
  // clerkMiddleware() to have run for the current request.
  matcher: ["/((?!_next|icon|apple-icon|favicon|.*\\..*).*)"],
};

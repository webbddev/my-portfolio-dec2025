import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleRequest = createMiddleware(routing);

// Next.js 16 proxy convention
export function proxy(request: any) {
  return handleRequest(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(ru|en|ro)/:path*",

    // Enable redirects that add missing locales and ignore API routes and assets
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};

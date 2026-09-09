import { NextRequest, NextResponse } from "next/server";

/** Vérifie juste la présence du cookie de session — la vraie validation
 * se fait dans les pages/routes elles-mêmes via auth(). */
export function proxy(request: NextRequest) {
  const sessionCookie =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");

  if (!sessionCookie) {
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function sessionIsValid(request: NextRequest) {
  const token = request.cookies.get("pr_session")?.value;
  if (!token) return false;
  try {
    const secret =
      process.env.AUTH_SECRET ?? "proposalroom-dev-secret-change-me-32b";
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const valid = await sessionIsValid(request);

  if (pathname.startsWith("/app") && !valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const res = NextResponse.redirect(url);
    if (request.cookies.get("pr_session")) {
      res.cookies.delete("pr_session");
    }
    return res;
  }

  if ((pathname === "/login" || pathname === "/signup") && valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  if (pathname === "/onboarding" && !valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login", "/signup", "/onboarding"],
};

import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const isRootRoute = pathname === "/";

  if (!isAuthRoute && !isRootRoute) {
    return NextResponse.next();
  }

  try {
    const response = await fetch(
      new URL("/api/auth/get-session", request.url).toString(),
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );

    const session = await response.json().catch(() => null);

    if (session && (isAuthRoute || isRootRoute)) {
      return NextResponse.redirect(new URL("/explore", request.url));
    }
  } catch (error) {
    console.error("Proxy session fetch error:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup"],
};

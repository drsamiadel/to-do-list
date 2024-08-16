import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Cookies from "js-cookie";
import { jwtVerify } from "jose";

const publicRoutes = ["/login", "/register"];

type JWTPayload = {
  exp: number;
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );
      if (!payload.exp || Date.now() >= payload.exp * 1000) {
        Cookies.remove("token");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (publicRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    if (!publicRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
};

import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

export const middleware = async (request: NextRequest) => {
  const cookies = request.headers.get("cookie") || "";
  const parsedCookies = parse(cookies);
  const token = parsedCookies.authToken || null;

  const url = request.nextUrl.pathname;

  const protectedRoutes = ["/home", "/profile"];
  const loginRoutes = ["/login", "/register"];

  if (protectedRoutes.some((route) => url.includes(route)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (loginRoutes.some((route) => url.includes(route)) && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/login", "/register", "/home", "/profile"],
};

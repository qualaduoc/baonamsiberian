import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Bảo vệ tất cả route /admin/*
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token");

    // Chỉ cần có token là cho vào (token đã được xác thực bởi Supabase Auth trong loginAction)
    if (!token || !token.value) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};

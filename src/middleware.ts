import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname;
    const sessionToken = req.cookies.get("__Secure-next-auth.session-token")?.value ?? req.cookies.get("next-auth.session-token")?.value;
    const homeURL = new URL("/", req.nextUrl.origin);
    const appURL = new URL("/workspace", req.nextUrl.origin);

    const publicRoutes = ["/", "/about-devmate"];
    const protectedRoutes = ["/workspace"];

    // Handle logged-in user redirection
    if (sessionToken) {
        if (publicRoutes.some((route) => url.startsWith(route))) {
            // Prevent loop by only redirecting to /app if not already there
            if (url !== appURL.pathname) {
                return NextResponse.redirect(appURL);
            }
        }
        // Allow user to stay on protected routes without unnecessary redirection
    } else {
        // Redirect unauthenticated users from protected routes to home
        if (protectedRoutes.some((route) => url.startsWith(route))) {
            return NextResponse.redirect(homeURL);
        }
    }

    // Allow other requests to proceed
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg).*)",
    ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname;
    const sessionToken = req.cookies.get("__Secure-next-auth.session-token")?.value ?? req.cookies.get("next-auth.session-token")?.value;
    const homeURL = new URL("/", req.nextUrl.origin);
    const appURL = new URL("/workspace", req.nextUrl.origin);

    const publicRoutes = ["/", "/about-devmate", "/share"];
    const protectedRoutes = ["/workspace", "/live-preview", "/share"];
    const protectedApiRoutes = ["/api/runcode"]; // Define protected API routes

    // Check if the request is an API call
    const isApiRoute = url.startsWith("/api/");

    // Check if the request is for a protected API route
    const isProtectedApiRoute = protectedApiRoutes.some((route) => url.startsWith(route));

    // Check if the request is for a protected dynamic route (e.g., /live-preview/[id])
    const isProtectedDynamicRoute = protectedRoutes.some((route) =>
        url.startsWith(route)
    );

    // Handle logged-in user redirection
    if (sessionToken) {
        // If logged in, prevent access to public routes and redirect to workspace
        if (!isApiRoute && publicRoutes.includes(url) && !protectedRoutes.includes(url)) {
            return NextResponse.redirect(appURL);
        }
        // Allow user to stay on protected routes without unnecessary redirection
    } else {
        // Redirect unauthenticated users from protected routes to home
        if (!isApiRoute && protectedRoutes.includes(url) || isProtectedDynamicRoute) {
            return NextResponse.redirect(homeURL);
        }
        if (isProtectedApiRoute) {
            return new NextResponse(
                JSON.stringify({ error: "Unauthorized: Please log in to access this route." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
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

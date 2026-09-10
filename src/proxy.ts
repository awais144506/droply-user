import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route Categories
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/unauthorized(.*)",
  "/api/webhooks(.*)",
  "/api/uploadthing(.*)"
]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);
const isUnauthorizedRoute = createRouteMatcher(["/unauthorized(.*)"]);

// Allowed Tenant Roles
const ALLOWED_TENANT_ROLES = ["OWNER", "MANAGER"];

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth();

  // Extract metadata safely from sessionClaims
  const metadata = (sessionClaims?.metadata || sessionClaims?.public_metadata || {}) as {
    role?: string;
    branchId?: string;
  };

  const userRole = metadata.role;
  const branchId = metadata.branchId;

  const isAllowedTenantUser =
    Boolean(userRole) &&
    ALLOWED_TENANT_ROLES.includes(userRole!) &&
    Boolean(branchId);

  // 1. Unauthenticated Users
  if (!userId) {
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 2. Authenticated but Unauthorized
  if (!isAllowedTenantUser) {
    if (isUnauthorizedRoute(req)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // 3. Authenticated & Valid Tenant User visiting public/auth routes
  if (isAuthRoute(req) || isUnauthorizedRoute(req)) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
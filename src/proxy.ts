import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Basic Route Categories
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/unauthorized(.*)",
  "/api/webhooks(.*)",
  "/api/uploadthing(.*)",
  "/order(.*)",
]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);
const isUnauthorizedRoute = createRouteMatcher(["/unauthorized(.*)"]);

// 2. Safe routes for suspended Owners to pay & restore access
const isBillingRoute = createRouteMatcher([
  "/admin/subscription(.*)",
  "/sign-out(.*)",
  "/api/uploadthing(.*)",
]);

const isOwnerOnlyRoute = createRouteMatcher([
  "/admin/staff(.*)",
  "/admin/subscription(.*)",
]);
const isGoldPlusRoute = createRouteMatcher([
  "/sales/recovery(.*)",
  "/stock/assets(.*)",
  "/admin/fleet(.*)",
  "/admin/reports(.*)",
]);
const isPlatinumRoute = createRouteMatcher([
  "/sales/tracking(.*)",
  "/stock/production(.*)",
  "/admin/tasks(.*)",
]);

const ALLOWED_TENANT_ROLES = ["OWNER", "MANAGER"];

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Always let UploadThing & Webhooks bypass tenant/suspension checks immediately
  if (
    req.nextUrl.pathname.startsWith("/api/uploadthing") ||
    req.nextUrl.pathname.startsWith("/api/webhooks")
  ) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();
  const metadata = (sessionClaims?.metadata ||
    sessionClaims?.public_metadata ||
    {}) as {
      role?: string;
      branchId?: string;
      tier?: string;
      branchStatus?: string;
      userStatus?: string;
      status?: string;
    };

  const userRole = metadata.role?.toUpperCase();
  const branchId = metadata.branchId;
  const tier = (metadata.tier || "SILVER").toUpperCase();

  const branchStatus = (
    metadata.branchStatus ||
    metadata.status ||
    "ACTIVE"
  ).toUpperCase();
  const userStatus = (metadata.userStatus || "ACTIVE").toUpperCase();

  const isAllowedTenantUser =
    Boolean(userRole) &&
    ALLOWED_TENANT_ROLES.includes(userRole!) &&
    Boolean(branchId);

  // --- A. UNAUTHENTICATED USERS ---
  if (!userId) {
    if (isPublicRoute(req)) return NextResponse.next();
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const isBranchInactiveOrSuspended = branchStatus === "SUSPENDED";
  const isUserInactiveOrSuspended =
    userRole !== "OWNER" && userStatus === "SUSPENDED";

  // --- B. SUSPENSION & UNAUTHORIZED GUARD ---
  if (
    !isAllowedTenantUser ||
    isUserInactiveOrSuspended ||
    isBranchInactiveOrSuspended
  ) {
    // 1. Always allow /unauthorized so it never loops
    if (isUnauthorizedRoute(req)) {
      return NextResponse.next();
    }

    // 2. 🔥 OWNER BILLING BYPASS:
    // If role === "OWNER" and they have a branchId, ALWAYS allow them onto /admin/subscription
    // even if both branchStatus and userStatus are "SUSPENDED" in Clerk!
    if (userRole === "OWNER" && Boolean(branchId) && isBillingRoute(req)) {
      return NextResponse.next();
    }

    // 3. Everyone else (Managers, Riders, or Owners hitting non-billing routes) -> /unauthorized
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // --- C. VALID ACTIVE USERS HITTING PUBLIC / UNAUTHORIZED ROUTES ---
  if (isAuthRoute(req) || isUnauthorizedRoute(req)) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  // --- D. ROLE & TIER-BASED ROUTE PROTECTION ---
  if (isOwnerOnlyRoute(req) && userRole !== "OWNER") {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  const hasGoldPlus = tier === "GOLD" || tier === "PLATINUM";
  const hasPlatinum = tier === "PLATINUM";

  if (isPlatinumRoute(req) && !hasPlatinum) {
    return NextResponse.redirect(new URL("/admin/subscription", req.url));
  }

  if (isGoldPlusRoute(req) && !hasGoldPlus) {
    return NextResponse.redirect(new URL("/admin/subscription", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
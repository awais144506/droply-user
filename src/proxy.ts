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
  "/api/uploadthing(.*)"
]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);
const isUnauthorizedRoute = createRouteMatcher(["/unauthorized(.*)"]);

// 2. Safe routes for suspended users
const isBillingRoute = createRouteMatcher([
  "/admin/subscription(.*)",
  "/sign-out(.*)",
  "/api/uploadthing(.*)" // 🔥 FIX 1: Allow suspended users to upload payment receipts!
]);

const isOwnerOnlyRoute = createRouteMatcher(["/admin/staff(.*)"]);
const isGoldPlusRoute = createRouteMatcher([
  "/sales/recovery(.*)", "/stock/assets(.*)", "/admin/fleet(.*)", "/admin/reports(.*)"
]);
const isPlatinumRoute = createRouteMatcher([
  "/sales/tracking(.*)", "/stock/production(.*)", "/admin/tasks(.*)"
]);

const ALLOWED_TENANT_ROLES = ["OWNER", "MANAGER"];

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.includes(".")) {
    return NextResponse.next();
  }

  // 🔥 FIX 2: Always let UploadThing & Webhooks bypass tenant/suspension checks immediately
  if (
    req.nextUrl.pathname.startsWith("/api/uploadthing") ||
    req.nextUrl.pathname.startsWith("/api/webhooks")
  ) {
    return NextResponse.next();
  }
  
  const { userId, sessionClaims } = await auth();
  const metadata = (sessionClaims?.metadata || sessionClaims?.public_metadata || {}) as {
    role?: string; 
    branchId?: string; 
    tier?: string; 
    branchStatus?: string; 
    userStatus?: string; 
    status?: string; // Fallback for legacy
  };

  const userRole = metadata.role;
  const branchId = metadata.branchId;
  const tier = (metadata.tier || "SILVER").toUpperCase();
  
  // Use the new keys, default to ACTIVE if missing
  const branchStatus = (metadata.branchStatus || metadata.status || "ACTIVE").toUpperCase();
  const userStatus = (metadata.userStatus || "ACTIVE").toUpperCase();

  const isAllowedTenantUser = Boolean(userRole) && ALLOWED_TENANT_ROLES.includes(userRole!) && Boolean(branchId);

  // --- A. UNAUTHENTICATED USERS ---
  if (!userId) {
    if (isPublicRoute(req)) return NextResponse.next();
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // --- B. AUTHENTICATED BUT UNAUTHORIZED / INACTIVE ---
  // If the owner fired them (userStatus), or they have no branch, kick them out
  if (!isAllowedTenantUser || userStatus === "INACTIVE" || userStatus === "SUSPENDED") {
    if (isUnauthorizedRoute(req)) return NextResponse.next();
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // --- C. VALID USERS HITTING PUBLIC ROUTES ---
  if (isAuthRoute(req) || isUnauthorizedRoute(req)) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  // --- D. BRANCH BILLING SUSPENSION (Controlled by Backend Cron Job) ---
  const isStrictlySuspended = branchStatus === "SUSPENDED";

  if (isStrictlySuspended && !isBillingRoute(req)) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Account Suspended" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/admin/subscription", req.url));
  }

  // --- E. ROLE & TIER-BASED ROUTE PROTECTION ---
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
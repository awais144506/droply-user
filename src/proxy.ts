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
  "/sign-out(.*)"
]);

const isOwnerOnlyRoute = createRouteMatcher(["/admin/staff(.*)"]);
const isGoldPlusRoute = createRouteMatcher([
  "/sales/recovery(.*)", "/stock/assets(.*)", "/stock/wastage(.*)",
  "/supply/(.*)", "/admin/fleet(.*)", "/admin/reports(.*)"
]);
const isPlatinumRoute = createRouteMatcher([
  "/sales/tracking(.*)", "/stock/production(.*)", "/admin/tasks(.*)"
]);

const ALLOWED_TENANT_ROLES = ["OWNER", "MANAGER"];

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.includes(".")) {
    return NextResponse.next();
  }
  const { userId, sessionClaims } = await auth();
  const metadata = (sessionClaims?.metadata || sessionClaims?.public_metadata || {}) as {
    role?: string; branchId?: string; tier?: string; status?: string; renewDate?: string;
  };

  const userRole = metadata.role;
  const branchId = metadata.branchId;
  const tier = (metadata.tier || "SILVER").toUpperCase();
  const status = (metadata.status || "ACTIVE").toUpperCase();
  const renewDate = metadata.renewDate;

  const isAllowedTenantUser = Boolean(userRole) && ALLOWED_TENANT_ROLES.includes(userRole!) && Boolean(branchId);

  // --- A. UNAUTHENTICATED USERS ---
  if (!userId) {
    if (isPublicRoute(req)) return NextResponse.next();
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // --- B. AUTHENTICATED BUT UNAUTHORIZED ---
  if (!isAllowedTenantUser) {
    if (isUnauthorizedRoute(req)) return NextResponse.next();
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // --- C. VALID USERS HITTING PUBLIC ROUTES ---
  if (isAuthRoute(req) || isUnauthorizedRoute(req)) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  const gracePeriod = parseInt(process.env.NEXT_PUBLIC_GRACE_PERIOD || "3", 10);
  let isDateSuspended = false;
  if (renewDate) {
    const expiration = new Date(renewDate);
    const diffTime = new Date().getTime() - expiration.getTime();
    const daysPastDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysPastDue > gracePeriod) isDateSuspended = true;
  }

  const isStrictlySuspended = status === "SUSPENDED" || isDateSuspended;

  if (isStrictlySuspended && !isBillingRoute(req)) {
    // 🔥 FAIL-SAFE 2: Return JSON for API routes so the layout doesn't crash
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
    return NextResponse.redirect(new URL("/admin/subscription?upgrade=platinum", req.url));
  }

  if (isGoldPlusRoute(req) && !hasGoldPlus) {
    return NextResponse.redirect(new URL("/admin/subscription?upgrade=gold", req.url));
  }

  return NextResponse.next();
});

// 🔥 Double check this is perfectly formatted at the very bottom!
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
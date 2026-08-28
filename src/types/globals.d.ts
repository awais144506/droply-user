export {};

export type UserRole = "OWNER" | "MANAGER" | "RIDER";

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      branchId?: string;
      role?: UserRole;
    };
  }

  interface UserPublicMetadata {
    branchId?: string;
    role?: UserRole;
  }
}
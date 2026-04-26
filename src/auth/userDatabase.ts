/**
 * DATA LAYER — Thakira User Database
 * ----------------------------------------------------------------
 * Source of truth for authorized identities and their RBAC roles.
 *
 * NOTE: Credentials are embedded for the prototype demonstration
 * defined in the system specification. In production these records
 * MUST live in Lovable Cloud (Supabase) with hashed passwords and
 * a separate `user_roles` table protected by RLS.
 */

export type Role = "member" | "admin";

export interface UserRecord {
  email: string;
  password: string;
  role: Role;
  displayName: string;
}

export const USER_DATABASE: ReadonlyArray<UserRecord> = [
  {
    email: "member.thakira@gmail.com",
    password: "MemberAccess2026",
    role: "member",
    displayName: "Community Member",
  },
  {
    email: "admin.thakira@gmail.com",
    password: "AdminSecure2026",
    role: "admin",
    displayName: "Thakira Administrator",
  },
];

/**
 * Permission catalogue — derived from the Phase 1/2 functional model
 * and the backend operations diagram.
 */
export const PERMISSIONS = {
  member: [
    "discover:read",
    "archive:read",
    "heritage:read",
    "journey:read",
    "contribute:write",
    "submissions:read",
    "vr:view",
    "profile:read",
    "quiz:participate",
    "daleel:use",
  ],
  admin: [
    "admin:overview",
    "admin:users:manage",
    "admin:logs:read",
    "admin:maintenance:execute",
    "admin:ip:block",
    "admin:backup:initiate",
    "admin:integrity:verify",
    "admin:restore:execute",
  ],
} as const;

export const ROLE_LANDING: Record<Role, string> = {
  member: "/discover",
  admin: "/admin",
};

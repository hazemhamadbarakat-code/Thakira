/**
 * APPLICATION LAYER — Authentication & RBAC Context
 * ----------------------------------------------------------------
 * Validates credentials against the Data Layer (userDatabase),
 * issues an in-memory + sessionStorage session, and exposes
 * role/permission helpers to the Presentation Layer.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { USER_DATABASE, PERMISSIONS, ROLE_LANDING, type Role } from "./userDatabase";

interface Session {
  email: string;
  displayName: string;
  role: Role;
  issuedAt: number;
}

interface AuthContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  role: Role | null;
  login: (email: string, password: string) => { ok: true; redirect: string } | { ok: false; error: string };
  logout: () => void;
  hasPermission: (perm: string) => boolean;
}

const STORAGE_KEY = "thakira.session.v1";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(STORAGE_KEY);
  }, [session]);

  const login = useCallback<AuthContextValue["login"]>((email, password) => {
    const normalized = email.trim().toLowerCase();
    const record = USER_DATABASE.find((u) => u.email.toLowerCase() === normalized);

    // Strict denial: unknown email OR password mismatch → identical error.
    if (!record || record.password !== password) {
      return { ok: false, error: "Access denied. Invalid credentials." };
    }

    const next: Session = {
      email: record.email,
      displayName: record.displayName,
      role: record.role,
      issuedAt: Date.now(),
    };
    setSession(next);
    return { ok: true, redirect: ROLE_LANDING[record.role] };
  }, []);

  const logout = useCallback(() => setSession(null), []);

  const hasPermission = useCallback(
    (perm: string) => {
      if (!session) return false;
      return (PERMISSIONS[session.role] as ReadonlyArray<string>).includes(perm);
    },
    [session]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: !!session,
      role: session?.role ?? null,
      login,
      logout,
      hasPermission,
    }),
    [session, login, logout, hasPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

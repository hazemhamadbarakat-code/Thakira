/**
 * APPLICATION LAYER — Authentication & RBAC Context (Supabase-backed)
 * ----------------------------------------------------------------
 * Validates credentials against Lovable Cloud (Supabase Auth), reads the
 * user's profile (status + is_admin) and role row, and exposes the same
 * surface the rest of the app already consumes (session/role/hasPermission).
 *
 * Suspended accounts are signed back out immediately and surface a themed
 * error to the Login screen.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { PERMISSIONS, ROLE_LANDING, type Role } from "./userDatabase";

interface Session {
  userId: string;
  email: string;
  displayName: string;
  role: Role;
  status: "Active" | "Suspended";
  issuedAt: number;
}

interface LoginResult {
  ok: true;
  redirect: string;
}
interface LoginError {
  ok: false;
  error: string;
  code?: "invalid" | "suspended";
}

interface RegisterResult {
  ok: true;
  redirect: string;
}
interface RegisterError {
  ok: false;
  error: string;
}

interface AuthContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult | LoginError>;
  register: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<RegisterResult | RegisterError>;
  logout: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SUSPENDED_MESSAGE =
  "Your account has been suspended. Please contact your Thakira Administrator to restore access.";

async function loadProfile(userId: string): Promise<{
  email: string;
  displayName: string;
  status: "Active" | "Suspended";
  role: Role;
} | null> {
  // Profile + admin role lookup (RLS lets a user read their own row).
  const [{ data: profile, error: pErr }, { data: roles }] = await Promise.all([
    supabase
      .from("profiles")
      .select("email, display_name, status")
      .eq("id", userId)
      .maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);

  if (pErr || !profile) return null;
  const isAdmin = (roles ?? []).some((r) => r.role === "admin");

  return {
    email: profile.email,
    displayName: profile.display_name || profile.email.split("@")[0],
    status: profile.status as "Active" | "Suspended",
    role: isAdmin ? "admin" : "member",
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  // Used by login() to pull the just-installed Supabase session synchronously.
  const lastUserIdRef = useRef<string | null>(null);

  // Bootstrap: subscribe to auth state, then load existing session.
  useEffect(() => {
    let cancelled = false;

    // 1) Subscribe FIRST.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sbSession) => {
      const userId = sbSession?.user?.id ?? null;
      lastUserIdRef.current = userId;

      if (!userId) {
        setSession(null);
        return;
      }
      // Defer profile fetch so we don't block the auth callback.
      setTimeout(async () => {
        const profile = await loadProfile(userId);
        if (cancelled) return;

        if (!profile) {
          // Profile row missing — treat as not-signed-in.
          await supabase.auth.signOut();
          setSession(null);
          return;
        }
        if (profile.status === "Suspended") {
          await supabase.auth.signOut();
          setSession(null);
          return;
        }
        setSession({
          userId,
          email: profile.email,
          displayName: profile.displayName,
          role: profile.role,
          status: profile.status,
          issuedAt: Date.now(),
        });
      }, 0);
    });

    // 2) THEN read whatever session already exists.
    supabase.auth.getSession().then(({ data: { session: sb } }) => {
      if (cancelled) return;
      if (!sb?.user) setLoading(false);
      else lastUserIdRef.current = sb.user.id;
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  // Stop loading once session is hydrated (or confirmed empty).
  useEffect(() => {
    if (session !== null) setLoading(false);
  }, [session]);

  const login = useCallback<AuthContextValue["login"]>(async (email, password) => {
    const normalized = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    });
    if (error || !data.user) {
      return { ok: false, error: "Access denied. Invalid credentials.", code: "invalid" };
    }

    const profile = await loadProfile(data.user.id);
    if (!profile) {
      await supabase.auth.signOut();
      return { ok: false, error: "Access denied. Profile not found.", code: "invalid" };
    }
    if (profile.status === "Suspended") {
      await supabase.auth.signOut();
      return { ok: false, error: SUSPENDED_MESSAGE, code: "suspended" };
    }

    setSession({
      userId: data.user.id,
      email: profile.email,
      displayName: profile.displayName,
      role: profile.role,
      status: profile.status,
      issuedAt: Date.now(),
    });

    return { ok: true, redirect: ROLE_LANDING[profile.role] };
  }, []);

  const register = useCallback<AuthContextValue["register"]>(
    async (email, password, displayName) => {
      const normalized = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: normalized,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/discover`,
          data: { display_name: displayName.trim() || normalized.split("@")[0] },
        },
      });
      if (error || !data.user) {
        return { ok: false, error: error?.message ?? "Registration failed." };
      }

      // With auto-confirm on, signUp returns a session immediately.
      // The onAuthStateChange listener will hydrate; nudge state too.
      setSession({
        userId: data.user.id,
        email: normalized,
        displayName: displayName.trim() || normalized.split("@")[0],
        role: "member",
        status: "Active",
        issuedAt: Date.now(),
      });
      return { ok: true, redirect: ROLE_LANDING.member };
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  const hasPermission = useCallback(
    (perm: string) => {
      if (!session) return false;
      return (PERMISSIONS[session.role] as ReadonlyArray<string>).includes(perm);
    },
    [session],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: !!session,
      role: session?.role ?? null,
      loading,
      login,
      register,
      logout,
      hasPermission,
    }),
    [session, loading, login, register, logout, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

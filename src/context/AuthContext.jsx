import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase, idToEmail } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  // id of the user whose profile we last finished loading (or null)
  const [checkedUserId, setCheckedUserId] = useState(null);

  const loadProfile = useCallback(async (user) => {
    if (!user) {
      setProfile(null);
      setCheckedUserId(null);
      return null;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, employee_id, full_name, role, active")
      .eq("id", user.id)
      .single();
    setProfile(data ?? null);
    setCheckedUserId(user.id);
    return data ?? null;
  }, []);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await loadProfile(data.session?.user);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // Defer the query so it doesn't run inside Supabase's auth callback.
      setTimeout(() => loadProfile(newSession?.user), 0);
    });

    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = async (employeeId, password) => {
    if (!supabase) throw new Error("Login isn't configured yet.");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: idToEmail(employeeId),
      password,
    });
    if (error) {
      throw new Error(
        /banned/i.test(error.message)
          ? "This account has been deactivated. Contact your admin."
          : "Incorrect ID or password."
      );
    }

    const p = await loadProfile(data.user);
    if (!p || !p.active) {
      await supabase.auth.signOut();
      throw new Error("This account isn't active. Contact your admin.");
    }
    return p;
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    setProfile(null);
  };

  const value = {
    session,
    profile,
    loading: loading || Boolean(session && checkedUserId !== session.user.id),
    isAdmin: profile?.role === "admin",
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

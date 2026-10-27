import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// null when the env vars aren't set yet, so the app can show a clear message
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

// Supabase logs in by email, so each Employee ID maps to a private address.
export const LOGIN_DOMAIN = "curiouslab.local";
export const idToEmail = (id) => `${id.trim().toLowerCase()}@${LOGIN_DOMAIN}`;

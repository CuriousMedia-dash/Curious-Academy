// Vercel serverless function: admin-only user management.
// Runs on the server, so the Supabase service role key never reaches the browser.
//
// Required environment variables (Vercel -> Project -> Settings -> Environment Variables):
//   VITE_SUPABASE_URL           same value the frontend uses
//   SUPABASE_SERVICE_ROLE_KEY   Supabase -> Project Settings -> API -> service_role (secret!)

import { randomInt } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const LOGIN_DOMAIN = "curiouslab.local";
const ID_PATTERN = /^[a-z0-9._-]{2,40}$/;

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin =
  supabaseUrl && serviceKey
    ? createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

// Readable password: no 0/O, 1/l/I to avoid mistakes when sharing.
function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[randomInt(chars.length)];
  return out;
}

function send(res, status, body) {
  res.status(status).json(body);
}

async function requireAdmin(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return { error: [401, "Not signed in."] };

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) return { error: [401, "Session expired. Please sign in again."] };

  const { data: profile } = await admin
    .from("profiles")
    .select("id, role, active")
    .eq("id", data.user.id)
    .single();

  if (!profile || profile.role !== "admin" || !profile.active) {
    return { error: [403, "Only admins can do this."] };
  }
  return { caller: profile };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed." });
  if (!admin) {
    return send(res, 500, {
      error: "Server is missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    });
  }

  const auth = await requireAdmin(req);
  if (auth.error) return send(res, auth.error[0], { error: auth.error[1] });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { action } = body;

  try {
    // ---- Create a new user ------------------------------------------------
    if (action === "create") {
      const employeeId = String(body.employeeId || "").trim().toLowerCase();
      const fullName = String(body.fullName || "").trim();
      const role = body.role === "admin" ? "admin" : "employee";
      const password = String(body.password || "").trim() || generatePassword();

      if (!ID_PATTERN.test(employeeId)) {
        return send(res, 400, {
          error: "ID must be 2–40 characters: letters, numbers, dot, dash or underscore.",
        });
      }
      if (!fullName) return send(res, 400, { error: "Full name is required." });
      if (password.length < 8) {
        return send(res, 400, { error: "Password must be at least 8 characters." });
      }

      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: `${employeeId}@${LOGIN_DOMAIN}`,
        password,
        email_confirm: true,
        user_metadata: { employee_id: employeeId, full_name: fullName },
      });

      if (createErr) {
        const taken = /already|registered|exists/i.test(createErr.message);
        return send(res, taken ? 409 : 400, {
          error: taken ? `The ID "${employeeId}" is already taken.` : createErr.message,
        });
      }

      const { error: profileErr } = await admin.from("profiles").insert({
        id: created.user.id,
        employee_id: employeeId,
        full_name: fullName,
        role,
      });

      if (profileErr) {
        // Roll back so we don't leave a login without a profile.
        await admin.auth.admin.deleteUser(created.user.id);
        return send(res, 400, { error: profileErr.message });
      }

      return send(res, 200, { employeeId, password, fullName, role });
    }

    // ---- Reset a user's password -----------------------------------------
    if (action === "reset-password") {
      const password = String(body.password || "").trim() || generatePassword();
      if (password.length < 8) {
        return send(res, 400, { error: "Password must be at least 8 characters." });
      }

      const { data: profile } = await admin
        .from("profiles")
        .select("employee_id")
        .eq("id", body.userId)
        .single();
      if (!profile) return send(res, 404, { error: "User not found." });

      const { error } = await admin.auth.admin.updateUserById(body.userId, { password });
      if (error) return send(res, 400, { error: error.message });

      return send(res, 200, { employeeId: profile.employee_id, password });
    }

    // ---- Activate / deactivate -------------------------------------------
    if (action === "set-active") {
      const active = Boolean(body.active);
      if (!active && body.userId === auth.caller.id) {
        return send(res, 400, { error: "You can't deactivate your own account." });
      }

      const { error: banErr } = await admin.auth.admin.updateUserById(body.userId, {
        ban_duration: active ? "none" : "876000h", // ~100 years = blocked from signing in
      });
      if (banErr) return send(res, 400, { error: banErr.message });

      const { error } = await admin
        .from("profiles")
        .update({ active })
        .eq("id", body.userId);
      if (error) return send(res, 400, { error: error.message });

      return send(res, 200, { ok: true });
    }

    return send(res, 400, { error: "Unknown action." });
  } catch (err) {
    return send(res, 500, { error: err.message || "Something went wrong." });
  }
}

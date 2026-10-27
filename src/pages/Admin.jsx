import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, KeyRound, Search, UserPlus, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

async function callAdminApi(session, payload) {
  const res = await fetch("/api/admin-users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

const emptyForm = { fullName: "", employeeId: "", role: "employee", password: "" };

export default function Admin() {
  const { session, profile: me } = useAuth();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [listError, setListError] = useState("");
  const [query, setQuery] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const [credentials, setCredentials] = useState(null); // { fullName, employeeId, password, kind }
  const [busyId, setBusyId] = useState(null);

  const loadUsers = useCallback(async () => {
    setListError("");
    const { data, error } = await supabase
      .from("profiles")
      .select("id, employee_id, full_name, role, active, created_at")
      .order("created_at", { ascending: false });
    if (error) setListError(error.message);
    else setUsers(data);
    setLoadingUsers(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.full_name.toLowerCase().includes(q) || u.employee_id.includes(q)
    );
  }, [users, query]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setCreating(true);
    try {
      const result = await callAdminApi(session, { action: "create", ...form });
      setCredentials({ ...result, kind: "created" });
      setForm(emptyForm);
      loadUsers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleReset = async (user) => {
    if (!window.confirm(`Reset the password for ${user.full_name}? Their old password will stop working.`)) return;
    setBusyId(user.id);
    try {
      const result = await callAdminApi(session, { action: "reset-password", userId: user.id });
      setCredentials({ ...result, fullName: user.full_name, kind: "reset" });
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleActive = async (user) => {
    const verb = user.active ? "Deactivate" : "Reactivate";
    if (!window.confirm(`${verb} ${user.full_name}?`)) return;
    setBusyId(user.id);
    try {
      await callAdminApi(session, { action: "set-active", userId: user.id, active: !user.active });
      loadUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="max-w-7xl mx-auto pl-28 pr-8 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Admin</h1>
          <p className="mt-3 text-slate-600 text-lg">
            Create logins for your team and manage who has access.
          </p>
        </div>

        {credentials && (
          <CredentialsCard credentials={credentials} onClose={() => setCredentials(null)} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create user */}
          <form
            onSubmit={handleCreate}
            className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 h-fit"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <UserPlus size={20} /> New user
            </h2>

            <Field label="Full name">
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className={inputClass}
                placeholder="e.g. Priya Sharma"
              />
            </Field>

            <Field label="Employee ID" hint="They'll sign in with this. Letters, numbers, . _ -">
              <input
                required
                autoCapitalize="none"
                spellCheck={false}
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value.toLowerCase().replace(/\s/g, "") })}
                className={inputClass}
                placeholder="e.g. priya.sharma"
              />
            </Field>

            <Field label="Role">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={inputClass}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </Field>

            <Field label="Password" hint="Leave blank to generate one automatically.">
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass}
                placeholder="Auto-generate"
                minLength={8}
              />
            </Field>

            {formError && (
              <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={creating}
              className="w-full rounded-xl bg-slate-900 text-white font-medium py-2.5 hover:bg-slate-800 disabled:opacity-60 transition"
            >
              {creating ? "Creating…" : "Create user"}
            </button>
          </form>

          {/* User list */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-semibold">
                Users <span className="text-slate-400 font-normal">({users.length})</span>
              </h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name or ID"
                  className="rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>
            </div>

            {listError && <p className="text-sm text-red-700">{listError}</p>}

            {loadingUsers ? (
              <p className="text-slate-500">Loading users…</p>
            ) : filtered.length === 0 ? (
              <p className="text-slate-500">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200">
                      <th className="py-3 pr-4 font-medium">Name</th>
                      <th className="py-3 pr-4 font-medium">ID</th>
                      <th className="py-3 pr-4 font-medium">Role</th>
                      <th className="py-3 pr-4 font-medium">Status</th>
                      <th className="py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => {
                      const isMe = u.id === me?.id;
                      const busy = busyId === u.id;
                      return (
                        <tr key={u.id} className="border-b border-slate-100 last:border-0">
                          <td className="py-3 pr-4 font-medium text-slate-900">
                            {u.full_name}
                            {isMe && <span className="ml-2 text-xs text-slate-400">(you)</span>}
                          </td>
                          <td className="py-3 pr-4 font-mono text-slate-700">{u.employee_id}</td>
                          <td className="py-3 pr-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                u.role === "admin" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {u.role === "admin" ? "Admin" : "Employee"}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={u.active ? "text-emerald-700" : "text-slate-400"}>
                              {u.active ? "Active" : "Deactivated"}
                            </span>
                          </td>
                          <td className="py-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleReset(u)}
                              disabled={busy}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                            >
                              <KeyRound size={14} /> Reset password
                            </button>
                            {!isMe && (
                              <button
                                onClick={() => handleToggleActive(u)}
                                disabled={busy}
                                className={`ml-1 px-3 py-1.5 rounded-lg disabled:opacity-50 ${
                                  u.active ? "text-red-700 hover:bg-red-50" : "text-emerald-700 hover:bg-emerald-50"
                                }`}
                              >
                                {u.active ? "Deactivate" : "Reactivate"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400";

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="block mt-1 text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

function CredentialsCard({ credentials, onClose }) {
  const [copied, setCopied] = useState(false);
  const loginUrl = `${window.location.origin}/login`;

  const message =
    `Hi ${credentials.fullName}, here are your Curious Lab login details:\n\n` +
    `Link: ${loginUrl}\n` +
    `ID: ${credentials.employeeId}\n` +
    `Password: ${credentials.password}`;

  const copy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-emerald-900">
            {credentials.kind === "reset" ? "Password reset" : "User created"}: share these details
          </h2>
          <p className="mt-1 text-sm text-emerald-800">
            The password is shown only once. Copy it now and send it to {credentials.fullName}.
          </p>
        </div>
        <button onClick={onClose} aria-label="Dismiss" className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-900">
          <X size={18} />
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <Cred label="Login link" value={loginUrl} />
        <Cred label="ID" value={credentials.employeeId} mono />
        <Cred label="Password" value={credentials.password} mono />
      </dl>

      <button
        onClick={copy}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 text-white font-medium px-4 py-2 hover:bg-emerald-800 transition"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copied" : "Copy message"}
      </button>
    </div>
  );
}

function Cred({ label, value, mono }) {
  return (
    <div className="bg-white border border-emerald-200 rounded-xl px-4 py-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className={`mt-0.5 text-slate-900 break-all ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}

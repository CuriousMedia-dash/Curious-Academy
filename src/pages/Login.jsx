import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Login() {
  const { session, profile, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/";

  if (!loading && session && profile?.active) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(employeeId, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Curious Lab</h1>
          <p className="mt-2 text-slate-600">Sign in with the ID your admin shared with you.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 space-y-5"
        >
          {!supabase && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
              Login isn't configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
            </p>
          )}

          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-slate-700">
              Employee ID
            </label>
            <input
              id="employeeId"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400"
              placeholder="e.g. vihith"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-11 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 px-3 text-slate-500 hover:text-slate-800"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !supabase}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white font-medium py-2.5 hover:bg-slate-800 disabled:opacity-60 transition"
          >
            <LogIn size={18} />
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Forgot your password? Ask your admin to reset it.
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Login failed.");
      }

      if (!data?.token) {
        throw new Error("Authentication token was not returned.");
      }

      sessionStorage.setItem("adminToken", data.token);

      if (data.admin) {
        sessionStorage.setItem(
          "adminData",
          JSON.stringify(data.admin)
        );
      }

      navigate("/admin/dashboard");
    } catch (loginError) {
      console.error("Admin login error:", loginError);
      setError(loginError.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:min-h-screen lg:flex-col lg:justify-between">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl" />

          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative px-10 pt-10 xl:px-14">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-white transition-opacity hover:opacity-80"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="font-display text-xl font-extrabold tracking-tight">
                  CivicTrack
                </p>

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Administration
                </p>
              </div>
            </Link>
          </div>

          <div className="relative px-10 xl:px-14">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-300">
                <Sparkles size={14} />
                Intelligent civic management
              </div>

              <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-5xl">
                A clearer way to manage civic issues.
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400 xl:text-base">
                Review categorised complaints, monitor issue distribution,
                and manage civic workflows from one centralized workspace.
              </p>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="font-display text-xl font-extrabold text-white">
                  24/7
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Complaint management
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="font-display text-xl font-extrabold text-white">
                  Agile
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Routing
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="font-display text-xl font-extrabold text-white">
                  Unified
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Workspace
                </p>
              </div>
            </div>
          </div>

          <div className="relative px-10 pb-8 xl:px-14">
            <p className="text-xs text-slate-600">
              Smart City Complaint Management System
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-white px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to CivicTrack
            </Link>

            <div className="mb-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <LockKeyhole size={22} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                Administration
              </p>

              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign in to access your CivicTrack administration workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }));
                    setError("");
                  }}
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }));
                      setError("");
                    }}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in to dashboard"}

                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-slate-400"
                />

                <p className="text-xs leading-5 text-slate-500">
                  Administration access is protected using password hashing
                  and JWT-based authentication.
                </p>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">
              CivicTrack Administration
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminLogin;
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ImageIcon, BookOpen, Briefcase } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,

        image: form.image || undefined,

        role: form.role,
      });

      if (res?.error) {
        setError(res.error.message || "Registration failed");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      setError("Google signup failed");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8">
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/95 hover:bg-blue-700 mx-auto flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>

            <h1 className="mt-5 text-3xl font-semibold text-slate-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Join Bibliodrop and start exploring books
            </p>
          </div>

          {/* GOOGLE SIGNUP */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl py-3 font-medium transition"
          >
            {googleLoading ? (
              "Connecting..."
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.21 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.146 35.091 26.679 36 24 36c-5.189 0-9.624-3.326-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.084 5.57l.003-.002 6.19 5.238C36.971 38.47 44 33 44 24c0-1.341-.138-2.65-.389-3.917z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="border-t border-slate-200"></div>

            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-400">
              OR
            </span>
          </div>

          {/* FORM */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Full Name
              </label>

              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Minimum 6 characters"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* IMAGE URL */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Profile Image URL (Optional)
              </label>

              <div className="relative mt-2">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  type="text"
                  value={form.image}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* ROLE */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Account Type
              </label>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      role: "user",
                    })
                  }
                  className={`p-4 rounded-xl border transition ${
                    form.role === "user"
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <User className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold">User</p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      role: "librarian",
                    })
                  }
                  className={`p-4 rounded-xl border transition ${
                    form.role === "librarian"
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <Briefcase className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold">Librarian</p>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900/95 hover:bg-neutral-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, BookOpen } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Alert, Button, Input } from "@/components/ui";

export default function LoginPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });

      if (res?.error) {
        setError(res.error.message || "Login failed");
        return;
      }

      // Refresh auth cache
      await queryClient.invalidateQueries({
        queryKey: ["auth-token"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["book-details"],
      });

      const { data: session } = await authClient.getSession();

      const role = session.user.role;

      if (role === "admin" || role === "librarian") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }

      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      setError("Google sign in failed");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* CARD */}
        <div className="bg-surface rounded-card border border-border shadow-card p-6 md:p-8">
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-card bg-accent mx-auto flex items-center justify-center shadow-card">
              <BookOpen aria-hidden="true" className="w-8 h-8 text-white" />
            </div>

            <h1 className="mt-5 text-3xl font-semibold text-content-strong">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-content-subtle">
              Sign in to continue using Bibliodrop
            </p>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-border bg-surface hover:bg-surface-subtle rounded-control py-3 font-medium transition"
          >
            {googleLoading ? (
              "Connecting..."
            ) : (
              <>
                <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 48 48">
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
                    d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.084 5.57l.003-.002 6.19-5.238C36.971 38.47 44 33 44 24c0-1.341-.138-2.65-.389-3.917z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="border-t border-border"></div>

            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface px-3 text-xs text-content-subtle">
              OR
            </span>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              name="email"
              type="email"
              label="Email Address"
              icon={Mail}
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />

            <Input
              name="password"
              type="password"
              label="Password"
              icon={Lock}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />

            {error && <Alert tone="danger">{error}</Alert>}

            <Button
              type="submit"
              variant="neutral"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-content-subtle">
            Do not have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-accent hover:text-accent-hover"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
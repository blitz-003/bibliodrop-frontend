"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ImageIcon, BookOpen } from "lucide-react";

import { Alert, Button, Input } from "@/components/ui";

/*
 * There is deliberately no account-type selector here.
 *
 * The form used to offer User / Librarian radio cards and forward the choice to
 * `signUp.email({ role })`. Because Better Auth honours `additionalFields` from
 * the client payload, that made librarian registration self-service: anyone
 * could create a librarian and reach `requireRole("librarian")` routes such as
 * POST /books and PATCH /deliveries/:id/status.
 *
 * `role` is now `input: false` in `lib/auth.js`, so it is stripped from the
 * sign-up schema server-side and every new account is a `user`. Librarian and
 * admin access is granted by an administrator through PATCH /admin/users/:id/role.
 */

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

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
    <div className="min-h-screen bg-page flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-surface rounded-card border border-border shadow-card p-6 md:p-8">
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-card bg-accent/95 hover:bg-accent-hover mx-auto flex items-center justify-center shadow-card">
              <BookOpen aria-hidden="true" className="w-8 h-8 text-white" />
            </div>

            <h1 className="mt-5 text-3xl font-semibold text-content-strong">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-content-subtle">
              Join Bibliodrop and start exploring books
            </p>
          </div>

          {/* GOOGLE SIGNUP */}
          <button
            type="button"
            onClick={handleGoogleSignup}
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
          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              name="name"
              label="Full Name"
              icon={User}
              required
              autoComplete="name"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />

            <Input
              name="email"
              type="email"
              label="Email"
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
              minLength={6}
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />

            <Input
              name="image"
              label="Profile Image URL (Optional)"
              icon={ImageIcon}
              autoComplete="photo"
              placeholder="https://example.com/avatar.jpg"
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
            />

            {/* ACCOUNT TYPE */}
            <p className="rounded-control border border-border-subtle bg-surface-subtle p-3 text-xs text-content-subtle">
              New accounts start with reader access. Librarian and admin access
              is granted by an administrator.
            </p>

            {error && <Alert tone="danger">{error}</Alert>}

            <Button
              type="submit"
              variant="neutral"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-content-subtle">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-accent hover:text-accent-hover"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
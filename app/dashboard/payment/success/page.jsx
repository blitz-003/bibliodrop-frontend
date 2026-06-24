"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  // Effect 1: Handles purely the visual countdown decrement ticking
  useEffect(() => {
    if (countdown <= 0) return; // Stop the timer loop entirely

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer); // Clean up memory safely
  }, [countdown]);

  // Effect 2: Handles the navigation side-effect ONLY when countdown hits 0
  useEffect(() => {
    if (countdown === 0) {
      router.push("/dashboard");
    }
  }, [countdown, router]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you! Your delivery fee transaction was safely processed. The
          inventory stock has been updated.
        </p>

        {countdown > 0 ? (
          <p className="text-xs text-gray-400 mb-4 tracking-wide">
            Redirecting to dashboard in <b>{countdown}</b> seconds...
          </p>
        ) : (
          <p className="text-xs text-green-600 font-medium mb-4 tracking-wide">
            Redirecting now...
          </p>
        )}

        <Link
          href="/dashboard"
          className="inline-block w-full bg-[#635BFF] hover:bg-[#5249E0] text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm"
        >
          Go to Dashboard Now
        </Link>
      </div>
    </div>
  );
}

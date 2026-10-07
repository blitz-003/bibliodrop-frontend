"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Panel, Button } from "@/components/ui";

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
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-page p-4">
      <Panel className="w-full max-w-full min-w-0 p-6 sm:p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-subtle">
          <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-success" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-content-strong">
          Payment Successful!
        </h1>

        <p className="mt-2 text-content-muted">
          Thank you! Your delivery fee transaction was safely processed. The
          inventory stock has been updated.
        </p>

        {countdown > 0 ? (
          <p
            aria-live="polite"
            className="mb-4 mt-6 text-xs text-content-subtle"
          >
            Redirecting to dashboard in{" "}
            <b className="tabular-nums text-content">{countdown}</b>{" "}
            seconds...
          </p>
        ) : (
          <p
            aria-live="polite"
            className="mb-4 mt-6 text-xs font-medium text-success"
          >
            Redirecting now...
          </p>
        )}

        <Button
          as={Link}
          href="/dashboard"
          variant="brand"
          size="lg"
          className="w-full"
        >
          Go to Dashboard Now
        </Button>
      </Panel>
    </div>
  );
}


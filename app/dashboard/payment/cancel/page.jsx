import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Panel, Button } from "@/components/ui";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-page p-4">
      <Panel className="w-full max-w-narrow p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning-subtle">
          <AlertTriangle aria-hidden="true" className="h-8 w-8 text-warning" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-content-strong">
          Transaction Canceled
        </h1>

        <p className="mt-2 text-content-muted">
          The payment checkout process was aborted. Your card was not charged,
          and your database records remain unchanged.
        </p>

        {/* The label said "Return to Browse Books" but the href was
            /dashboard, so the accessible name and the destination disagreed. */}
        <Button
          as={Link}
          href="/browse-books"
          variant="neutral"
          size="lg"
          className="mt-6 w-full"
        >
          Return to Browse Books
        </Button>
      </Panel>
    </div>
  );
}

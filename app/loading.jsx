import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <Spinner
          size="lg"
          color="primary"
          className="scale-150 md:scale-[1.8]"
        />

        <div>
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Loading...
          </h1>
          <p className="mt-2 text-sm text-default-500 sm:text-base">
            Please wait while we prepare everything for you.
          </p>
        </div>
      </div>
    </div>
  );
}

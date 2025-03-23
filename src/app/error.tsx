"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container flex min-h-[calc(100vh-300px)] flex-col items-center justify-center">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mb-8 mt-4 text-muted-foreground">
          We apologize for the inconvenience. The ghost in our machine is acting up. Please try again or return later.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Return Home
          </Button>
          <Button onClick={() => reset()}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
} 
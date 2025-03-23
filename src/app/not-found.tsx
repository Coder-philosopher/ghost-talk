import Link from "next/link";
import { Ghost } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-300px)] flex-col items-center justify-center">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <Ghost className="h-12 w-12 text-muted-foreground" />
          <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background text-2xl">
            ?
          </span>
        </div>
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="mb-8 mt-4 text-muted-foreground">
          Oops! It seems you&apos;ve wandered into the ghost realm. The page you&apos;re looking for has vanished without a trace.
        </p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
} 
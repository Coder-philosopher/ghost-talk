import { Ghost } from "lucide-react";

export default function Loading() {
  return (
    <div className="container flex min-h-[calc(100vh-300px)] flex-col items-center justify-center">
      <div className="animate-pulse-shadow flex flex-col items-center justify-center rounded-full p-8">
        <Ghost className="h-16 w-16 animate-bounce text-primary/70" />
        <div className="mt-6 text-lg font-medium text-muted-foreground">
          Summoning ghosts...
        </div>
      </div>
    </div>
  );
} 
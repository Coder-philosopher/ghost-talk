import dynamic from "next/dynamic";
import { HydrateClient } from "~/trpc/server";
import { ReloadIcon } from "@radix-ui/react-icons";

const Post = dynamic(() => import("~/components/post"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[40vh] w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <ReloadIcon className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading conversations...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <HydrateClient>
      <div className="container mx-auto px-4 pb-12 pt-6">
      <section className="relative my-16 w-full text-center">
        {/* Decorative background blur */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
          <div className="h-[300px] w-[300px] animate-pulse-slow rounded-full bg-gradient-to-r from-purple-500/30 via-blue-500/20 to-pink-500/30 blur-3xl dark:from-purple-800/40 dark:to-pink-800/30" />
        </div>

        {/* Main heading */}
        <h1 className="animate-fade-up bg-gradient-to-br from-primary to-foreground bg-clip-text font-heading text-4xl font-extrabold tracking-tight text-transparent drop-shadow-md sm:text-5xl md:text-6xl">
          GhostTalk
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-5 max-w-2xl animate-fade-up text-lg text-muted-foreground opacity-90 [animation-delay:200ms] sm:text-xl md:text-2xl">
          Share your thoughts and experiences <span className="font-medium text-foreground dark:text-white">anonymously</span>  the safest way to express yourself freely and authentically.
        </p>

      </section>

        <div className="fade-in-slide-up mx-auto w-full max-w-3xl [animation-delay:400ms]">
          <Post />
        </div>
      </div>
    </HydrateClient>
  );
}

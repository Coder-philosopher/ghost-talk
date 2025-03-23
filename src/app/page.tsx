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
        <section className="mb-8 text-center">
          <h1 className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text font-heading text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            GhostTalk
          </h1>
          <p className="mx-auto mt-4 max-w-2xl animate-fade-up text-muted-foreground opacity-90 [animation-delay:200ms]">
            Share your thoughts and experiences anonymously with GhostTalk — the safest way to express yourself freely.
          </p>
        </section>
        
        <div className="fade-in-slide-up mx-auto w-full max-w-3xl [animation-delay:400ms]">
          <Post />
        </div>
      </div>
    </HydrateClient>
  );
}

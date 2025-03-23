import { cn } from "~/lib/utils";
import Link from "next/link";
import type { ComponentProps, PropsWithChildren } from "react";
import { Badge } from "~/components/ui/badge";
import { Ghost, Github, Twitter } from "lucide-react";

const Section = {
  Root: (props: PropsWithChildren) => <div className="space-y-2" {...props} />,
  Label: (props: PropsWithChildren) => (
    <h4 className="text-sm font-medium text-foreground/90" {...props} />
  ),
  List: (props: PropsWithChildren) => (
    <ul className="space-y-1.5 text-sm" {...props} />
  ),
  Item: ({
    disabled,
    className,
    ...props
  }: PropsWithChildren & ComponentProps<"li"> & { disabled?: boolean }) => (
    <li
      className={cn(
        "text-muted-foreground transition-colors hover:text-foreground",
        className,
        disabled && "cursor-not-allowed select-none opacity-50",
      )}
      {...props}
    />
  ),
};

export const Footer = () => {
  return (
    <footer className="container mx-auto border-t border-border/40 px-4">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 py-8 md:grid-cols-3 lg:gap-12">
        <div className="col-span-1 flex flex-col justify-between space-y-4 md:col-span-1">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Ghost className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">GhostTalk</h2>
              <Badge variant="outline" className="ml-2 text-xs">
                <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs">Live</span>
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              Share your thoughts and experiences anonymously with GhostTalk — the safest way to express yourself freely.
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} GhostTalk. All rights reserved.
            </p>
          </div>
        </div>

        <div className="col-span-1 grid grid-cols-2 gap-8 sm:grid-cols-2 md:col-span-2">
          <Section.Root>
            <Section.Label>Resources</Section.Label>
            <Section.List>
              <Section.Item>
                <Link href="https://github.com/Coder-philosopher" className="inline-flex items-center gap-1.5" target="_blank" rel="noopener noreferrer">
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                </Link>
              </Section.Item>
            </Section.List>
          </Section.Root>

          <Section.Root>
            <Section.Label>Contact</Section.Label>
            <Section.List>
              <Section.Item>
                <Link 
                  href="https://x.com/abds_dev" 
                  className="inline-flex items-center gap-1.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-3.5 w-3.5" />
                  <span>X (Twitter)</span>
                </Link>
              </Section.Item>
            </Section.List>
          </Section.Root>
        </div>
      </div>
    </footer>
  );
};

import { cn } from "~/lib/utils";
import Link from "next/link";
import type { ComponentProps, PropsWithChildren } from "react";
import { Badge } from "~/components/ui/badge";
import { Ghost, Github, Twitter } from "lucide-react";

const Section = {
  Root: (props: PropsWithChildren) => <div {...props} />,
  Label: (props: PropsWithChildren) => (
    <h4
      className="mb-3 text-sm font-semibold tracking-wide text-foreground/80"
      {...props}
    />
  ),
  List: (props: PropsWithChildren) => (
    <ul className="space-y-2 text-sm" {...props} />
  ),
  Item: ({
    disabled,
    className,
    ...props
  }: PropsWithChildren & ComponentProps<"li"> & { disabled?: boolean }) => (
    <li
      className={cn(
        "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
        className,
        disabled && "cursor-not-allowed opacity-50 select-none"
      )}
      {...props}
    />
  ),
};

export const Footer = () => {
  return (
    <footer className="container mx-auto border-t border-border/40 px-6 py-8 select-none">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-0 max-w-6xl mx-auto">
        {/* Left: Branding */}
        <div className="flex flex-col space-y-1 md:flex-row md:items-center md:gap-3">
          <Ghost className="h-6 w-6 text-primary" />
          <h2 className="font-bold text-lg text-foreground">GhostTalk</h2>
          
        </div>

        {/* Center: Short description */}
        <p className="hidden md:block max-w-md text-sm text-muted-foreground">
          Share your thoughts and experiences anonymously with GhostTalk,  the safest way to express yourself freely.
        </p>

        {/* Right: Links */}
        <div className="flex gap-12 text-sm">
          <Section.Root>
            <Section.Label>Resources</Section.Label>
            <Section.List>
              <Section.Item>
                <Link
                  href="https://github.com/Coder-philosopher"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
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
                  href="https://x.com/abdsbit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  <span>X (Twitter)</span>
                </Link>
              </Section.Item>
            </Section.List>
          </Section.Root>
        </div>
      </div>

      {/* Bottom: Copyright */}
      <div className="mt-8 border-t border-border/40 pt-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} GhostTalk. All rights reserved.
      </div>
    </footer>
  );
};

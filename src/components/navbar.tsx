"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Moon, Sun } from "lucide-react";

import { useEffect, useState } from "react";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import {
  Ghost,
  Github,
  PenLine,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ToggleTheme } from "~/components/toogle-theme";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";

export const Navbar = () => {
  const utils = api.useUtils();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Mobile menu toggle
  const [mobileOpen, setMobileOpen] = useState(false);

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.getPosts.invalidate();
      setName("");
      setError("");
      setIsDialogOpen(false);
      toast({
        title: "Post created!",
        description: "Your message is now live for everyone to see.",
        variant: "default",
      });
    },
    onError: (err) => {
      setError(err.message || "Failed to create post. Please try again.");
      toast({
        title: "Error creating post",
        description: err.message || "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Post content cannot be empty");
      return;
    }
    createPost.mutate({ name: name.trim() });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "group fixed left-0 top-0 z-50 hidden h-full border-r border-border/40 bg-background shadow-md transition-all duration-300 ease-in-out lg:block",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col justify-between py-6 px-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:text-primary transition-colors">
                <Ghost className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
                {!isCollapsed && <span>GhostTalk</span>}
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label="Toggle sidebar"
              >
                {isCollapsed ? <ChevronRight className="h-5 w-6" /> : <ChevronLeft className="h-5 w-7" />}
              </Button>
            </div>

            {/* New Post */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                {isCollapsed ? (
                  <Button variant="ghost" size="icon" className="hover:scale-110 transition-all" aria-label="New Post">
                    <PenLine className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button className="w-full flex items-center gap-2 hover:scale-[1.02] transition-all">
                    <PenLine className="h-4 w-4" />
                    <span>New Post</span>
                  </Button>
                )}
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <Ghost className="h-5 w-5 text-primary" />
                    Create Ghost Message
                  </DialogTitle>
                  <DialogDescription>
                    Share your thoughts anonymously — everything you type here disappears into the ether.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    placeholder="What's on your mind?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn(
                      "min-h-32 resize-none rounded-lg border-border/50 p-4 shadow-sm transition-all focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/50",
                      error && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <DialogFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="hidden sm:inline-flex">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createPost.isPending} className="inline-flex items-center gap-2">
                      {createPost.isPending ? "Posting..." : <>
                        <Sparkles className="h-4 w-4" />
                        Post Anonymously
                      </>}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-4">
            <ToggleTheme isCollapsed={isCollapsed} />
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "flex h-9 w-full items-center gap-2 px-2 text-muted-foreground hover:text-foreground hover:scale-[1.03] transition-all",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Link href="https://github.com/Coder-philosopher/ghost-talk" target="_blank">
                <Github className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm">GitHub</span>}
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Nav */}
      <div className="lg:hidden fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-background shadow-xl border border-border/40 px-4 py-2 flex items-center gap-3">
        <Link href="/" aria-label="Home">
          <Button variant="ghost" size="icon">
            <Ghost className="h-5 w-5 text-primary" />
          </Button>
        </Link>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="New Post">
              <PenLine className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          {/* Reuse DialogContent from above if needed */}
        </Dialog>

        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Menu">
          <Moon className="h-5 w-5" />
        </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="https://github.com/Coder-philosopher/ghost-talk" target="_blank">
              <Github className="mr-2 h-4 w-4" />
            </Link>
          </Button>
      </div>

      {/* Mobile Menu (dropdown from top) */}
      {mobileOpen && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-background shadow-lg border border-border/40 p-4 space-y-2 w-[90%] max-w-sm animate-in fade-in slide-in-from-top duration-200 lg:hidden">
          <ToggleTheme isCollapsed={false} />
        </div>
      )}
    </>
  );
};

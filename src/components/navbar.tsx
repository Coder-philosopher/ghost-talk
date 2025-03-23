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
import { useState } from "react";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { Ghost, Github, PenLine, Sparkles } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ToggleTheme } from "~/components/toogle-theme";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";

export const Navbar = () => {
  const utils = api.useUtils();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  
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
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!name.trim()) {
      setError("Post content cannot be empty");
      return;
    }
    
    // Submit the form
    createPost.mutate({ name: name.trim() });
  };
  
  return (
    <header className="sticky top-4 z-40 mx-auto flex w-full max-w-3xl items-center justify-between rounded-full border border-border/40 bg-background/80 p-2 shadow-sm backdrop-blur-md">
      <div className="flex items-center px-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xl font-bold transition-colors hover:text-primary"
        >
          <Ghost className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline-block">GhostTalk</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="relative flex w-auto items-center gap-2 px-4">
              <PenLine className="h-4 w-4" />
              <span>New Post</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Ghost className="h-5 w-5 text-primary" /> Create Ghost Message
              </DialogTitle>
              <DialogDescription>
                Share your thoughts anonymously — everything you type here disappears into the ether.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="What's on your mind? Share your thoughts anonymously..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "min-h-32 resize-none rounded-lg border-border/50 p-4 shadow-sm transition-all focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/50",
                  error ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive" : ""
                )}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="hidden sm:inline-flex"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createPost.isPending} 
                  className="inline-flex items-center gap-2"
                >
                  {createPost.isPending ? (
                    "Posting..."
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Post Anonymously
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="flex items-center">
          <ToggleTheme />

          <Button asChild size="sm" variant="ghost" className="h-9 w-9 p-0" aria-label="View on GitHub">
            <Link
              aria-label="View on GitHub"
              href="https://github.com/Coder-philosopher/ghost-talk"
              target="_blank"
            >
              <Github className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

"use client";

import { useEffect, useState, useRef } from "react";
import { formatDate } from "~/lib/utils";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  
} from "~/components/ui/dropdown-menu";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";

import {
  MessageCircle,
  Share,
  X,
  AlertCircle,
  Ghost,
  Search,
  CornerDownLeft,
  RefreshCcw,
} from "lucide-react";

export default function Post() {
  const hasMounted = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newReply, setNewReply] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const postContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  const copyLinkToClipboard = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Copied current page URL to clipboard.",
      });
    } catch (error) {
      console.error("Copy failed", error);
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Could not copy the link.",
      });
    }
  };

  const { data: posts, refetch, isLoading, isError, error } = api.post.getPosts.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  useEffect(() => {
    if (isError && error && hasMounted.current) {
      toast({
        variant: "destructive",
        title: "Failed to load posts",
        description: error.message || "Please try refreshing",
      });
    }
  }, [isError, error]);

  const addReplyMutation = api.post.addReply.useMutation({
    onSuccess: () => {
      void refetch();
      if (hasMounted.current) {
        toast({
          title: "Reply added",
          description: "Your reply was posted successfully!",
        });
      }
    },
    onError: (err) => {
      if (hasMounted.current) {
        toast({
          variant: "destructive",
          title: "Failed to add reply",
          description: err.message || "Please try again",
        });
      }
    },
  });

  const handleAddReply = async (postId: number) => {
    if (!newReply.trim()) {
      toast({
        variant: "destructive",
        title: "Reply cannot be empty",
        description: "Please enter a reply.",
      });
      return;
    }
    await addReplyMutation.mutateAsync({ postId, reply: newReply });
    setNewReply("");
    setSelectedPostId(null);
  };

  const filteredPosts = posts?.filter((post) =>
    post.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (typeof window === "undefined") return null;

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-[40vh] w-full">
        <RefreshCcw className="animate-spin text-primary h-10 w-10" />
        <p className="text-muted-foreground">Loading conversations...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-[40vh] w-full text-center">
        <AlertCircle className="text-destructive h-12 w-12" />
        <p className="text-destructive">{error?.message || "Failed to load posts"}</p>
        <Button variant="outline" onClick={() => void refetch()}>
          Try Again
        </Button>
      </div>
    );

  if (!posts?.length)
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-[40vh] w-full text-center text-muted-foreground">
        <Ghost className="h-14 w-14 opacity-50" />
        <p>No messages found. Be the first to start a conversation!</p>
      </div>
    );

  const PostCard = ({ post }: { post: typeof posts[0] }) => (
    <article
      key={post.id}
      className="group relative w-full rounded-xl border border-border bg-card p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      {/* Post Header */}
      <header className="flex justify-between items-center mb-4">
        <time
          dateTime={post.createdAt}
          className="text-xs text-muted-foreground"
          title={new Date(post.createdAt).toLocaleString()}
        >
          {formatDate(post.createdAt)}
        </time>
        {post.isAdmin && (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs font-semibold">
            <Ghost className="h-4 w-4" />
            Admin
          </Badge>
        )}
      </header>

      {/* Post Content */}
      <section className="whitespace-pre-wrap text-foreground text-base leading-relaxed">
        {post.name}
      </section>

      {/* Replies */}
      {post.replies?.length > 0 && (
        <section className="mt-6 rounded-lg bg-muted/30 p-4 space-y-3 border border-border/50">
          {post.replies.map((reply, idx) => (
            <div
              key={idx}
              className={cn(
                "text-sm text-muted-foreground",
                idx > 0 ? "ml-4 border-l-2 border-border/50 pl-3" : "font-medium flex items-center gap-1"
              )}
            >
              {idx === 0 && (
                <>
                  <CornerDownLeft className="h-4 w-4" />
                  Reply:
                </>
              )}
              <span className="whitespace-pre-wrap">{reply}</span>
            </div>
          ))}
        </section>
      )}

      {/* Actions */}
      <footer className="mt-6 flex items-center gap-3 justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
          aria-expanded={selectedPostId === post.id}
          aria-controls={`reply-box-${post.id}`}
        >
          <MessageCircle className="h-4 w-4" />
          {selectedPostId === post.id ? "Cancel" : "Reply"}
        </Button>

        <DropdownMenu>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={copyLinkToClipboard}
              className="cursor-pointer gap-2 text-sm flex items-center"
            >
              <Share className="h-4 w-4" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>

      {/* Reply Input */}
      {selectedPostId === post.id && (
        <div
          id={`reply-box-${post.id}`}
          className="mt-4 rounded-lg border border-border/60 bg-card/30 p-4 shadow-inner"
        >
          <Textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Add your reply..."
            className="min-h-[96px] resize-none border-border/50 bg-background text-sm focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Add reply"
          />
          <div className="mt-3 flex justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs"
              onClick={() => setSelectedPostId(null)}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              size="sm"
              className="gap-1 text-xs"
              onClick={() => handleAddReply(post.id)}
            >
              <MessageCircle className="h-4 w-4" />
              Post Reply
            </Button>
          </div>
        </div>
      )}
    </article>
  );

  return (
    <section
      className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6"
      ref={postContainerRef}
      aria-live="polite"
    >
      {/* Search */}
      <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/40">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search conversations..."
          className="h-10 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
          aria-label="Search conversations"
          autoComplete="off"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 gap-6">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 h-[20vh] w-full text-center text-muted-foreground">
            <Search className="h-10 w-10 opacity-50" />
            <p>No messages match your search. Try something else?</p>
          </div>
        )}
      </div>
    </section>
  );
}

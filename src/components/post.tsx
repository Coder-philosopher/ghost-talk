// components/Post.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { formatDate } from "~/lib/utils";
import { api } from "~/trpc/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  CornerBottomLeftIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { Badge } from "./ui/badge";
import { Button } from "~/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { toast } from "~/components/ui/use-toast";
import { 
  MessageCircle, 
  Share,
  X,
  AlertCircle,
  Ghost,
  Search,
} from "lucide-react";
import { cn } from "~/lib/utils";

export default function Post() {
  // Use useRef for tracking client-side initialization
  const hasMounted = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newReply, setNewReply] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const postContainerRef = useRef<HTMLDivElement>(null);
  
  // Mark component as mounted after hydration
  useEffect(() => {
    hasMounted.current = true;
  }, []);
  
  const copyLinkToClipboard = async () => {
    try {
      const url = window.location.origin;
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };
  
  // Use regular query instead of suspense query
  const { 
    data: posts, 
    refetch, 
    isLoading, 
    isError, 
    error 
  } = api.post.getPosts.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
  
  // Handle error display separately using useEffect
  useEffect(() => {
    if (isError && error && hasMounted.current) {
      console.error("Error fetching posts:", error);
      toast({
        variant: "destructive",
        title: "Error fetching posts",
        description: "Please try refreshing the page"
      });
    }
  }, [isError, error]);
  
  const addReplyMutation = api.post.addReply.useMutation({
    onSuccess: () => {
      void refetch();
      if (hasMounted.current) {
        toast({
          title: "Reply added",
          description: "Your reply has been posted successfully!",
          variant: "default",
        });
      }
    },
    onError: (err) => {
      console.error("Error adding reply:", err);
      if (hasMounted.current) {
        toast({
          variant: "destructive",
          title: "Error adding reply",
          description: err.message || "Please try again",
        });
      }
    }
  });

  const handleAddReply = async (postId: number) => {
    if (!newReply.trim()) {
      toast({
        variant: "destructive",
        title: "Reply cannot be empty",
        description: "Please enter a reply",
      });
      return;
    }

    await addReplyMutation.mutateAsync({ postId, reply: newReply });
    setNewReply("");
    setSelectedPostId(null);
  };

  // Safely filter posts if they exist
  const filteredPosts = posts?.filter((post) => {
    if (!searchTerm.trim()) return true;
    const searchTermLowercase = searchTerm.toLowerCase();
    const postNameLowercase = post.name.toLowerCase();
    return postNameLowercase.includes(searchTermLowercase);
  }) ?? [];

  // Sort posts with most recent first
  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Don't render until client-side
  if (typeof window === 'undefined') {
    return null;
  }

  if (isLoading) return (
    <div className="flex h-[40vh] w-full flex-col items-center justify-center">
      <div className="animate-pulse-shadow rounded-full bg-primary/5 p-6">
        <ReloadIcon className="h-8 w-8 animate-spin text-primary" />
      </div>
      <span className="mt-4 text-muted-foreground">Loading conversations...</span>
    </div>
  );

  if (isError) return (
    <div className="flex h-[40vh] w-full flex-col items-center justify-center text-center">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <p className="mt-4 text-destructive">Error loading posts: {error?.message}</p>
      <Button onClick={() => void refetch()} className="mt-4" variant="outline">
        Try Again
      </Button>
    </div>
  );

  if (!posts || posts.length === 0) return (
    <div className="flex h-[40vh] w-full flex-col items-center justify-center text-center">
      <Ghost className="h-12 w-12 text-muted-foreground/50" />
      <p className="mt-4 text-muted-foreground">No messages found yet. Be the first to start a conversation!</p>
    </div>
  );

  const renderPostCard = (post: typeof posts[0]) => (
    <div
      key={post.id}
      className="group w-full overflow-hidden rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-200 hover:border-border hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {formatDate(post.createdAt)}
          </div>
          {post.isAdmin && (
            <Badge variant="secondary" className="text-xs font-normal">
              <Ghost className="mr-1 h-3 w-3" />
              ADMIN
            </Badge>
          )}
        </div>
      </div>
      
      <div className="my-3 whitespace-pre-wrap break-words text-foreground">
        {post.name}
      </div>
      
      {post.replies && post.replies.length > 0 && (
        <div className="mt-4 space-y-2 rounded-lg bg-muted/30 p-3">
          {post.replies.map((reply, index) => (
            <div
              key={index}
              className={cn(
                "text-sm text-muted-foreground",
                index > 0 && "ml-4 border-l-2 border-border/50 pl-3"
              )}
            >
              {index === 0 && (
                <span className="mr-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <CornerBottomLeftIcon className="h-3 w-3" />
                  Reply:
                </span>
              )}
              <span className="whitespace-pre-wrap">{reply}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button
          onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{selectedPostId === post.id ? "Cancel" : "Reply"}</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Share className="h-4 w-4" />
              <span className="hidden sm:inline-block">Share</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={copyLinkToClipboard}
              className="cursor-pointer gap-2 text-sm"
            >
              <Share className="h-4 w-4" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedPostId === post.id && (
        <div className="mt-4 rounded-lg border border-border/60 bg-card/30 p-3 shadow-sm">
          <Textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Add your reply..."
            className="min-h-24 resize-none border-border/50 bg-background text-sm shadow-none focus-visible:ring-1 focus-visible:ring-primary/40"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button
              onClick={() => setSelectedPostId(null)}
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={() => handleAddReply(post.id)}
              size="sm"
              className="h-8 gap-1 text-xs"
            >
              <MessageCircle className="h-4 w-4" />
              Post Reply
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full" ref={postContainerRef}>
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-border/60 bg-background p-1.5 shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
        <Search className="ml-2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search conversations..."
          className="h-9 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
        />
        {searchTerm && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchTerm("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sortedPosts.length > 0 ? (
          sortedPosts.map(renderPostCard)
        ) : (
          <div className="flex h-[20vh] w-full flex-col items-center justify-center text-center">
            <Search className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No messages match your search. Try something else?</p>
          </div>
        )}
      </div>
    </div>
  );
}

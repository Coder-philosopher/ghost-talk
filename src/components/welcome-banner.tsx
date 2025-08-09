"use client";

import { useState, useEffect } from "react";
import { Ghost, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";

export function WelcomeBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    // Check if the user has seen the welcome banner before
    const hasSeenBanner = sessionStorage.getItem("ghosttalk-welcomed");
    
    if (!hasSeenBanner) {
      // Show the banner after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("ghosttalk-welcomed", "true");
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      // Check if this is the start of a new session to show the mini banner
      const lastVisit = sessionStorage.getItem("ghosttalk-last-visit");
      const now = new Date().toISOString();
      
      if (!lastVisit || new Date(now).getTime() - new Date(lastVisit).getTime() > 3600000) {
        // If more than an hour has passed or first visit
        setIsBannerVisible(true);
        sessionStorage.setItem("ghosttalk-last-visit", now);
      }
    }
  }, []);

  const dismissBanner = () => {
    setIsBannerVisible(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Ghost className="h-6 w-6 text-primary" /> Welcome to GhostTalk
            </DialogTitle>
            <DialogDescription className="text-base">
              The safest place to express yourself freely and anonymously.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p>Here&apos;s what makes GhostTalk special:</p>
            
            <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
              <li>Share your thoughts <span className="font-medium text-foreground">anonymously</span> without sign-up</li>
              <li>Customize your experience with <span className="font-medium text-foreground">multiple themes</span></li>
              <li>React and reply to posts from the community</li>
              <li>Your content stays completely private and secure</li>
            </ul>
            
            <p className="text-sm text-muted-foreground">
              Start by creating your first ghost message using [New Post] button.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {isBannerVisible && (
        <div className="fixed bottom-6 left-6 z-50 w-auto max-w-xs animate-fade-up rounded-lg border border-border/50 bg-card p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ghost className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">Welcome back to GhostTalk!</p>
            </div>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={dismissBanner}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Ready to share your thoughts anonymously?
          </p>
        </div>
      )}
    </>
  );
} 

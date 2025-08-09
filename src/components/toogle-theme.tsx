"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

type ToggleThemeProps = {
  isCollapsed: boolean;
};

export const ToggleTheme = ({ isCollapsed }: ToggleThemeProps) => {
  const { setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  // Update on resize to determine screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Tailwind's lg: breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const themes = [
    { name: "light", icon: <Sun className="h-4 w-4" />, color: "" },
    { name: "dark", icon: <Moon className="h-4 w-4" />, color: "" },
    { name: "purple", icon: null, color: "bg-[hsl(280,90%,65%)]" },
    { name: "green", icon: null, color: "bg-[hsl(150,80%,45%)]" },
    { name: "blue", icon: null, color: "bg-[hsl(210,90%,60%)]" },
    { name: "rose", icon: null, color: "bg-[hsl(350,90%,60%)]" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative flex h-9 w-full items-center gap-2 px-2",
            isCollapsed && "justify-center px-0"
          )}
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </span>
          {!isCollapsed && <span className="text-sm">Change Theme</span>}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={isMobile ? "top" : "right"} // tray direction based on screen size
        className="flex gap-2 p-3 rounded-full"
      >
        <TooltipProvider>
          {themes.map(({ name, icon, color }) => (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setTheme(name)}
                  aria-label={name}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {icon ? icon : <div className={`h-4 w-4 rounded-full ${color}`} />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

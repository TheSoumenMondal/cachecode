"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-full rounded-none border border-border" />;
  }

  return (
    <div className="flex w-full items-center p-1 rounded-none border border-border/50 bg-muted/30">
      <Button
        variant={theme === "light" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("light")}
        className="flex-1 rounded-none h-7"
        title="Light Mode"
      >
        <SunIcon
          weight={theme === "light" ? "fill" : "duotone"}
          className="size-4"
        />
      </Button>
      <Button
        variant={theme === "system" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("system")}
        className="flex-1 rounded-none h-7"
        title="System Theme"
      >
        <MonitorIcon
          weight={theme === "system" ? "fill" : "duotone"}
          className="size-4"
        />
      </Button>
      <Button
        variant={theme === "dark" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("dark")}
        className="flex-1 rounded-none h-7"
        title="Dark Mode"
      >
        <MoonIcon
          weight={theme === "dark" ? "fill" : "duotone"}
          className="size-4"
        />
      </Button>
    </div>
  );
}

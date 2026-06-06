"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="size-9 rounded-none border border-border" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-none relative overflow-hidden cursor-pointer"
      title="Toggle Theme"
    >
      <SunIcon
        weight="duotone"
        className={`absolute size-4 transition-all duration-300 ${
          isDark ? "-translate-y-10 opacity-0" : "translate-y-0 opacity-100"
        }`}
      />
      <MoonIcon
        weight="duotone"
        className={`absolute size-4 transition-all duration-300 ${
          isDark ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

import { HandWavingIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

const LandingPageNavbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <HandWavingIcon weight="bold" className="size-5" />
          <span className="font-bold tracking-tight">cachecode</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button size="sm" className="font-semibold rounded-none">
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingPageNavbar;

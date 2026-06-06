import { HandWavingIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const LandingFooter = () => {
  return (
    <footer className="w-full border-t bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 opacity-80">
          <HandWavingIcon weight="bold" className="size-5" />
          <span className="font-bold tracking-tight">cachecode</span>
        </div>

        <div className="text-sm text-muted-foreground flex items-center gap-6">
          <Link href="#" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link
            href="https://github.com/soumen"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </Link>
        </div>

        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Cachecode. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;

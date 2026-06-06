import {
  CodeIcon,
  LockKeyIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
        <div className="max-w-3xl text-center space-y-8 z-10">
          <div className="inline-flex items-center border px-2 py-0.5 text-xs bg-muted/50 text-muted-foreground mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Your Personal Snippet Library
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Store, Share, and Discover{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">
              Code Snippets
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-xl leading-relaxed">
            The ultimate platform for developers to organize their most used
            code blocks. Stop searching through old projects and start building
            faster with cachecode.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="default"
                className="font-semibold rounded-none w-full sm:w-auto"
              >
                Get Started for Free
              </Button>
            </Link>
            <Link href="/explore" className="w-full sm:w-auto">
              <Button
                size="default"
                variant="outline"
                className="font-semibold rounded-none w-full sm:w-auto bg-background/50 backdrop-blur-sm hover:bg-background"
              >
                Explore Community Snippets
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-16 bg-muted/30 p-8 sm:p-12 rounded-none border border-border/50">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to code faster
            </h2>
            <p className="text-muted-foreground text-lg">
              Cachecode provides all the tools you need to manage your personal
              knowledge base of code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-start p-6 bg-background border border-border/50 rounded-none shadow-sm transition-all hover:shadow-md">
              <div className="p-3 bg-primary/10 text-primary rounded-none mb-4">
                <CodeIcon weight="duotone" className="size-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Beautiful Syntax Highlighting
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Your code blocks are automatically highlighted based on their
                language, making them easy to read and understand at a glance.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 bg-background border border-border/50 rounded-none shadow-sm transition-all hover:shadow-md">
              <div className="p-3 bg-primary/10 text-primary rounded-none mb-4">
                <LockKeyIcon weight="duotone" className="size-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Public & Private Modes</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Keep your secret keys and company-specific logic private, or
                switch to public mode to share your genius with the community.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 bg-background border border-border/50 rounded-none shadow-sm transition-all hover:shadow-md">
              <div className="p-3 bg-primary/10 text-primary rounded-none mb-4">
                <MagnifyingGlassIcon weight="duotone" className="size-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tag-Based Organization</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Categorize your snippets with custom tags. Find exactly what you
                need in seconds instead of digging through old repositories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Ready to stop rewriting the same code?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join developers who are already saving hours every week by storing
            their code blocks in cachecode.
          </p>
          <Link href="/login" className="inline-block mt-8">
            <Button size="default" className="font-semibold rounded-none">
              <RocketLaunchIcon weight="duotone" className="mr-2 size-5" />
              Start Building Your Library
            </Button>
          </Link>
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
      </section>
    </div>
  );
};

export default LandingPage;

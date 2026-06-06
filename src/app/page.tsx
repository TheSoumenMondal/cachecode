import LandingPage from "@/components/features/landing";
import LandingFooter from "@/components/features/landing-footer";
import LandingPageNavbar from "@/components/features/landing-navbar";

const page = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <LandingPageNavbar />
      <main className="flex-1 w-full">
        <LandingPage />
      </main>
      <LandingFooter />
    </div>
  );
};

export default page;

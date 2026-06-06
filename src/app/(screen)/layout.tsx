import ProtectedNavbar from "@/components/features/protected-navbar";
import RightSidebar from "@/components/features/right-sidebar";
import Sidebar from "@/components/features/sidebar";
import { AuthGuard } from "@/providers/auth-guard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <div className="w-full flex h-screen justify-center">
        <div className="w-full max-w-6xl h-full grid grid-cols-1 md:grid-cols-12 md:border-x">
          <div className="hidden md:block md:col-span-3 lg:col-span-2 border-r">
            <Sidebar />
          </div>
          <div className="col-span-1 md:col-span-9 lg:col-span-8 flex flex-col h-full overflow-hidden relative">
            <ProtectedNavbar />
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-2 border-l bg-background">
            <RightSidebar />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default layout;

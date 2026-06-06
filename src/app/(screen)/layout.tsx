import ProtectedNavbar from "@/components/features/protected-navbar";
import Sidebar from "@/components/features/sidebar";
import { AuthGuard } from "@/providers/auth-guard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <div className="w-full flex h-screen justify-center">
        <div className="w-full max-w-6xl h-full grid grid-cols-12 border-x">
          <div className="col-span-2 border-r">
            <Sidebar />
          </div>
          <div className="col-span-8 flex flex-col h-full overflow-hidden relative">
            <ProtectedNavbar />
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </div>
          <div className="col-span-2 border-l">Right</div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default layout;

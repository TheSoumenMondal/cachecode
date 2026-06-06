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
          <div className="col-span-8">
            <ProtectedNavbar />
            {children}
          </div>
          <div className="col-span-2 border-l">Right</div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default layout;

"use client";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import AddCodeSnippetDialog from "./add-code-snippet-dialog";

const ProtectedNavbar = () => {
  const { data } = authClient.useSession();
  const pathname = usePathname();

  let title = "";
  if (pathname.includes("/explore")) {
    title = "Community Snippets";
  } else if (pathname.includes("/my-snippets")) {
    title = "My Snippets";
  } else if (pathname.includes("/profile")) {
    title = "Profile";
  }

  return (
    <div className="h-11 border-b text-sm flex items-center px-4 justify-between">
      <div className="font-semibold text-foreground tracking-tight">
        {title}
      </div>
      <div>{data?.session && <AddCodeSnippetDialog />}</div>
    </div>
  );
};

export default ProtectedNavbar;

"use client";
import { authClient } from "@/lib/auth-client";
import AddCodeSnippetDialog from "./add-code-snippet-dialog";

const ProtectedNavbar = () => {
  const { data } = authClient.useSession();

  return (
    <div className="h-11 border-b text-sm flex items-center px-2 justify-between">
      <div></div>
      <div>{data?.session && <AddCodeSnippetDialog />}</div>
    </div>
  );
};

export default ProtectedNavbar;

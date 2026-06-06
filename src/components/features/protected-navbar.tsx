"use client";
import { ListIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import AddCodeSnippetDialog from "./add-code-snippet-dialog";
import Sidebar from "./sidebar";

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
    <div className="h-11 border-b text-sm flex items-center px-4 justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-sm"
              >
                <ListIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[240px] border-r">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
        <div className="font-semibold text-foreground tracking-tight">
          {title}
        </div>
      </div>
      <div>{data?.session && <AddCodeSnippetDialog />}</div>
    </div>
  );
};

export default ProtectedNavbar;

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}

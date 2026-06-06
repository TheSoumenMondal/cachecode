"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  allTags: string[];
  userTags: string[];
};

export default function RightSidebarClient({ allTags, userTags }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTag = searchParams.get("tag");
  const currentVisibility = searchParams.get("visibility") || "all";

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    if (currentTag === tag) {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleVisibilityClick = (visibility: string) => {
    const params = new URLSearchParams(searchParams);
    if (visibility === "all") {
      params.delete("visibility");
    } else {
      params.set("visibility", visibility);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  if (pathname === "/explore") {
    return (
      <div className="w-full flex flex-col h-full">
        <div className="w-full flex items-center justify-start h-11 border-b px-4 shrink-0">
          <p className="font-semibold text-sm">Filters</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          <h3 className="font-semibold text-xs mb-4 text-muted-foreground uppercase tracking-wider">
            Explore Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.length === 0 && (
              <p className="text-xs text-muted-foreground">No tags found.</p>
            )}
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={currentTag === tag ? "default" : "secondary"}
                className="cursor-pointer hover:opacity-80 rounded-sm"
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (pathname === "/my-snippets") {
    return (
      <div className="w-full flex flex-col h-full">
        <div className="w-full flex items-center justify-start h-11 border-b px-4 shrink-0">
          <p className="font-semibold text-sm">Filters</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          <div>
            <h3 className="font-semibold text-xs mb-4 text-muted-foreground uppercase tracking-wider">
              Visibility
            </h3>
            <div className="flex flex-col w-full rounded-sm border border-border/50 bg-muted/30 p-1 gap-1">
              <Button
                variant={currentVisibility === "all" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start rounded-sm h-7 text-xs"
                onClick={() => handleVisibilityClick("all")}
              >
                All
              </Button>
              <Button
                variant={currentVisibility === "public" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start rounded-sm h-7 text-xs"
                onClick={() => handleVisibilityClick("public")}
              >
                Public
              </Button>
              <Button
                variant={
                  currentVisibility === "private" ? "secondary" : "ghost"
                }
                size="sm"
                className="w-full justify-start rounded-sm h-7 text-xs"
                onClick={() => handleVisibilityClick("private")}
              >
                Private
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-xs mb-4 text-muted-foreground uppercase tracking-wider">
              My Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {userTags.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No tags used yet.
                </p>
              )}
              {userTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={currentTag === tag ? "default" : "secondary"}
                  className="cursor-pointer hover:opacity-80 rounded-sm"
                  onClick={() => handleTagClick(tag)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

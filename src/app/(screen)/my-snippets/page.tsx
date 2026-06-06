"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import SnippetCard from "@/components/features/snippet-card";
import { SnippetCardSkeleton } from "@/components/features/snippet-card-skeleton";
import type { PopulatedCodeSnippet } from "@/types/snippet";

const MySnippetsPage = () => {
  const [snippets, setSnippets] = useState<PopulatedCodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSnippets = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/my-snippets");
      if (!res.ok) {
        throw new Error("Failed to fetch snippets");
      }
      const { data } = await res.json();
      setSnippets(data);
    } catch (error) {
      console.error("Error fetching my snippets:", error);
      toast.error("Failed to load snippets.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const handleDeleted = (id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdated = () => {
    fetchSnippets(false); // Refetch silently without loading spinner
  };

  if (loading) {
    return (
      <div className="w-full flex-1 p-2">
        <div className="grid grid-cols-1 items-start gap-2">
          {["a", "b", "c"].map((id) => (
            <SnippetCardSkeleton key={`skeleton-${id}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 p-2">
      {snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/50 rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            You haven't created any snippets yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-2">
          {snippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              isEditable={true}
              onDeleted={handleDeleted}
              onUpdated={handleUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MySnippetsPage;

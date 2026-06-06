import { SnippetCardSkeleton } from "@/components/features/snippet-card-skeleton";

export default function ExploreLoading() {
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

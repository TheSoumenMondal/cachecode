import { getPublicSnippets } from "@/app/actions/snippet.actions";
import SnippetCard from "@/components/features/snippet-card";

const ExplorePage = async () => {
  const snippets = await getPublicSnippets();

  return (
    <div className="w-full flex-1 p-2">
      {snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/50 rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No snippets found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-2">
          {snippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;

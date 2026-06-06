import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SnippetCardSkeleton() {
  return (
    <Card className="flex flex-col h-full bg-background/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <div className="space-y-2 w-full">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-4" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="rounded-md overflow-hidden border border-border/50 bg-muted p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full opacity-20" />
            <Skeleton className="h-4 w-3/4 opacity-20" />
            <Skeleton className="h-4 w-1/2 opacity-20" />
            <Skeleton className="h-4 w-5/6 opacity-20" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border/20 flex items-center justify-between">
        <Skeleton className="h-5 w-16" />
        <div className="flex gap-1.5 flex-wrap justify-end">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-14" />
        </div>
      </CardFooter>
    </Card>
  );
}

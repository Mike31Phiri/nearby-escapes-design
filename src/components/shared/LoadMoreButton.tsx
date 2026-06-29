import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  isLoading: boolean;
  hasMore: boolean;
  onClick: () => void;
  itemName?: string; // e.g., 'escapes', 'experiences'
}

export function LoadMoreButton({
  isLoading,
  hasMore,
  onClick,
  itemName = "results",
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        You&apos;ve reached the end of the {itemName}.
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8">
      <Button
        variant="outline"
        size="lg"
        onClick={onClick}
        disabled={isLoading}
        className="min-w-[200px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading more...
          </>
        ) : (
          `Show more ${itemName}`
        )}
      </Button>
    </div>
  );
}

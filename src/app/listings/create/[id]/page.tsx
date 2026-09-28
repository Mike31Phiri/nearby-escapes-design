import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ListingEditorPage } from "@/components/host/ListingEditorPage";

export const dynamic = "force-dynamic";

export default async function ListingDraftRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 text-purple animate-spin mb-3" />
          <p className="text-sm font-medium text-neutral-600">Loading Listing Editor...</p>
        </div>
      }
    >
      <ListingEditorPage draftId={id} />
    </Suspense>
  );
}

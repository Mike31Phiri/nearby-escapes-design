import { ListingEditorPage } from "@/components/host/ListingEditorPage";

export const dynamic = "force-dynamic";

export default async function ListingDraftRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingEditorPage draftId={id} />;
}

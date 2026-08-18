import { LedgerBreakdownPage } from "@/components/host/finances/LedgerBreakdownPage";

export default async function HostLedgerRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LedgerBreakdownPage payoutId={id} />;
}

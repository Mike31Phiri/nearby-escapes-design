import { StayDetailPage } from "@/views/stays/StayDetailPage";

export const metadata = { title: "Stay — Nearby Escapes" };

// /stays/[stayId] — StayDetailPage reads params via useParams() internally
export default function Page() {
  return <StayDetailPage />;
}

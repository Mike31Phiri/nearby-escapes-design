import { LoadingProvider } from "@/lib/loading-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LoadingProvider>{children}</LoadingProvider>;
}

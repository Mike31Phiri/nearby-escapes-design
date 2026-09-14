import { notFound } from "next/navigation";
import { mockPackages } from "@/lib/mock-data";
import { PackageDetailPage } from "@/components/guest/listings/PackageDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockPackages.map((pkg) => ({ id: pkg.id }));
}

export default async function ListingsPackageRoute({ params }: Props) {
  const { id } = await params;
  const packageItem = mockPackages.find((p) => p.id === id);

  if (!packageItem) notFound();

  return <PackageDetailPage packageItem={packageItem} backHref="/packages" />;
}

import { notFound } from "next/navigation";
import { mockExperiences, mockGems, mockPackages } from "@/lib/mock-data";
import { ExperienceDetailPage } from "@/components/guest/listings/ExperienceDetailPage";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateStaticParams() {
  const experiences = mockExperiences.map((e) => ({ id: e.id }));
  const gems = mockGems.map((g) => ({ id: g.id }));
  const packages = mockPackages.map((p) => ({ id: p.id }));
  return [...experiences, ...gems, ...packages];
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const item =
    mockExperiences.find((e) => e.id === id) ||
    mockGems.find((g) => g.id === id) ||
    mockPackages.find((p) => p.id === id);

  if (!item) return { title: "Experience not found" };

  return {
    title: `${item.name} — Nearby Escapes`,
    description: `Discover and book ${item.name} in ${item.location}, Zambia.`,
  };
}

export default async function ExperienceRoutePage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;

  const item =
    mockExperiences.find((e) => e.id === id) ||
    mockGems.find((g) => g.id === id) ||
    mockPackages.find((p) => p.id === id);

  if (!item) notFound();

  // Determine back category parameter
  let defaultCategory = "attractions";
  if (mockGems.some((g) => g.id === id)) defaultCategory = "gems";
  else if (mockPackages.some((p) => p.id === id)) defaultCategory = "packages";

  // Reconstruct backHref from search params if present
  const backParams = new URLSearchParams({ category: defaultCategory, ...sp });
  backParams.delete("_next");
  const backHref = `/experiences?${backParams.toString()}`;

  return <ExperienceDetailPage item={item} backHref={backHref} />;
}

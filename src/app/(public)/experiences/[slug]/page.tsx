import { notFound } from "next/navigation";
import { getExperience } from "@/lib/api/experiences";
import { ExperienceDetailPage } from "@/components/guest/experiences/ExperienceDetailPage";
import type { ExperienceListing } from "@/types/listing";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const exp = await getExperience(slug);
    if (!exp) return { title: "Experience not found" };
    return {
      title: `${(exp as ExperienceListing).title} — Nearby Escapes`,
      description: exp.description,
    };
  } catch (error) {
    return { title: "Experience not found" };
  }
}

export default async function ExperiencePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  let exp = null;
  try {
    exp = await getExperience(slug);
  } catch (error) {
    console.error("Failed to fetch experience:", error);
  }

  if (!exp) notFound();

  const backParams = new URLSearchParams({ ...sp });
  backParams.delete("_next");
  const backHref = `/experiences?${backParams.toString()}`;

  return <ExperienceDetailPage experience={exp as ExperienceListing} backHref={backHref} />;
}

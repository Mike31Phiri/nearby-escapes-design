import { notFound, redirect } from "next/navigation";
import { mockExperiences, mockGems } from "@/lib/mock-data";
import type { Experience, ExperienceCategory } from "@/lib/mock-data";
import { categoryLabels } from "@/lib/mock-data";
import { ExperienceCategoryPage } from "@/components/experiences/ExperienceCategoryPage";

interface Props {
  params: Promise<{ slug: string }>;
}

// Valid category slugs
const validCategories: ExperienceCategory[] = [
  "cultural",
  "wildlife",
  "farm",
  "industrial",
  "adventure",
  "water",
  "general",
];

export async function generateStaticParams() {
  return validCategories.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  if (!validCategories.includes(slug as ExperienceCategory)) {
    return { title: "Category not found — Nearby Escapes" };
  }

  const label = categoryLabels[slug as ExperienceCategory] || slug;
  return {
    title: `${label} — Nearby Escapes Experiences`,
    description: `Discover and book ${label.toLowerCase()} in Zambia. Unique tours, activities, and cultural experiences curated by local hosts.`,
  };
}

function getExperiencesByCategory(category: ExperienceCategory): Experience[] {
  const allExperiences = [...mockExperiences, ...mockGems];
  if (category === "general") return allExperiences;
  return allExperiences.filter((e) => e.category === category);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // Validate slug
  if (!validCategories.includes(slug as ExperienceCategory)) {
    // Try to redirect common mis-spellings
    if (slug === "farm-visits" || slug === "agri-tourism" || slug === "farms") {
      redirect("/experiences/category/farm");
    }
    if (slug === "wildlife-nature" || slug === "nature" || slug === "safari") {
      redirect("/experiences/category/wildlife");
    }
    if (slug === "cultural" || slug === "community" || slug === "village") {
      redirect("/experiences/category/cultural");
    }
    if (slug === "industrial-heritage" || slug === "mining" || slug === "copperbelt") {
      redirect("/experiences/category/industrial");
    }
    if (slug === "adventure-tours" || slug === "adrenaline" || slug === "tours") {
      redirect("/experiences/category/adventure");
    }
    if (slug === "water-sports" || slug === "lakes" || slug === "river") {
      redirect("/experiences/category/water");
    }
    notFound();
  }

  const category = slug as ExperienceCategory;
  const experiences = getExperiencesByCategory(category);

  return <ExperienceCategoryPage category={category} experiences={experiences} />;
}

import { ExplorePage } from "@/components/guest/explore/ExplorePage";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export default async function ExploreSlugRoute({ params }: Props) {
  const { slug } = await params;
  return <ExplorePage slug={slug ?? []} />;
}

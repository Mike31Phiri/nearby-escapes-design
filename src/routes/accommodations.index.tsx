import { createFileRoute } from "@tanstack/react-router";
import { ExplorePage } from "@/pages/explore/ExplorePage";

type SearchParams = { q?: string };

export const Route = createFileRoute("/accommodations/")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "Search accommodations — Nearby Escapes" },
      {
        name: "description",
        content: "Search and filter lodges, hotels, camps and guesthouses across Zambia.",
      },
      { property: "og:title", content: "Search accommodations — Nearby Escapes" },
      {
        property: "og:description",
        content: "Search and filter lodges, hotels, camps and guesthouses across Zambia.",
      },
    ],
  }),
  component: AccommodationsPage,
});

function AccommodationsPage() {
  const { q } = Route.useSearch();
  return <ExplorePage query={q} />;
}

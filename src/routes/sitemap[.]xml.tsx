import { createFileRoute } from "@tanstack/react-router";
import { listings } from "@/lib/mock-data";

const SITE = "https://nearbyescapes.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          "",
          "accommodations",
          "bus-booking",
          "packages",
          "gems",
          "help",
          "legal/terms",
          "legal/privacy",
          "legal/cookies",
        ];

        const urls = [
          ...staticPaths.map((p) => `${SITE}/${p}`),
          ...listings.map((l) => `${SITE}/accommodations/${l.id}`),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;

        return new Response(body, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});

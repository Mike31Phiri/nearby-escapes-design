import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Star, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listings } from "@/lib/mock-data";
const lodge = "/images/listing-lodge.jpg";

const collections: Record<string, { title: string; tagline: string; description: string }> = {
  "river-lodges": {
    title: "Riverside lodges",
    tagline: "Wake up to flowing water",
    description:
      "Hand-picked lodges along the Zambezi, Kafue and Luangwa rivers — quiet decks, slow mornings and easy access to the water.",
  },
  "safari-camps": {
    title: "Safari camps",
    tagline: "Closer to the wild",
    description:
      "Tented camps and bush lodges deep inside Zambia's national parks, with experienced guides on every drive.",
  },
  "city-stays": {
    title: "City stays",
    tagline: "Sleep where the city wakes up",
    description:
      "Boutique hotels and apartments in Lusaka, Ndola and Kitwe for fast trips and longer business stays.",
  },
};

export function CollectionPage() {
  const params = useParams();
  const slug = (params.slug as string) ?? "";
  const c = collections[slug] ?? {
    title: "Collection",
    tagline: "Hand-picked stays",
    description: "A curated set of stays from our editors.",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <header className="relative h-[260px] sm:h-[320px]">
          <img src={lodge} alt={c.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/45" />
          <div className="relative mx-auto max-w-6xl h-full px-4 md:px-6 flex flex-col justify-end pb-8 text-background">
            <Badge variant="secondary" className="self-start text-[11px]">
              Curated
            </Badge>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">{c.title}</h1>
            <p className="mt-2 max-w-2xl text-background/85">{c.tagline}</p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
          <p className="max-w-3xl text-muted-foreground leading-7">{c.description}</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {["All", "Lodge", "Camp", "Hotel", "Guesthouse"].map((t, i) => (
                <Badge
                  key={t}
                  variant={i === 0 ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                >
                  {t}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="recommended">
                <SelectTrigger className="w-[170px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="rating">Top rated</SelectItem>
                  <SelectItem value="low">Price · low to high</SelectItem>
                  <SelectItem value="high">Price · high to low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <Link key={l.id} href={`/stays/${l.id}`}>
                <Card className="overflow-hidden border-border/60 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
                  <div className="aspect-[4/3]">
                    <img src={l.image} alt={l.name} className="h-full w-full object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{l.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {l.location}
                        </p>
                      </div>
                      <span className="text-xs flex items-center gap-1">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        {l.rating}
                      </span>
                    </div>
                    <p className="mt-3 text-sm">
                      <span className="font-bold">${l.price}</span>
                      <span className="text-muted-foreground"> / night</span>
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

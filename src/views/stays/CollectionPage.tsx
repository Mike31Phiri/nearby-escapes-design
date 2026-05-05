import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Star, SlidersHorizontal, ArrowRight } from "lucide-react";
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
        <header className="relative h-[400px] sm:h-[500px] overflow-hidden">
          <img src={lodge} alt={c.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="relative mx-auto max-w-7xl h-full px-4 md:px-6 flex flex-col justify-end pb-16 text-background animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Badge className="self-start bg-primary text-white font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full mb-4">
              Curated Selection
            </Badge>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight font-display leading-tight">{c.title}</h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-background/90 font-medium leading-relaxed">{c.tagline}</p>
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

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {listings.map((l) => (
              <Link key={l.id} href={`/stays/${l.id}`} className="group">
                <Card className="overflow-hidden border-border/60 bg-white rounded-[32px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={l.image} alt={l.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xl font-black tracking-tight mb-1">{l.name}</p>
                        <p className="text-[10px] font-black text-muted-foreground flex items-center gap-1.5 uppercase tracking-widest">
                          <MapPin className="h-4 w-4 text-primary" /> {l.location}
                        </p>
                      </div>
                      <span className="shrink-0 flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-black">
                        <Star className="h-3.5 w-3.5 fill-accent" />
                        {l.rating}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                      <p className="text-2xl font-black text-primary">
                        ${l.price}
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">/ night</span>
                      </p>
                      <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0 text-primary hover:bg-primary/5">
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
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

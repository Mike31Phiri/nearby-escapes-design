import { Link } from "@tanstack/react-router";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import lodge from "@/assets/listing-lodge.jpg";
import camp from "@/assets/listing-camp.jpg";
import hotel from "@/assets/listing-hotel.jpg";
import guesthouse from "@/assets/listing-guesthouse.jpg";

const stories = [
  { id: "victoria-falls-monsoon", title: "Chasing the high-water roar at Victoria Falls", excerpt: "Why April is the most dramatic time to stand at the edge of the world's largest sheet of falling water.", read: "8 min", tag: "Destination", image: lodge },
  { id: "luangwa-walking-safari", title: "Walking safari etiquette in South Luangwa", excerpt: "A first-timer's guide to walking with elephants — and the rangers who keep you safe.", read: "12 min", tag: "Safari", image: camp },
  { id: "lusaka-coffee-trail", title: "A morning on Lusaka's new coffee trail", excerpt: "From Kabulonga to Kabwata, where to find the city's best brews and slow breakfasts.", read: "6 min", tag: "City", image: hotel },
  { id: "zambezi-river-cabins", title: "Six river cabins worth the drive", excerpt: "Quiet wooden hideaways along the Lower Zambezi, picked by our editors.", read: "9 min", tag: "Editor's pick", image: guesthouse },
];

export function SpotlightHomePage() {
  const featured = stories[0];
  const rest = stories.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Spotlight
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Stories worth a slow read</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Long-form pieces about Zambian destinations, hosts and the people who make a place worth visiting.
          </p>
        </header>

        <Link to="/spotlight/$storyId" params={{ storyId: featured.id }} className="mt-8 block group">
          <Card className="overflow-hidden border-border/60">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto">
                <img src={featured.image} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <CardContent className="p-6 md:p-10 flex flex-col justify-center">
                <Badge variant="secondary" className="self-start text-[11px]">{featured.tag} · Featured</Badge>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">{featured.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> {featured.read} read
                  <span className="ml-auto inline-flex items-center gap-1 font-medium text-primary">Read story <ArrowRight className="h-4 w-4" /></span>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>

        <section className="mt-10">
          <h3 className="text-lg font-bold tracking-tight">More stories</h3>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {rest.map((s) => (
              <Link key={s.id} to="/spotlight/$storyId" params={{ storyId: s.id }} className="group block">
                <Card className="overflow-hidden border-border/60 h-full transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="text-[11px]">{s.tag}</Badge>
                    <h4 className="mt-2 font-semibold leading-snug">{s.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.excerpt}</p>
                    <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {s.read} read</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

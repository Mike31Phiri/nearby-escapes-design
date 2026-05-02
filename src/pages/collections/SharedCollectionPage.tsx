import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, MapPin, Star, Bookmark, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { listings } from "@/lib/mock-data";

export function SharedCollectionPage() {
  const { shareId } = useParams();
  const items = listings.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="rounded-2xl border border-border bg-primary-soft/40 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Shared with you</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Chanda's Zambezi week</h1>
              <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                <Avatar className="h-6 w-6"><AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">CK</AvatarFallback></Avatar>
                Curated by Chanda K. · {items.length} stays · Link <span className="font-mono text-xs">#{shareId.slice(0, 6)}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm"><Users className="h-4 w-4 mr-1" /> Comment</Button>
              <Button size="sm"><Bookmark className="h-4 w-4 mr-1" /> Save collection</Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => (
            <Card key={l.id} className="overflow-hidden border-border/60 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
              <Link href="/stays/$stayId" params={{ stayId: l.id }}>
                <div className="relative aspect-[4/3]">
                  <img src={l.image} alt={l.name} className="h-full w-full object-cover" />
                  <Badge className="absolute left-2 top-2 text-[11px]">Picked by Chanda</Badge>
                  <Button size="icon" variant="ghost" className="absolute right-2 top-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{l.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {l.location}</p>
                  </div>
                  <span className="text-xs flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent" />{l.rating}</span>
                </div>
                <p className="mt-3 text-sm"><span className="font-bold">${l.price}</span><span className="text-muted-foreground"> / night</span></p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

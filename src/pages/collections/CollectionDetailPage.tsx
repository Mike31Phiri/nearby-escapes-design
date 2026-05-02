import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Heart, Share2, Users, Plus, MapPin, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { listings } from "@/lib/mock-data";

const titles: Record<string, string> = {
  weekend: "Weekend escapes",
  safari: "Safari season",
  city: "City breaks",
  family: "Family-friendly",
};

export function CollectionDetailPage() {
  const { collectionId } = useParams();
  const title = titles[collectionId] ?? "Collection";
  const items = listings.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link href="/collections" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All collections
        </Link>

        <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Collection</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{items.length} stays · last updated 3 days ago</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm"><Users className="h-4 w-4 mr-1" /> Invite</Button>
            <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-1" /> Share</Button>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add stay</Button>
          </div>
        </header>

        <Card className="mt-6 border-border/60">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["MP", "CK", "BL"].map((i) => (
                  <Avatar key={i} className="h-8 w-8 border-2 border-card">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">3 collaborators</p>
            </div>
            <Badge variant="secondary" className="text-[11px]">Edit access</Badge>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => (
            <Card key={l.id} className="overflow-hidden border-border/60 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
              <Link href="/stays/$stayId" params={{ stayId: l.id }}>
                <div className="relative aspect-[4/3]">
                  <img src={l.image} alt={l.name} className="h-full w-full object-cover" />
                  <Button size="icon" variant="ghost" className="absolute right-2 top-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur">
                    <Heart className="h-4 w-4 fill-primary text-primary" />
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
                <p className="mt-2 text-xs text-muted-foreground italic">"Great spot for a quick weekend"</p>
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

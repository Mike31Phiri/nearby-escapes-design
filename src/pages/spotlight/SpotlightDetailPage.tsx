import { useParams, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Share2, Bookmark, MapPin, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listings } from "@/lib/mock-data";
import lodge from "@/assets/listing-lodge.jpg";

export function SpotlightDetailPage() {
  const { storyId } = useParams({ from: "/spotlight/$storyId" });
  const linked = listings.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <article className="flex-1">
        <div className="relative h-[55vh] min-h-[360px]">
          <img src={lodge} alt="Story hero" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/40" />
          <div className="relative mx-auto flex h-full max-w-3xl flex-col justify-end px-4 pb-12 text-background md:px-6">
            <Link to="/spotlight" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-background/85 hover:text-background">
              <ArrowLeft className="h-4 w-4" /> Spotlight
            </Link>
            <Badge variant="secondary" className="mt-4 self-start text-[11px]">Destination</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">Chasing the high-water roar at Victoria Falls</h1>
            <p className="mt-3 text-background/85 max-w-2xl">A long weekend along the Zambezi when the spray reaches a kilometre into the sky.</p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">EM</AvatarFallback></Avatar>
              <div>
                <p className="text-sm font-semibold">Edith Mwale</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> 8 min read · Apr 28, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline"><Bookmark className="h-4 w-4 mr-1" /> Save</Button>
              <Button size="sm" variant="outline"><Share2 className="h-4 w-4 mr-1" /> Share</Button>
            </div>
          </div>

          <div className="prose prose-sm sm:prose-base max-w-none mt-8 space-y-5 leading-7 text-foreground/90">
            <p>The first thing you hear is not the water. It is the sound of the spray itself — a dense, weather-system mist that has its own rhythm and rolls across your face like rain.</p>
            <p>April is when the Zambezi runs at its peak. The viewpoint at the Knife Edge Bridge becomes a small ritual: dry shoes, wet shoes, soaked clothes, a quiet laugh between strangers as you both lean into the mist together.</p>
            <h2 className="text-xl font-bold tracking-tight !mt-8">Where to base yourself</h2>
            <p>Stay close enough to walk to the gates by sunrise. The riverside lodges along the upper Zambezi let you slip out for a paddle before breakfast. By midday, you are back on the deck with a long, slow lunch.</p>
            <p>If you can, plan two nights. One for the falls. One for everything else — a sundowner cruise, a market morning in Livingstone, a slow drive back through the bush.</p>
            <h2 className="text-xl font-bold tracking-tight !mt-8">Practical notes</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Bring a microfibre towel and a dry bag for your phone.</li>
              <li>Arrive at the gates by 6:15 AM for empty viewpoints.</li>
              <li>Sandals beat shoes for the path along the chasm.</li>
            </ul>
          </div>

          <section className="mt-12">
            <h3 className="text-lg font-bold tracking-tight">Stay near this story</h3>
            <p className="text-xs text-muted-foreground">Story #{storyId.slice(0, 8)}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {linked.map((l) => (
                <Link key={l.id} to="/stays/$stayId" params={{ stayId: l.id }}>
                  <Card className="overflow-hidden border-border/60 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
                    <div className="aspect-[4/3]"><img src={l.image} alt={l.name} className="h-full w-full object-cover" /></div>
                    <CardContent className="p-3">
                      <p className="font-semibold text-sm">{l.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {l.location}</p>
                      <p className="mt-1.5 text-xs flex items-center justify-between">
                        <span><Star className="h-3 w-3 inline fill-accent text-accent" /> {l.rating}</span>
                        <span className="font-bold">${l.price}<span className="font-normal text-muted-foreground"> / night</span></span>
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>
      <Footer />
    </div>
  );
}

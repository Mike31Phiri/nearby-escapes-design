"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Gem, MapPin, Clock, Users, 
  Star, Share2, Heart, CheckCircle2,
  Calendar, Camera, Languages, Utensils
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function GemDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 md:px-6 pt-8 pb-12">
          {/* Hero Image Section */}
          <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden mb-10 group">
            <img 
              src="https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=1200&h=800" 
              alt="Experience" 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-6 left-6">
              <Badge className="bg-primary text-primary-foreground border-none px-4 py-1.5 font-bold text-sm shadow-xl">Hidden Gem</Badge>
            </div>
            <div className="absolute bottom-10 left-6 right-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-2xl">Traditional Tonga Village Experience</h1>
                  <div className="flex flex-wrap items-center gap-4 text-white/90 font-bold">
                    <div className="flex items-center gap-1.5"><MapPin className="h-5 w-5" /> Monze, Southern Zambia</div>
                    <div className="flex items-center gap-1.5"><Star className="h-5 w-5 fill-accent text-accent border-none" /> 5.0 (48 reviews)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" className="rounded-full h-12 w-12 p-0 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/40"><Share2 className="h-5 w-5" /></Button>
                  <Button variant="secondary" className="rounded-full h-12 w-12 p-0 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/40"><Heart className="h-5 w-5" /></Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="flex flex-wrap gap-8 py-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Duration</p>
                    <p className="font-bold">4-5 Hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Group Size</p>
                    <p className="font-bold">Up to 8 people</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Languages className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Languages</p>
                    <p className="font-bold">English, Tonga</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Utensils className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Includes</p>
                    <p className="font-bold">Lunch & Drinks</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">What you&apos;ll do</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Immerse yourself in the authentic daily life of the Tonga people. Your host, Mutinta, will welcome you into her family homestead where you&apos;ll learn about traditional architecture, organic farming practices, and the rich history of the Gwembe Valley.
                  <br /><br />
                  You&apos;ll participate in preparing a traditional meal, try your hand at basket weaving, and hear captivating stories passed down through generations. This is not just a tour, but a genuine cultural exchange that supports the local community directly.
                </p>
              </div>

              <div className="space-y-6 border-t border-border/50 pt-10">
                <h2 className="text-2xl font-bold tracking-tight">What&apos;s included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Traditional lunch prepared with local ingredients",
                    "Cultural guidance and storytelling",
                    "Basket weaving materials and workshop",
                    "Bottled water and traditional refreshments",
                    "Professional photography of your experience",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <span className="text-muted-foreground font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted/30 p-8 rounded-3xl border border-border/40 flex items-start gap-6">
                <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-primary/20">
                  <img src="https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg?auto=compress&fit=crop&w=100&h=100" alt="Guide" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Meet your guide, Mutinta</h3>
                  <p className="text-sm text-muted-foreground mt-1">Member since 2021 • 5.0 Rating</p>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                    &quot;I love sharing my culture and traditions with visitors from all over the world. It brings me great joy to see people connect with our way of life and appreciate the wisdom of our ancestors.&quot;
                  </p>
                  <Button variant="outline" className="mt-6 rounded-xl font-bold border-2">Contact Mutinta</Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-32 border-border/60 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                <CardContent className="p-8">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">From</p>
                      <span className="text-3xl font-extrabold text-foreground">ZMW 450</span>
                      <span className="text-muted-foreground"> / person</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold uppercase text-muted-foreground px-1">Select Date</label>
                      <div className="flex items-center justify-between bg-muted/50 border border-border/60 rounded-xl px-4 py-3 cursor-pointer hover:bg-muted/70 transition-colors">
                        <span className="font-bold">May 18, 2024</span>
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold uppercase text-muted-foreground px-1">Guests</label>
                      <div className="flex items-center justify-between bg-muted/50 border border-border/60 rounded-xl px-4 py-3">
                        <span className="font-bold">2 Guests</span>
                        <div className="flex items-center gap-3">
                          <button className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center font-bold">-</button>
                          <span className="font-bold">2</span>
                          <button className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center font-bold">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout/summary">
                    <Button className="w-full h-14 rounded-2xl bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-lg font-extrabold text-lg">
                      Book Experience
                    </Button>
                  </Link>

                  <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                      <Gem className="h-4 w-4" /> Rare Experience
                    </div>
                    <p className="text-xs text-muted-foreground">This experience usually sells out 2 weeks in advance.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

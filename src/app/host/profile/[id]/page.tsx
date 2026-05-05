"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star, MapPin, MessageCircle, ShieldCheck,
  BadgeCheck, Calendar, Users, TrendingUp,
  ArrowLeft, ExternalLink, ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { listings } from "@/lib/mock-data";
import { ListingCard } from "@/components/ListingCard";

const hostData = {
  "bwalya-chisanga": {
    id: "bwalya-chisanga",
    name: "Bwalya Chisanga",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&fit=crop&w=200&h=200",
    location: "Livingstone, Zambia",
    joined: "January 2022",
    bio: "Born and raised in Zambia's Southern Province, I have spent my life surrounded by the raw beauty of this incredible country. I started hosting to share the magic of Zambia with visitors from around the world — the kind of magic you can't find in any guidebook.\n\nMy properties are designed to give guests an authentic, luxurious experience while connecting deeply with the local environment and culture. I speak English, Tonga, and Nyanja.",
    responseRate: 98,
    responseTime: "Within an hour",
    totalListings: 4,
    totalReviews: 148,
    rating: 4.98,
    isSuperhost: true,
    highlights: ["Fluent in 3 languages", "Wildlife guide certified", "5+ years hosting"],
  },
};

const mockHostReviews = [
  {
    id: "hr1",
    guest: "Sarah K.",
    avatar: "https://i.pravatar.cc/80?img=25",
    rating: 5,
    date: "April 2026",
    listing: "Mosi-oa-Tunya Lodge",
    text: "Bwalya is an exceptional host. He went above and beyond to make our stay unforgettable — arranging a private sundowner cruise we didn't even ask for!",
  },
  {
    id: "hr2",
    guest: "James M.",
    avatar: "https://i.pravatar.cc/80?img=33",
    rating: 5,
    date: "March 2026",
    listing: "Zambezi Riverside House",
    text: "One of the best hosts we've ever had anywhere in Africa. Bwalya's local knowledge is priceless — he recommended spots that completely transformed our trip.",
  },
  {
    id: "hr3",
    guest: "Amara N.",
    avatar: "https://i.pravatar.cc/80?img=47",
    rating: 5,
    date: "February 2026",
    listing: "Kafue Eco Lodge",
    text: "Professional, warm, and incredibly attentive. The property was exactly as described, and Bwalya checked in regularly to make sure we had everything we needed.",
  },
  {
    id: "hr4",
    guest: "David L.",
    avatar: "https://i.pravatar.cc/80?img=15",
    rating: 4,
    date: "January 2026",
    listing: "Mosi-oa-Tunya Lodge",
    text: "Great host, very communicative throughout the process. The property is stunning. Would have given 5 stars but had a minor issue with hot water on day 2.",
  },
];

export default function HostPublicProfilePage() {
  const params = useParams();
  const hostId = (params.id as string) || "bwalya-chisanga";
  const host = hostData[hostId as keyof typeof hostData] || hostData["bwalya-chisanga"];

  const hostListings = listings.slice(0, host.totalListings);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Back nav */}
        <div className="mx-auto max-w-7xl px-4 md:px-6 pt-6 pb-2">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        </div>

        <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* LEFT — Host card */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-border/60 shadow-2xl rounded-[40px] overflow-hidden sticky top-28">
                <CardContent className="p-8 text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-4">
                    <img
                      src={host.avatar}
                      alt={host.name}
                      className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-xl mx-auto"
                    />
                    {host.isSuperhost && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                        Superhost
                      </div>
                    )}
                  </div>

                  <h1 className="text-2xl font-black tracking-tight mt-6">{host.name}</h1>

                  <div className="flex items-center justify-center gap-1.5 mt-2 text-sm font-medium text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {host.location}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border/50">
                    <div>
                      <p className="text-2xl font-black">{host.totalReviews}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Reviews</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black">{host.rating}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Rating</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black">{host.totalListings}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Listings</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-border/50 text-left">
                    {[
                      { icon: BadgeCheck, label: "Identity verified" },
                      { icon: ShieldCheck, label: `${host.responseRate}% response rate` },
                      { icon: Calendar, label: `Joined ${host.joined}` },
                      { icon: TrendingUp, label: `Replies ${host.responseTime.toLowerCase()}` },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-3 text-sm font-medium">
                        <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                        {label}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 space-y-3">
                    <Link href="/inbox">
                      <Button className="w-full h-12 rounded-2xl bg-[image:var(--gradient-hero)] hover:opacity-95 font-black shadow-lg flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" /> Message Host
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      To protect your payment, never transfer money or communicate outside of Nearby Escapes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT — Content */}
            <div className="lg:col-span-2 space-y-16">

              {/* Bio */}
              <section>
                <h2 className="text-2xl font-black tracking-tight mb-6">About {host.name.split(" ")[0]}</h2>
                <div className="space-y-4">
                  {host.bio.split("\n\n").map((para, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed">{para}</p>
                  ))}
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-3 mt-6">
                  {host.highlights.map((h) => (
                    <Badge key={h} variant="secondary" className="font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-2xl">
                      {h}
                    </Badge>
                  ))}
                </div>
              </section>

              {/* Listings */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black tracking-tight">
                    {host.name.split(" ")[0]}&apos;s listings
                  </h2>
                  <Badge className="bg-primary/10 text-primary border-none font-bold">
                    {host.totalListings} places
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 stagger-children">
                  {hostListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </section>

              {/* Reviews */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <Star className="h-6 w-6 fill-foreground text-foreground" />
                  <h2 className="text-2xl font-black tracking-tight">
                    {host.rating} · {host.totalReviews} reviews
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {mockHostReviews.map((review) => (
                    <div key={review.id} className="p-6 bg-muted/20 rounded-3xl border border-border/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={review.avatar} alt={review.guest} className="h-11 w-11 rounded-full object-cover" />
                          <div>
                            <p className="font-black text-sm">{review.guest}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">{review.listing}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <ThumbsUp className="h-3.5 w-3.5" /> Helpful
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="mt-8 rounded-2xl font-black border-2 h-12 px-8 hover:bg-primary hover:text-white transition-all">
                  Show all {host.totalReviews} reviews
                </Button>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

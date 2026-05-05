"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star, MapPin, Share2, Heart,
  Wifi, Coffee, Car, Wind,
  ShieldCheck, ArrowRight,
  ChevronLeft, ChevronRight, User, Flame,
  Trees, Dumbbell, Utensils, WavesLadder, Lock,
} from "lucide-react";
import Link from "next/link";
import { listings, type Listing } from "@/lib/mock-data";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ListingCard } from "@/components/ListingCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const locationCoords: Record<string, { lat: number; lng: number; zoom: number }> = {
  "Livingstone": { lat: -17.8419, lng: 25.8542, zoom: 13 },
  "Lusaka": { lat: -15.4166, lng: 28.2833, zoom: 13 },
  "South Luangwa": { lat: -13.0, lng: 31.8, zoom: 11 },
  "Lower Zambezi": { lat: -15.85, lng: 29.3, zoom: 12 },
  "Kafue": { lat: -15.76, lng: 28.18, zoom: 12 },
  "Ndola": { lat: -12.9696, lng: 28.6364, zoom: 13 },
  "Chipata": { lat: -13.6333, lng: 32.6333, zoom: 13 },
  "Kitwe": { lat: -12.8026, lng: 28.2132, zoom: 13 },
};

const mockReviews = [
  {
    id: "rv1",
    name: "Chanda M.",
    avatar: "https://i.pravatar.cc/80?img=5",
    rating: 5,
    date: "March 2026",
    text: "Absolutely breathtaking location. The lodge is even more stunning in person — perfect blend of luxury and nature. The host was incredibly accommodating and went above and beyond.",
  },
  {
    id: "rv2",
    name: "Bwalya K.",
    avatar: "https://i.pravatar.cc/80?img=12",
    rating: 5,
    date: "February 2026",
    text: "One of the best stays I've ever had in Zambia. The sunset views are unreal. Will definitely be coming back — highly recommend to anyone looking for a genuine escape.",
  },
  {
    id: "rv3",
    name: "Mulenga P.",
    avatar: "https://i.pravatar.cc/80?img=9",
    rating: 4,
    date: "January 2026",
    text: "Wonderful place. The amenities are top notch, and the surrounding nature is incredible. Only minor thing was that the Wi-Fi was a bit slow, but honestly that just made us disconnect.",
  },
  {
    id: "rv4",
    name: "Gift N.",
    avatar: "https://i.pravatar.cc/80?img=21",
    rating: 5,
    date: "December 2025",
    text: "Celebrated our anniversary here — magical! The staff arranged a surprise candlelit dinner by the river. Perfect service, perfect setting.",
  },
];

const amenities = [
  { icon: Wifi, label: "Fast Wi-Fi (50 Mbps)" },
  { icon: Coffee, label: "Breakfast included" },
  { icon: Car, label: "Free parking" },
  { icon: Wind, label: "Air conditioning" },
  { icon: Trees, label: "Private garden" },
  { icon: Dumbbell, label: "Gym access" },
  { icon: Utensils, label: "Full kitchen" },
  { icon: WavesLadder, label: "Swimming pool" },
  { icon: ShieldCheck, label: "24/7 Security" },
  { icon: Lock, label: "Safe deposit box" },
];

export default function StayDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    try {
      const mock = JSON.parse(localStorage.getItem("mock_host_listings") || "[]");
      const foundMock = mock.find((l: any) => l.id === id);
      if (foundMock) {
        setListing(foundMock);
        return;
      }
    } catch(e) {}
    
    const foundStatic = listings.find((l) => l.id === id) || listings[0];
    setListing(foundStatic);
  }, [id]);

  if (!listing) {
    return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;
  }

  const similar = listings.filter((l) => l.id !== listing.id).slice(0, 4);

  const coords = locationCoords[listing.location] || { lat: -15.4166, lng: 28.2833, zoom: 12 };
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.05}%2C${coords.lat - 0.05}%2C${coords.lng + 0.05}%2C${coords.lat + 0.05}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;

  const defaultPhotos = [
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&fit=crop&w=800&h=600",
    "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&fit=crop&w=800&h=600",
    "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&fit=crop&w=800&h=600",
    "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&fit=crop&w=800&h=600",
  ];

  const galleryImages = listing.photos && listing.photos.length > 0 
    ? [
        ...listing.photos,
        ...Array.from({ length: Math.max(0, 5 - listing.photos.length) }).map((_, i) => defaultPhotos[i % 4])
      ].slice(0, 5)
    : [
        listing.image,
        ...defaultPhotos
      ];

  const avgRating = mockReviews.reduce((a, r) => a + r.rating, 0) / mockReviews.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="mx-auto max-w-7xl px-4 md:px-6 pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">{listing.name}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge variant="secondary" className="font-bold text-xs uppercase tracking-wider">{listing.category}</Badge>
                <div className="flex items-center gap-1 text-sm font-bold">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span>{listing.rating}</span>
                  <span className="text-muted-foreground font-medium underline cursor-pointer">({listing.reviews} reviews)</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-semibold underline cursor-pointer">{listing.location}, Zambia</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-xl gap-2 font-bold text-sm h-10"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
              >
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsSaved(!isSaved);
                  toast.success(isSaved ? "Removed from saved" : "Saved to your list");
                }}
                className="rounded-xl gap-2 font-bold text-sm h-10"
              >
                <Heart className={cn("h-4 w-4 transition-colors", isSaved ? "fill-primary text-primary" : "")} />
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="mx-auto max-w-7xl px-4 md:px-6 mb-10">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[520px] rounded-3xl overflow-hidden">
            <div className="col-span-4 md:col-span-2 row-span-2 relative group cursor-pointer">
              <img src={listing.image} alt="Main view" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            {galleryImages.slice(1, 5).map((img, i) => (
              <div key={i} className={cn("hidden md:block relative group cursor-pointer overflow-hidden", i === 1 && "rounded-tr-3xl", i === 3 && "rounded-br-3xl")}>
                <img src={img} alt={`View ${i + 2}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {i === 3 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                    <span className="text-white font-black text-sm border-2 border-white rounded-2xl px-4 py-2">+12 photos</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Content & Sidebar */}
        <section className="mx-auto max-w-7xl px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 pb-16">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">

            {/* Host row */}
            <div className="flex items-center justify-between border-b border-border/50 pb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">
                  Entire {listing.category.toLowerCase()} hosted by Bwalya
                </h2>
                <p className="text-muted-foreground mt-1 font-medium">4 guests · 2 bedrooms · 2 beds · 1 bath</p>
              </div>
              <Link href="/host/profile/bwalya-chisanga" className="group flex-shrink-0">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-muted overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&fit=crop&w=100&h=100" alt="Host Bwalya" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
              </Link>
            </div>

            {/* Highlights */}
            <div className="space-y-6">
              {[
                { icon: Wifi, title: "Fast Wi-Fi", sub: "At 50 Mbps — great for remote work and streaming." },
                { icon: Flame, title: "Popular with guests", sub: "This property is booked 85% of the time. Book soon!" },
                { icon: ShieldCheck, title: "Superhost", sub: "Bwalya has a 98% response rate and 4.9 average rating." },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex gap-5">
                  <Icon className="h-7 w-7 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-black">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="border-t border-border/50 pt-10">
              <h2 className="text-xl font-black mb-4">About this place</h2>
              <p className="text-muted-foreground leading-relaxed">
                {listing.description} Perched at the edge of the wilderness, this property delivers an experience that is truly one-of-a-kind. Designed with natural local materials and adorned with handcrafted Zambian art, every corner tells a story.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Wake up to the sounds of nature, enjoy sundowners on your private deck, and fall asleep under an infinite canopy of stars. Whether you're here for adventure or complete relaxation, this escape delivers both.
              </p>
              <button className="mt-4 font-black underline flex items-center gap-1 text-sm hover:text-primary transition-colors">
                Show more <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Amenities */}
            <div className="border-t border-border/50 pt-10">
              <h2 className="text-xl font-black mb-6">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(showAllAmenities ? amenities : amenities.slice(0, 6)).map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 py-2">
                    <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAllAmenities(!showAllAmenities)}
                className="mt-6 rounded-2xl font-black border-2 h-12 px-8 hover:bg-primary hover:text-white transition-all"
              >
                {showAllAmenities ? "Show fewer amenities" : `Show all ${amenities.length} amenities`}
              </Button>
            </div>

            {/* Map */}
            <div className="border-t border-border/50 pt-10">
              <h2 className="text-xl font-black mb-2">Where you'll be</h2>
              <p className="text-muted-foreground mb-6 font-medium flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" /> {listing.location}, Zambia
              </p>
              <div className="relative rounded-3xl overflow-hidden border border-border/60 shadow-xl" style={{ height: "380px" }}>
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "saturate(0.8) contrast(1.05)" }}
                  loading="lazy"
                  title={`Map of ${listing.location}`}
                  allowFullScreen
                />
                <div className="absolute bottom-4 right-4">
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=${coords.zoom}/${coords.lat}/${coords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white shadow-xl rounded-2xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-primary flex items-center gap-2 hover:bg-primary hover:text-white transition-all border border-border/40"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Open full map
                  </a>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Exact location provided after booking confirmation.</p>
            </div>

            {/* Host card */}
            <div className="border-t border-border/50 pt-10">
              <h2 className="text-xl font-black mb-6">Meet your host</h2>
              <div className="flex items-start gap-6 p-6 bg-muted/20 rounded-3xl border border-border/50">
                <Link href="/host/profile/bwalya-chisanga" className="flex-shrink-0 group">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow">
                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&fit=crop&w=100&h=100" alt="Host" />
                  </div>
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link href="/host/profile/bwalya-chisanga">
                      <h3 className="font-black text-lg hover:text-primary transition-colors">Bwalya Chisanga</h3>
                    </Link>
                    <Badge className="bg-primary/10 text-primary border-none font-bold text-[10px] uppercase tracking-wider">Superhost</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    <span>148 reviews</span>
                    <span>·</span>
                    <span>4.98 rating</span>
                    <span>·</span>
                    <span>3 yrs hosting</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Passionate about sharing the beauty of Zambia. I love connecting with travelers and ensuring every guest feels at home in the wild.
                  </p>
                  <Link href="/host/profile/bwalya-chisanga">
                    <Button variant="outline" className="mt-4 rounded-2xl font-bold border-2 h-10 px-6 text-sm hover:bg-primary hover:text-white transition-all">
                      View profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="border-t border-border/50 pt-10">
              <div className="flex items-center gap-4 mb-8">
                <Star className="h-6 w-6 fill-foreground text-foreground" />
                <h2 className="text-xl font-black">{avgRating.toFixed(1)} · {mockReviews.length} reviews</h2>
              </div>

              {/* Rating breakdown */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-10 p-6 bg-muted/20 rounded-3xl border border-border/40">
                {[
                  { label: "Cleanliness", score: 4.9 },
                  { label: "Communication", score: 5.0 },
                  { label: "Check-in", score: 4.8 },
                  { label: "Accuracy", score: 4.9 },
                  { label: "Location", score: 5.0 },
                  { label: "Value", score: 4.7 },
                ].map(({ label, score }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-foreground rounded-full" style={{ width: `${(score / 5) * 100}%` }} />
                      </div>
                      <span className="text-sm font-bold">{score}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mockReviews.map((review) => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={review.avatar} alt={review.name} className="h-11 w-11 rounded-full object-cover" />
                      <div>
                        <p className="font-black text-sm">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-3.5 w-3.5", i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/30")} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="mt-8 rounded-2xl font-black border-2 h-12 px-8 hover:bg-primary hover:text-white transition-all">
                Show all {listing.reviews} reviews
              </Button>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28 border-border/60 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="text-3xl font-black text-foreground">ZMW {listing.price}</span>
                    <span className="text-muted-foreground font-medium"> / night</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-black bg-accent/10 px-3 py-1.5 rounded-xl">
                    <Star className="h-4 w-4 fill-accent text-accent" /> {listing.rating}
                  </div>
                </div>

                <div className="grid grid-cols-2 border border-border rounded-2xl overflow-hidden mb-4">
                  <div className="p-3 border-r border-b border-border hover:bg-muted/30 cursor-pointer transition-colors">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Check-in</p>
                    <p className="text-sm font-medium mt-0.5">Add date</p>
                  </div>
                  <div className="p-3 border-b border-border hover:bg-muted/30 cursor-pointer transition-colors">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Check-out</p>
                    <p className="text-sm font-medium mt-0.5">Add date</p>
                  </div>
                  <div className="col-span-2 p-3 hover:bg-muted/30 cursor-pointer transition-colors">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Guests</p>
                    <p className="text-sm font-medium mt-0.5">1 guest</p>
                  </div>
                </div>

                <Link href={`/booking/${listing.id}`}>
                  <Button className="w-full h-14 rounded-2xl bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-lg font-black text-lg mb-3">
                    Reserve
                  </Button>
                </Link>
                <p className="text-center text-xs text-muted-foreground mb-6">You won&apos;t be charged yet</p>

                <div className="space-y-3 pt-6 border-t border-border/50 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span className="underline cursor-pointer">ZMW {listing.price} × 5 nights</span>
                    <span>ZMW {listing.price * 5}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="underline cursor-pointer">Cleaning fee</span>
                    <span>ZMW 150</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="underline cursor-pointer">Nearby Escapes service fee</span>
                    <span>ZMW 245</span>
                  </div>
                  <div className="flex justify-between font-black text-lg pt-4 border-t border-border/50">
                    <span>Total</span>
                    <span>ZMW {listing.price * 5 + 395}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Similar Listings */}
        <section className="mx-auto max-w-7xl px-4 md:px-6 pb-24">
          <div className="border-t border-border/50 pt-16">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-10">Similar places you might like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 stagger-children">
              {similar.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

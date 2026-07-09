"use client";

import { useState } from"react";
import Link from"next/link";
import { useRouter } from"next/navigation";
import { toast } from"sonner";
import {
 Heart,
 ChevronLeft,
 ChevronRight,
 Clock,
 Timer,
 Wifi,
 MapPin,
 Snowflake,
 Plug,
 Briefcase,
 MonitorPlay,
 HeartPulse,
 Lightbulb,
 RefreshCcw,
 Bus,
} from"lucide-react";
import { useWishlistStore } from"@/store/wishlistStore";
import { useAuth } from"@/lib/store/authStore";
import { AuthGuardDialog } from"@/components/guest/auth/AuthGuardDialog";
import { cn } from"@/lib/utils";
import type { Transport } from"@/lib/mock-data";
import { mockListingReviews } from"@/lib/mock-listing-reviews";

interface TransportDetailPageProps {
 route: Transport;
 backHref?: string;
}

export function TransportDetailPage({ route, backHref ="/transport"}: TransportDetailPageProps) {
 const router = useRouter();
 
 const [activeImg, setActiveImg] = useState(0);
 const [showAuthDialog, setShowAuthDialog] = useState(false);

 const { isAuthenticated } = useAuth();
 const { isSaved, addItem, removeItem } = useWishlistStore();
 const isFavorited = isSaved(route.id);

 const reviews = mockListingReviews[route.id] || [];
 const avgRating = reviews.length > 0
 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
 : 4.8;
 const reviewCount = reviews.length || 98;

 // Set up mock gallery images for transport
 const images = [
 route.image ||"https://images.unsplash.com/photo-1570125909232-eb2be79ff63d?auto=format&fit=crop&w=1100&q=80",
"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1100&q=80",
"https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=1100&q=80"
 ];

 const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
 const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

 const handleToggleFavorite = () => {
 if (isFavorited) {
 removeItem(route.id);
 toast.success(`Removed from collections`);
 } else {
 addItem({
 id: route.id,
 name: `${route.from} to ${route.to}`,
 image: route.image,
 price: route.price,
 location: route.from,
 rating: avgRating,
 reviews: reviewCount,
 type:"Transport",
 });
 toast.success(`Saved to collections`, {
 icon: <Heart className="h-4 w-4 fill-purple text-purple"/>,
 });
 }
 };

 const title = `${route.from} to ${route.to} Express`;
 const hostName = route.operator ||"Chisanga Transport";
 const priceDisplay = `K${route.price || 180}`;

 return (
 <div className="bg-white-warm text-black font-sans min-h-screen">
 <main className="max-w-[1100px] mx-auto px-4 pt-4 pb-28 lg:pb-8">
 
 {/* Breadcrumb */}
 <nav className="flex flex-wrap items-center text-xs text-black-faint mb-4">
 <Link href="/"className="hover:text-purple transition-colors">Home</Link> <span className="mx-1.5 text-black-muted/50">›</span>
 <Link href="/explore"className="hover:text-purple transition-colors">Explore</Link> <span className="mx-1.5 text-black-muted/50">›</span>
 <Link href="/zambia"className="hover:text-purple transition-colors">Zambia</Link> <span className="mx-1.5 text-black-muted/50">›</span>
 <Link href={backHref} className="hover:text-purple transition-colors">Local Transport</Link> <span className="mx-1.5 text-black-muted/50">›</span>
 <span className="text-black font-medium">{title}</span>
 </nav>

 {/* Hero Gallery */}
 <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden mb-6 group">
 <img 
 src={images[activeImg]} 
 className="w-full h-full object-cover"
 alt="Bus on the road"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
 
 <button
 onClick={(e) => { e.stopPropagation(); prevImg(); }}
 className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/70 backdrop-blur-sm text-black flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
 >
 <ChevronLeft className="h-6 w-6"/>
 </button>
 <button
 onClick={(e) => { e.stopPropagation(); nextImg(); }}
 className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/70 backdrop-blur-sm text-black flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
 >
 <ChevronRight className="h-6 w-6"/>
 </button>

 <div className="absolute bottom-4 left-4 flex flex-col gap-2">
 <span className="bg-purple/90 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm flex items-center gap-1.5">
 <Bus className="w-3.5 h-3.5"/> Bus • 40 seats
 </span>
 </div>

 <div className="absolute bottom-4 right-4 flex gap-2">
 <button 
 onClick={handleToggleFavorite}
 className="bg-white/90 backdrop-blur-sm h-9 w-9 rounded-lg shadow-lg flex items-center justify-center hover:bg-white transition-colors text-black"
 >
 <Heart className={cn("h-4 w-4", isFavorited ?"fill-purple text-purple":"text-black")} />
 </button>
 </div>
 </div>

 {/* Main Info + Booking Sidebar Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
 {/* LEFT COLUMN: Trust & Logistics */}
 <div className="space-y-6 divide-y divide-white-soft">
 {/* Title & Host */}
 <div className="pt-2">
 <div className="flex justify-between items-start">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-black">{title}</h1>
 <div className="mt-1 text-sm text-black-soft font-medium flex flex-wrap items-center gap-y-2 gap-x-4">
 <span className="flex items-center gap-1">
 <span className="bg-gold text-white px-2 py-0.5 rounded text-xs font-bold">{avgRating.toFixed(1)}</span>
 ({reviewCount} traveler reviews)
 </span>
 <span className="text-purple font-semibold">Hosted by {hostName}</span>
 </div>
 <p className="text-xs text-purple mt-2 font-script text-lg">Premium comfort, budget-friendly fares. Daily service for the curious explorer.</p>
 </div>
 </div>
 
 {/* Quick Facts */}
 <div className="flex flex-wrap gap-4 mt-4 text-sm text-black-soft bg-white-soft p-3 rounded-xl border border-white-soft">
 <span className="flex items-center gap-1.5">
 <Clock className="w-4 h-4 text-purple"/>
 <span className="font-medium">{route.departureTime ||"6:00 AM"} departure</span>
 </span>
 <span className="flex items-center gap-1.5">
 <Timer className="w-4 h-4 text-purple"/>
 <span className="font-medium">{route.duration ||"8 hours"} duration</span>
 </span>
 <span className="flex items-center gap-1.5">
 <Wifi className="w-4 h-4 text-purple"/>
 <span className="font-medium">Free Wi-Fi onboard</span>
 </span>
 <span className="flex items-center gap-1.5">
 <MapPin className="w-4 h-4 text-purple"/>
 <span className="font-medium">Intercity Terminal</span>
 </span>
 </div>
 </div>

 {/* The Overview */}
 <div className="pt-6">
 <h2 className="font-semibold text-lg text-black">About this ride</h2>
 <p className="text-sm text-black-soft leading-relaxed mt-2 whitespace-pre-wrap">
 Operating daily for over 7 years, {hostName} is a locally-owned family business providing reliable and comfortable road travel between Zambia's two biggest cities. Our coaches are equipped with modern AC, free high-speed Wi-Fi, and USB charging ports at every seat. We make two scheduled rest stops for food and restroom breaks.
 </p>
 </div>

 {/* Route & Schedule Timeline */}
 <div className="pt-6">
 <h2 className="font-semibold text-lg text-black">Route & schedule</h2>
 <div className="relative mt-4 pl-6 space-y-6 border-l-2 border-purple/30">
 <div>
 <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-purple rounded-full ring-4 ring-purple/10"></div>
 <p className="font-semibold text-sm text-black">{route.departureTime ||"6:00 AM"} — Depart {route.from}</p>
 <p className="text-xs text-black-muted mt-1">Intercity Bus Terminal (Gate 4)</p>
 </div>
 <div>
 <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-purple rounded-full ring-4 ring-purple/10"></div>
 <p className="font-semibold text-sm text-black">7:45 AM — Rest Stop: Kafue Town</p>
 <p className="text-xs text-black-muted mt-1">30-minute break for food, restrooms, and stretching.</p>
 </div>
 <div>
 <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-purple rounded-full ring-4 ring-purple/10"></div>
 <p className="font-semibold text-sm text-black">{route.arrivalTime ||"2:00 PM"} — Arrival in {route.to}</p>
 <p className="text-xs text-black-muted mt-1">Main Bus Station. Transfer to your lodge is available upon request.</p>
 </div>
 </div>
 </div>

 {/* Onboard Amenities */}
 <div className="pt-6">
 <h2 className="font-semibold text-lg text-black">Onboard amenities</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mt-4 text-sm text-black-soft">
 <div className="flex items-center gap-3">
 <Wifi className="w-5 h-5 text-purple shrink-0"/> Complimentary Wi-Fi
 </div>
 <div className="flex items-center gap-3">
 <Snowflake className="w-5 h-5 text-purple shrink-0"/> Air Conditioning
 </div>
 <div className="flex items-center gap-3">
 <Plug className="w-5 h-5 text-purple shrink-0"/> USB Charging Ports (Every seat)
 </div>
 <div className="flex items-center gap-3">
 <Briefcase className="w-5 h-5 text-purple shrink-0"/> Under-bus & overhead luggage
 </div>
 <div className="flex items-center gap-3">
 <MonitorPlay className="w-5 h-5 text-purple shrink-0"/> In-bus Entertainment screens
 </div>
 <div className="flex items-center gap-3">
 <HeartPulse className="w-5 h-5 text-purple shrink-0"/> Sanitizer & emergency first aid
 </div>
 </div>
 </div>

 {/* Meeting Point & Logistics */}
 <div className="pt-6">
 <h2 className="font-semibold text-lg text-black">Meeting point & logistics</h2>
 <p className="text-sm text-black-soft leading-relaxed mt-2">
 <strong>Departure point:</strong> {route.from} Intercity Bus Terminal, Gate 4 (Look for the purple booth).
 </p>
 <div className="mt-3 p-3 bg-purple-muted rounded-xl flex gap-3 text-sm text-black-soft">
 <Lightbulb className="w-5 h-5 text-purple shrink-0 mt-0.5"/>
 <p>
 <strong className="text-purple">Student tip:</strong> Arrive 30 minutes early to secure your preferred seat and store your luggage. Buses depart exactly on time.
 </p>
 </div>
 <div className="w-full h-40 bg-white-soft rounded-xl mt-4 flex items-center justify-center border border-white-soft relative overflow-hidden">
 <iframe
 title="Bus Terminal Map"
 width="100%"
 height="100%"
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 src={`https://www.openstreetmap.org/export/embed.html?bbox=28.2,-15.4,28.3,-15.3&layer=mapnik`}
 style={{ border: 0, filter:"contrast(0.9) brightness(0.95)"}}
 />
 </div>
 </div>

 {/* Reviews */}
 <div className="pt-6">
 <div className="flex items-center justify-between">
 <h2 className="font-semibold text-lg flex items-center gap-2 text-black">
 <span className="bg-gold text-white px-2 py-0.5 rounded text-sm">{avgRating.toFixed(1)}</span> · {reviewCount} reviews
 </h2>
 <button className="text-purple text-xs font-semibold hover:underline">Read all reviews</button>
 </div>
 <div className="mt-4 space-y-4">
 <div className="bg-white p-4 rounded-xl border border-white-soft">
 <div className="flex items-center justify-between">
 <span className="font-semibold text-sm text-black">Mutale (Student, 22)</span>
 <span className="text-xs text-black-faint">Dec 2025</span>
 </div>
 <p className="text-sm text-black-soft mt-2">"Super reliable! The bus left exactly on time, the Wi-Fi worked the whole trip, and the AC was ice-cold. Best value for money on this route."</p>
 </div>
 <div className="bg-white p-4 rounded-xl border border-white-soft">
 <div className="flex items-center justify-between">
 <span className="font-semibold text-sm text-black">The Journey Crew</span>
 <span className="text-xs text-black-faint">Nov 2025</span>
 </div>
 <p className="text-sm text-black-soft mt-2">"We took this bus for our group trip. The drivers were super friendly, they helped us load our gear, and we made it to Livingstone right on time. Highly recommend!"</p>
 </div>
 </div>
 </div>

 {/* Meet the Host */}
 <div className="pt-6">
 <h2 className="font-semibold text-lg text-black">Meet the hosts</h2>
 <div className="flex items-center gap-4 mt-3">
 <div className="w-12 h-12 rounded-full bg-purple text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
 CT
 </div>
 <div>
 <p className="font-semibold text-sm text-black">The Chisanga Family</p>
 <p className="text-xs text-black-muted flex items-center gap-1">
 <span className="bg-green-500 w-2 h-2 rounded-full inline-block"></span> Responds within 15 minutes
 </p>
 <p className="text-xs text-black-muted">Family-owned transport since 2018.</p>
 </div>
 </div>
 <p className="text-sm text-black-soft mt-3 italic">
"We are proud to offer the youth of Zambia reliable, comfortable travel at a price their pockets can handle. We reinvest everything we make to keep our buses in top condition and our drivers well-paid."
 </p>
 </div>
 </div>

 {/* RIGHT COLUMN: The Booking Card */}
 <div className="relative">
 <div className="bg-white border border-white-soft rounded-2xl p-6 shadow-lg sticky top-24">
 
 <div className="flex items-center justify-between border-b border-white-soft pb-4">
 <div>
 <span className="text-2xl font-bold text-black">{priceDisplay}</span> <span className="text-xs text-black-muted font-medium">/ per seat</span>
 </div>
 <div className="text-sm text-black-soft font-medium flex items-center gap-1">
 <span className="bg-gold text-white px-1.5 py-0.5 rounded text-xs font-bold">{avgRating.toFixed(1)}</span> Highly rated
 </div>
 </div>
 
 {/* FOMO / Seat Scarcity */}
 <div className="mt-4 p-3 bg-purple-muted border border-purple-border rounded-lg flex items-center gap-2 text-purple text-xs font-semibold">
 <span className="w-2 h-2 bg-purple rounded-full inline-block animate-pulse shrink-0"></span>
 Only 12 seats left for this departure!
 </div>
 
 <div className="py-5 space-y-3">
 {/* Date Picker */}
 <div className="bg-white-warm rounded-lg p-3 border border-white-soft flex justify-between items-center cursor-pointer hover:border-purple transition-colors">
 <div>
 <span className="text-[10px] text-black-faint block font-medium">SELECT DATE</span>
 <span className="text-sm font-semibold text-black">Aug 15, 2026</span>
 </div>
 <span className="text-xs text-purple font-semibold">Change</span>
 </div>
 
 {/* Seat Selector */}
 <div className="bg-white-warm rounded-lg p-3 border border-white-soft flex justify-between items-center cursor-pointer hover:border-purple transition-colors">
 <div>
 <span className="text-[10px] text-black-faint block font-medium">SEATS</span>
 <span className="text-sm font-semibold text-black">1 seat</span>
 </div>
 <span className="text-xs text-purple font-semibold">Edit</span>
 </div>

 {/* All-Inclusive Price Breakdown */}
 <div className="pt-4 space-y-2 text-sm">
 <div className="flex justify-between text-black-soft">
 <span>1 seat x {priceDisplay}</span>
 <span>{priceDisplay}</span>
 </div>
 <div className="flex justify-between text-black-soft">
 <span>Luggage allowance</span>
 <span className="text-green-600 font-medium">Included</span>
 </div>
 <div className="flex justify-between text-black font-bold border-t border-white-soft pt-3 mt-2">
 <span>Total (ZMW)</span>
 <span>{priceDisplay}</span>
 </div>
 </div>
 </div>
 
 {/* Cancellation policy */}
 <div className="mb-5 text-center">
 <span className="text-[10px] text-black-muted bg-white-warm px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 font-medium">
 <RefreshCcw className="w-3 h-3"/> Free cancellation up to 2 hours before
 </span>
 </div>

 <button 
 onClick={() => router.push(`/checkout/book?type=transport&id=${route.id}`)}
 className="w-full bg-purple text-white rounded-xl py-3.5 font-semibold hover:bg-purple-hover transition-colors text-base shadow-md shadow-purple/20"
 >
 Book your seat
 </button>
 </div>
 </div>
 </div>

 {/* Similar Routes Section */}
 <section className="mt-16 pt-8 border-t border-white-soft">
 <h2 className="text-xl font-bold text-black mb-6">More transport routes you might like</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {[
 { id:"sim-t1", name:"Lusaka to Ndola Express", type:"Bus", price:"K150", rating: 4.7, img:"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"},
 { id:"sim-t2", name:"Livingstone to Sesheke Shuttle", type:"Minibus", price:"K120", rating: 4.5, img:"https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=600&q=80"},
 { id:"sim-t3", name:"Lusaka to Chipata VIP Coach", type:"Luxury Bus", price:"K220", rating: 4.9, img:"https://images.unsplash.com/photo-1570125909232-eb2be79ff63d?auto=format&fit=crop&w=600&q=80"},
 ].map((simItem) => (
 <Link href={`/transport/${simItem.id}`} key={simItem.id} className="group block">
 <div className="w-full h-48 rounded-xl bg-white-soft overflow-hidden mb-3 relative">
 <img src={simItem.img} alt={simItem.name} className="w-full h-full object-cover"/>
 <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
 <Heart className="h-4 w-4 text-black hover:text-purple transition-colors"/>
 </button>
 <div className="absolute bottom-2 left-2">
 <span className="bg-purple/90 text-white text-[10px] px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
 {simItem.type}
 </span>
 </div>
 </div>
 <div className="flex justify-between items-start">
 <div>
 <h3 className="font-semibold text-black group-hover:text-purple transition-colors truncate">{simItem.name}</h3>
 </div>
 <div className="flex items-center gap-1 text-sm font-semibold text-black shrink-0">
 <span className="bg-gold text-white px-1.5 py-0.5 rounded text-[10px]">{simItem.rating}</span>
 </div>
 </div>
 <p className="text-sm text-black font-semibold mt-1">{simItem.price} <span className="font-normal text-black-faint">/ seat</span></p>
 </Link>
 ))}
 </div>
 </section>
 </main>

 {/* MOBILE STICKY BOTTOM BAR */}
 <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-white-soft p-4 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
 <div>
 <div className="flex items-center gap-2">
 <span className="text-xl font-bold text-black">{priceDisplay}</span> <span className="text-xs text-black-muted">/ seat</span>
 </div>
 <div className="text-xs text-black-muted flex items-center gap-1">
 <span className="text-red-700 font-bold">12 seats left!</span> · <span className="bg-gold text-white px-1 py-0.5 rounded text-[10px] font-bold">{avgRating.toFixed(1)}</span>
 </div>
 </div>
 <button 
 onClick={() => router.push(`/checkout/book?type=transport&id=${route.id}`)}
 className="bg-purple text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-purple-hover transition-colors text-sm flex-1 ml-4 max-w-[140px]"
 >
 Book now
 </button>
 </div>

 <AuthGuardDialog
 isOpen={showAuthDialog}
 onClose={() => setShowAuthDialog(false)}
 title="Save to your collections"
 description="Sign in to save this transport route and access it from any device."
 />
 </div>
 );
}

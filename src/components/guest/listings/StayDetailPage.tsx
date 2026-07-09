"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Waves,
  Sparkles,
  Compass,
  Coffee,
  UtensilsCrossed,
  Dumbbell,
  CheckCircle2,
  CalendarDays,
  X,
  Map,
  Wine,
  Fish,
  Binoculars,
  Bird,
  Footprints,
  Building2,
  ShowerHead,
  Car,
} from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuth } from "@/lib/store/authStore";
import { AuthGuardDialog } from "@/components/guest/auth/AuthGuardDialog";
import { ReviewSection } from "@/components/guest/reviews/ReviewSection";
import { cn } from "@/lib/utils";
import type { StayListing } from "@/types/listing";
import { mockListingReviews } from "@/lib/mock-listing-reviews";
import { mockStayHosts, type StayHost } from "@/lib/mock-profile-data";

const amenityIconMap: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-5 w-5 text-purple" />,
  Pool: <Waves className="h-5 w-5 text-purple" />,
  Spa: <Sparkles className="h-5 w-5 text-purple" />,
  "Guided Tours": <Map className="h-5 w-5 text-purple" />,
  Breakfast: <Coffee className="h-5 w-5 text-purple" />,
  "Meals Included": <UtensilsCrossed className="h-5 w-5 text-purple" />,
  Gym: <Dumbbell className="h-5 w-5 text-purple" />,
  Restaurant: <UtensilsCrossed className="h-5 w-5 text-purple" />,
  Bar: <Wine className="h-5 w-5 text-purple" />,
  "Water Sports": <Waves className="h-5 w-5 text-purple" />,
  Fishing: <Fish className="h-5 w-5 text-purple" />,
  "Wildlife Viewing": <Binoculars className="h-5 w-5 text-purple" />,
  "Boat Safaris": <Waves className="h-5 w-5 text-purple" />,
  "Bird Watching": <Bird className="h-5 w-5 text-purple" />,
  "Guided Walks": <Footprints className="h-5 w-5 text-purple" />,
  "City Views": <Building2 className="h-5 w-5 text-purple" />,
};

interface StayDetailPageProps {
  stay: StayListing & any;
  backHref?: string;
}

export function StayDetailPage({ stay, backHref = "/stays" }: StayDetailPageProps) {
  const router = useRouter();
  const images = stay.images && stay.images.length > 0 ? stay.images : [stay.image, stay.image, stay.image, stay.image, stay.image];
  const host: StayHost | undefined = mockStayHosts[stay.id] || mockStayHosts["1"];
  const hostName = host?.name || "The Chisanga Family";
  
  const [activeImg, setActiveImg] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const { isAuthenticated } = useAuth();
  const { isSaved, addItem, removeItem } = useWishlistStore();
  const isFavorited = isSaved(stay.id);

  const reviews = mockListingReviews[stay.id] || [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : stay.rating || 4.8;
  const reviewCount = reviews.length || stay.reviews || 134;

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeItem(stay.id);
      toast.success(`Removed from collections`);
    } else {
      addItem(stay);
      toast.success(`Saved to collections`, {
        icon: <Heart className="h-4 w-4 fill-purple text-purple" />,
      });
    }
  };

  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  const priceDisplay = (stay.baseRateNgwee || stay.pricePerNight || (stay.price ? stay.price * 100 : 55000)) / 100;
  const price = `K${priceDisplay}`;
  const totalDisplay = `K${priceDisplay * 3}`; // 3 nights mock

  const title = stay.title || stay.name || "Chisanga's Lakeside Lodge";
  const locationString = typeof stay.location === "object"
    ? `${stay.location.city}, ${stay.location.province}`
    : (stay.location || "Livingstone, Zambia");
  const type = stay.propertyType || stay.type || "Guest House";

  return (
    <div className="bg-white-warm text-black font-sans min-h-screen">
      <main className="max-w-[1100px] mx-auto px-4 pt-4 pb-28 lg:pb-8">
        
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center text-xs text-black-faint mb-4">
          <Link href="/" className="hover:text-purple transition-colors">Home</Link> <span className="mx-1.5 text-black-muted/50">›</span>
          <Link href="/explore" className="hover:text-purple transition-colors">Explore</Link> <span className="mx-1.5 text-black-muted/50">›</span>
          <Link href="/zambia" className="hover:text-purple transition-colors">Zambia</Link> <span className="mx-1.5 text-black-muted/50">›</span>
          <Link href={backHref} className="hover:text-purple transition-colors">{type}s</Link> <span className="mx-1.5 text-black-muted/50">›</span>
          <span className="text-black font-medium">{title}</span>
        </nav>

        {/* Hero Gallery */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-auto md:h-[450px] mb-6 group">
          {/* Main Large Image */}
          <div className="md:col-span-2 md:row-span-2 h-64 md:h-full relative group/main">
            <div className="w-full h-full cursor-pointer" onClick={() => setShowAllPhotos(true)}>
              <img src={images[activeImg]} className="w-full h-full object-cover hover:opacity-90 transition-opacity" alt={title} />
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImg(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm text-black flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-100 md:opacity-0 md:group-hover/main:opacity-100 z-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImg(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm text-black flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-100 md:opacity-0 md:group-hover/main:opacity-100 z-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          {/* 4 Small Images */}
          {images.slice(1, 5).map((img: string, idx: number) => (
            <div key={idx} className="hidden md:block h-[222px] relative cursor-pointer" onClick={() => { setActiveImg(idx + 1); setShowAllPhotos(true); }}>
              <img src={img} className="w-full h-full object-cover hover:opacity-90 transition-opacity" alt={`${title} ${idx + 2}`} />
            </div>
          ))}
          
          <button 
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-2 hover:bg-white transition-colors text-black"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {images.length} photos
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleToggleFavorite(); }}
            className="absolute top-4 right-4 md:right-auto md:left-4 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-md"
          >
            <Heart className={cn("h-4 w-4", isFavorited ? "fill-purple text-purple" : "text-black")} />
          </button>
        </div>

        {/* Main Info + Booking Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          
          {/* LEFT COLUMN: Trust & Information */}
          <div className="space-y-6 divide-y divide-white-soft">
            
            {/* Title & Host Business */}
            <div className="pt-2">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-black">{title}</h1>
                  <p className="text-black-muted text-sm mt-1">{locationString}</p>
                  <div className="mt-1 text-sm text-black-soft font-medium flex flex-wrap items-center gap-y-2 gap-x-4">
                    <span className="flex items-center gap-1">
                      <span className="bg-gold text-white px-2 py-0.5 rounded text-xs font-bold">{avgRating.toFixed(1)}</span>
                      ({reviewCount} guest reviews)
                    </span>
                    <span className="text-purple font-semibold">Hosted by {hostName}</span>
                  </div>
                  <p className="text-xs text-purple mt-2 font-script text-lg">Premium feel. Budget-friendly price. A hidden gem for the curious explorer.</p>
                </div>
                <span className="text-[10px] bg-purple-muted text-purple px-3 py-1 rounded-full font-bold border border-purple-border hidden sm:block whitespace-nowrap">Locally Owned</span>
              </div>
            </div>

            {/* The Details */}
            <div className="pt-6">
              <h2 className="font-semibold text-lg text-black">About the {type.toLowerCase()}</h2>
              <p className="text-sm text-black-soft leading-relaxed mt-2 whitespace-pre-wrap">
                {stay.description || "Located just a 5-minute walk from the local market and 15 minutes from the falls, this lodge offers comfortable, clean rooms for the next generation of travelers. Enjoy warm Zambian hospitality, a homemade local breakfast every morning, and a relaxed communal garden perfect for making new friends after a day of exploring."}
              </p>
            </div>

            {/* Amenities */}
            <div className="pt-6">
              <h2 className="font-semibold text-lg text-black">What we offer our guests</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mt-3 text-sm text-black-soft">
                {stay.amenities?.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-3">
                    <span className="text-xl">{amenityIconMap[amenity] || <Sparkles className="h-5 w-5 text-purple" />}</span> {amenity}
                  </div>
                ))}
                {!stay.amenities && (
                  <>
                    <div className="flex items-center gap-3">
                      <Coffee className="h-5 w-5 text-purple shrink-0" /> Daily Complimentary Breakfast
                    </div>
                    <div className="flex items-center gap-3">
                      <Wifi className="h-5 w-5 text-purple shrink-0" /> Free High-Speed Wi-Fi
                    </div>
                    <div className="flex items-center gap-3">
                      <ShowerHead className="h-5 w-5 text-purple shrink-0" /> Hot Water & Private Bathrooms
                    </div>
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-purple shrink-0" /> Free Parking for Buses/Cars
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* House Rules */}
            <div className="pt-6">
              <h2 className="font-semibold text-lg text-black">Things to know</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 text-sm">
                <div>
                  <p className="font-semibold text-black">Check-in</p>
                  <p className="text-black-muted">{stay.checkInRules?.[0] || "2:00 PM - 10:00 PM"}</p>
                </div>
                <div>
                  <p className="font-semibold text-black">Check-out</p>
                  <p className="text-black-muted">{stay.checkOutRules?.[0] || "10:30 AM"}</p>
                </div>
                <div>
                  <p className="font-semibold text-black">Quiet hours</p>
                  <p className="text-black-muted">10:00 PM - 6:00 AM</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="pt-6">
              <h2 className="font-semibold text-lg text-black">Where you'll be</h2>
              <p className="text-sm text-black-soft leading-relaxed mt-2">
                Nestled in a quiet, safe residential neighborhood in {locationString.split(",")[0]}. You're a short walk from the town center and local spots. Exact location shared after booking.
              </p>
              <div className="w-full h-40 bg-white-soft rounded-xl mt-3 flex items-center justify-center border border-white-soft relative overflow-hidden">
                <iframe
                  title={`Map for ${title}`}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${(stay.lng ?? 28) - 0.05}%2C${(stay.lat ?? -15) - 0.05}%2C${(stay.lng ?? 28) + 0.05}%2C${(stay.lat ?? -15) + 0.05}&layer=mapnik&marker=${stay.lat ?? -15}%2C${stay.lng ?? 28}`}
                  style={{ border: 0, filter: "contrast(0.9) brightness(0.95)" }}
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
              <div className="mt-3 space-y-4">
                {reviews.slice(0, 2).map((rev: any, i: number) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-white-soft">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-black">{rev.userName}</span>
                      <span className="text-xs text-black-faint">{rev.date}</span>
                    </div>
                    <p className="text-sm text-black-soft mt-1">"{rev.comment}"</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="bg-white p-4 rounded-xl border border-white-soft">
                    <p className="text-sm text-black-soft mt-1">"Absolutely incredible value for money. The rooms were spotless and the hosts made us feel right at home."</p>
                  </div>
                )}
              </div>
            </div>

            {/* Meet the Host */}
            <div className="pt-6">
              <h2 className="font-semibold text-lg text-black">Meet the hosts</h2>
              <div className="flex items-center gap-4 mt-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shrink-0 shadow-sm"
                  style={{ backgroundColor: host?.avatarColor || "#7C3AED" }}
                >
                  {host?.avatarInitials || "HC"}
                </div>
                <div>
                  <p className="font-semibold text-sm text-black">{hostName}</p>
                  <p className="text-xs text-black-muted flex items-center gap-1">
                    <span className="bg-green-500 w-2 h-2 rounded-full inline-block"></span> Responds within {host?.responseTime || "20 minutes"}
                  </p>
                  <p className="text-xs text-black-muted">Pioneers of local guest house hospitality.</p>
                </div>
              </div>
              <p className="text-sm text-black-soft mt-3 italic">
                "{host?.bio || "Our goal is to show young travelers that you don't need a foreign platform to have a great escape. We keep our prices fair to welcome everyone, and reinvest everything back into our local community."}"
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: The Booking Card */}
          <div className="relative">
            <div className="bg-white border border-white-soft rounded-2xl p-6 shadow-lg sticky top-24">
              
              {/* Clear, Honest Pricing */}
              <div className="flex items-center justify-between border-b border-white-soft pb-4">
                <div>
                  <span className="text-2xl font-bold text-black">{price}</span> <span className="text-xs text-black-muted font-medium">/ night</span>
                </div>
                <div className="text-sm text-black-soft font-medium flex items-center gap-1">
                  <span className="bg-gold text-white px-1.5 py-0.5 rounded text-xs font-bold">{avgRating.toFixed(1)}</span> Exceptional
                </div>
              </div>
              
              {/* Scarcity Trigger */}
              <div className="mt-3 p-2 bg-purple-muted border border-purple-border rounded-lg flex items-center gap-2 text-purple text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-purple rounded-full inline-block animate-pulse shrink-0"></span>
                Room availability is limited this week. Book early to secure your spot.
              </div>
              
              <div className="py-4 space-y-3">
                {/* Date Picker Simulation */}
                <div className="grid grid-cols-2 gap-2 bg-white-warm rounded-lg p-2 border border-white-soft">
                  <div className="bg-white rounded-md p-2 shadow-sm border border-white-soft cursor-pointer hover:border-purple transition-colors">
                    <span className="text-[10px] text-black-faint block font-medium">CHECK-IN</span>
                    <span className="text-sm font-semibold text-black">Aug 15</span>
                  </div>
                  <div className="bg-white rounded-md p-2 shadow-sm border border-white-soft cursor-pointer hover:border-purple transition-colors">
                    <span className="text-[10px] text-black-faint block font-medium">CHECK-OUT</span>
                    <span className="text-sm font-semibold text-black">Aug 18</span>
                  </div>
                </div>
                
                {/* Guest Selector */}
                <div className="bg-white-warm rounded-lg p-3 border border-white-soft flex justify-between items-center cursor-pointer hover:border-purple transition-colors">
                  <div>
                    <span className="text-[10px] text-black-faint block font-medium">GUESTS</span>
                    <span className="text-sm font-semibold text-black">2 adults</span>
                  </div>
                  <button className="text-xs border border-white-soft rounded px-2 py-1 bg-white hover:bg-white-warm transition-colors text-black-soft">Edit</button>
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-white-soft space-y-1.5 text-sm">
                  <div className="flex justify-between text-black-soft">
                    <span>3 nights x {price}</span>
                    <span>{totalDisplay}</span>
                  </div>
                  <div className="flex justify-between text-black-soft">
                    <span>Daily breakfast included</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-black font-bold border-t border-white-soft pt-2 mt-1">
                    <span>Total (ZMW)</span>
                    <span>{totalDisplay}</span>
                  </div>
                  <p className="text-[10px] text-purple font-semibold text-center mt-1">No platform fees. 100% goes to the host!</p>
                </div>
              </div>
              
              <button 
                onClick={() => router.push(`/checkout/book?type=stay&id=${stay.id}`)}
                className="w-full bg-purple text-white rounded-xl py-3.5 font-semibold hover:bg-purple-hover transition-colors text-base shadow-md"
              >
                Book your room
              </button>
              
              {/* Cross-sell for local experiences */}
              <div className="mt-4 pt-4 border-t border-white-soft flex items-center justify-between">
                <span className="text-xs text-black-muted">Looking for adventure?</span>
                <Link href="/experiences" className="text-purple text-xs font-semibold hover:underline">Add a guided safari</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Places Section */}
        <section className="mt-16 pt-8 border-t border-white-soft">
          <h2 className="text-xl font-bold text-black mb-6">Similar places you might like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: "sim-1", name: "Riverside Retreat", location: locationString.split(",")[0], price: "K450", rating: 4.9, img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80" },
              { id: "sim-2", name: "Sunset Safari Lodge", location: locationString.split(",")[0], price: "K600", rating: 4.7, img: "https://images.unsplash.com/photo-1518602164578-cd0074062767?auto=format&fit=crop&w=600&q=80" },
              { id: "sim-3", name: "Zambezi Guest House", location: locationString.split(",")[0], price: "K350", rating: 4.5, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" },
            ].map((item) => (
              <Link href={`/stays/${item.id}`} key={item.id} className="group block">
                <div className="w-full h-48 rounded-xl bg-white-soft overflow-hidden mb-3 relative">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                    <Heart className="h-4 w-4 text-black hover:text-purple transition-colors" />
                  </button>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-purple transition-colors truncate">{item.name}</h3>
                    <p className="text-sm text-black-muted">{item.location}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-black shrink-0">
                    <span className="bg-gold text-white px-1.5 py-0.5 rounded text-[10px]">{item.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-black font-semibold mt-1">{item.price} <span className="font-normal text-black-faint">/ night</span></p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-white-soft p-4 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-black">{price}</span> <span className="text-xs text-black-muted">/ night</span>
          </div>
          <div className="text-xs text-black-muted flex items-center gap-1">
            <span className="text-purple font-bold">All-inclusive</span> · <span className="bg-gold text-white px-1 py-0.5 rounded text-[10px] font-bold">{avgRating.toFixed(1)}</span>
          </div>
        </div>
        <button 
          onClick={() => router.push(`/checkout/book?type=stay&id=${stay.id}`)}
          className="bg-purple text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-purple-hover transition-colors text-sm flex-1 ml-4 max-w-[140px]"
        >
          Book now
        </button>
      </div>

      {/* Full-screen photo lightbox */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-200" onClick={() => setShowAllPhotos(false)}>
          
          {/* Top Bar */}
          <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent pb-10">
            <span className="text-white font-medium text-sm px-2">
              {activeImg + 1} / {images.length}
            </span>
            <button 
              className="h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm" 
              onClick={(e) => { e.stopPropagation(); setShowAllPhotos(false); }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center relative w-full h-full">
            <button 
              className="absolute left-2 md:left-6 z-10 h-12 w-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-white/20 backdrop-blur-sm transition-colors" 
              onClick={(e) => { e.stopPropagation(); prevImg(); }}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <img 
              src={images[activeImg]} 
              alt={title} 
              className="w-full max-h-screen object-contain" 
              onClick={(e) => e.stopPropagation()} 
            />
            
            <button 
              className="absolute right-2 md:right-6 z-10 h-12 w-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-white/20 backdrop-blur-sm transition-colors" 
              onClick={(e) => { e.stopPropagation(); nextImg(); }}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}

      <AuthGuardDialog isOpen={showAuthDialog} onClose={() => setShowAuthDialog(false)} title="Save to your collections" description="Sign in to save this property and access it from any device." />
    </div>
  );
}

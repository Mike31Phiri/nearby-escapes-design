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
  Clock,
  MapPin,
  Star,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  CalendarDays,
  Compass,
  Utensils,
  Hotel,
  Car,
  Check,
  X,
  Plus,
  Minus,
  MessageSquare,
  Search,
  Loader2,
  ArrowRight,
} from "lucide-react";
import type { Package } from "@/lib/mock-data";
import { mockPackages } from "@/lib/mock-data";
import { mockListingReviews } from "@/lib/mock-listing-reviews";
import { useAuth } from "@/lib/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { AuthGuardDialog } from "@/components/guest/auth/AuthGuardDialog";
import { cn } from "@/lib/utils";

interface PackageDetailPageProps {
  packageItem: Package;
  backHref?: string;
}

const packageItineraries: Record<
  string,
  {
    day: number;
    title: string;
    highlights: string[];
    description: string;
    stay: string;
    meals: string;
  }[]
> = {
  p1: [
    {
      day: 1,
      title: "Arrival in Livingstone & Zambezi Sunset Cruise",
      highlights: [
        "Private Airport Transfer",
        "Zambezi River Sunset Cruise",
        "Hippo & Elephant Spotting",
      ],
      description:
        "Arrive at Harry Mwaanga Nkumbula International Airport (Livingstone) where your private driver awaits. Transfer to your luxury riverfront lodge along the banks of the Zambezi. In the late afternoon, board our classic wooden river cruiser for a peaceful 2-hour sunset cruise. Enjoy complimentary local Zambian craft beer, wine, and freshly prepared bush hors d'oeuvres while observing resident hippos and elephants coming to drink.",
      stay: "David Livingstone Safari Lodge & Spa (or similar)",
      meals: "Welcome Drinks & Gourmet Dinner",
    },
    {
      day: 2,
      title: "Victoria Falls Walking Tour & Flight of Angels Helicopter",
      highlights: ["Knife-Edge Bridge", "Cataract Viewpoints", "15-Minute Helicopter Tour"],
      description:
        "After a hearty breakfast overlooking the river, join our certified Zambian naturalist guide for an intimate walking tour of Victoria Falls (Mosi-oa-Tunya). Feel the mist on the Knife-Edge Bridge, visit Danger Point, and capture iconic rainbow photos. In the afternoon, take to the skies for the unforgettable 15-minute 'Flight of Angels' helicopter tour for dramatic panoramic views of the Batoka Basalt Gorges.",
      stay: "David Livingstone Safari Lodge & Spa",
      meals: "Full Breakfast & Sunset Dinner",
    },
    {
      day: 3,
      title: "Mukuni Cultural Village & Departure",
      highlights: ["Historic Village Tour", "Artisan Woodcarvers Market", "Scenic Farewell Brunch"],
      description:
        "Visit the historic Mukuni Village, home of the Toka-Leya people for over 700 years. Learn about local traditions, traditional herbal medicine, and browse handmade crafts directly from local artisans. Return for a farewell brunch before your private transfer back to the airport for your onward journey.",
      stay: "Departure Day",
      meals: "Full Breakfast & Farewell Brunch",
    },
  ],
  p2: [
    {
      day: 1,
      title: "Flight into Mfuwe & Night Safari Drive",
      highlights: ["Mfuwe Airport Transfer", "Luangwa River View", "Nocturnal Leopard Safari"],
      description:
        "Fly into Mfuwe Airport and take a scenic bush drive to your open-air safari camp nestled along the Luangwa River. Settle into your luxury safari tent with panoramic wildlife views. At 4:00 PM, embark on your first game drive in a custom 4x4 open vehicle, transitioning into a night safari using high-powered infrared spotlights to locate prowling leopards, hyenas, and civets.",
      stay: "Mfuwe River Lodge (Luxury Safari Suite)",
      meals: "Lunch, Sundowner Drinks & 3-Course Camp Dinner",
    },
    {
      day: 2,
      title: "Dawn Walking Safari & Lagoon Wildlife",
      highlights: ["Birthplace of Walking Safari", "Animal Spoor Tracking", "Birdwatching"],
      description:
        "South Luangwa is the birthplace of the African walking safari. Guided by an armed national parks scout and master tracker, walk along game trails at first light. Learn to track lion footprints, identify bird alarms, and witness giraffes and zebras on foot. Return for a relaxed midday siesta by the camp pool.",
      stay: "Mfuwe River Lodge",
      meals: "Early Coffee, Full Bush Brunch & Dinner",
    },
    {
      day: 3,
      title: "Remote Northern Sector Exploration",
      highlights: ["Lion Pride Tracking", "Wild Dog Territory", "Giant Mahogany Picnic"],
      description:
        "Spend the full day exploring the less-frequented northern dambos and oxbow lagoons. Encounter massive herds of Thornicroft's giraffes, Cookson's wildebeests, and elephant families. Enjoy a private hot picnic lunch beneath ancient mahogany trees surrounded by wild bird song.",
      stay: "Mfuwe River Lodge",
      meals: "All Meals & Bush Picnic Included",
    },
    {
      day: 4,
      title: "Pelican Lagoons & Sundowner at Hippo Pools",
      highlights: ["Pelican Lagoon", "Hippo Congregation", "Campfire Storytelling"],
      description:
        "Morning boat and vehicle safari exploring seasonal lagoons filled with pelicans, storks, and crowned cranes. Afternoon relaxation and complimentary foot massage at the lodge spa. End the day sipping classic Zambian gin & tonics as the African sun sets over a pod of 50+ hippos.",
      stay: "Mfuwe River Lodge",
      meals: "All Meals Included",
    },
    {
      day: 5,
      title: "Final Morning Safari & Farewell Mfuwe",
      highlights: ["Dawn Photography Drive", "Gift Shop & Tribal Textiles", "Airport Transfer"],
      description:
        "One last early morning game drive to catch predators returning from their night hunt. Visit the famous Tribal Textiles workshop to pick up hand-painted Zambian fabrics before your transfer to Mfuwe Airport.",
      stay: "Departure Day",
      meals: "Hearty Bush Breakfast",
    },
  ],
  p3: [
    {
      day: 1,
      title: "Arrival in Siavonga & Sunset Catamaran Cruise",
      highlights: ["Scenic Escarpment Drive", "Lake Kariba Sunset", "Fresh Tiger Fish Braai"],
      description:
        "Arrive on the sunny shores of Lake Kariba in Siavonga. Check in to your lakeside villa with infinity pool views. Board a luxury pontoon boat for a 2-hour sunset cruise as the sky turns brilliant hues of crimson and gold. Dine under the stars with freshly grilled Kariba tiger fish and local vegetables.",
      stay: "Lake Kariba Safari Resort",
      meals: "Welcome Drink & Lakeshore Dinner",
    },
    {
      day: 2,
      title: "Kariba Dam Wall Tour & Morning Boat Safari",
      highlights: ["Engineering Wonder of Kariba Dam", "Crocodile & Hippo Viewing", "Craft Market"],
      description:
        "Morning boat tour visiting quiet inlets and shoreline reserves to observe sunbathing crocodiles and birdlife. Later, take a guided tour of the massive Kariba Dam wall and learn about the folklore of the Nyami Nyami river spirit. Check out in the afternoon feeling completely refreshed.",
      stay: "Departure Day",
      meals: "Full Lakeside Breakfast",
    },
  ],
};

export function PackageDetailPage({ packageItem, backHref = "/packages" }: PackageDetailPageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isSaved, addItem, removeItem } = useWishlistStore();
  const isFavorited = isSaved(packageItem.id);

  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Booking options state
  const today = new Date().toISOString().split("T")[0];
  const [travelDate, setTravelDate] = useState("2026-07-18");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState<"standard" | "luxury">("standard");

  const totalGuests = adults + children;

  // Itinerary
  const itinerary = packageItineraries[packageItem.id] || packageItineraries.p1;

  // Image list
  const images = [
    packageItem.image ||
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
  ];

  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  // Reviews
  const reviews = mockListingReviews[packageItem.id] || [
    {
      id: "rev-1",
      author: "Chilufya M.",
      rating: 5,
      comment:
        "The all-inclusive package made everything so stress-free. Every transfer was on time, the lodge was pure paradise, and the helicopter flight was an experience I'll never forget.",
      date: "Feb 2026",
    },
    {
      id: "rev-2",
      author: "David & Sarah K.",
      rating: 5,
      comment:
        "Incredible value. Having all meals, safari drives, and park fees included meant we didn't have to worry about a single extra cost. 10/10 recommend.",
      date: "Jan 2026",
    },
    {
      id: "rev-3",
      author: "Tariro B.",
      rating: 4.8,
      comment:
        "Our guide was phenomenal! Very knowledgeable about wildlife and Zambian history. Loved the sunset cruise.",
      date: "Dec 2025",
    },
  ];

  // Pricing calculation
  const basePrice = packageItem.price;
  const roomUpgradeCost = roomType === "luxury" ? 250 : 0;
  const pricePerAdult = basePrice + roomUpgradeCost;
  const pricePerChild = Math.round(pricePerAdult * 0.5);
  const totalPackageCost = pricePerAdult * adults + pricePerChild * children;

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeItem(packageItem.id);
      toast.success("Removed from wishlist");
    } else {
      addItem({
        id: packageItem.id,
        name: packageItem.name,
        location: packageItem.location,
        image: packageItem.image,
        price: packageItem.price,
        rating: packageItem.rating,
        reviews: 48,
        type: "Package",
      });
      toast.success("Saved to your wishlist!", {
        icon: <Heart className="h-4 w-4 fill-purple text-purple" />,
      });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Package link copied to clipboard!");
    } else {
      toast.success("Sharing package: " + packageItem.name);
    }
  };

  const handleProceedToBook = () => {
    const params = new URLSearchParams({
      type: "experience",
      id: packageItem.id,
      date: travelDate,
      guests: String(totalGuests),
    });
    router.push(`/checkout/book?${params.toString()}`);
  };

  return (
    <div className="bg-[#fbfafc] text-black font-sans min-h-screen">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-28 lg:pb-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center text-xs text-neutral-500 mb-5">
          <Link href="/" className="hover:text-[#6b2bb8] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-neutral-300">/</span>
          <Link href="/packages" className="hover:text-[#6b2bb8] transition-colors">
            Holiday Packages
          </Link>
          <span className="mx-2 text-neutral-300">/</span>
          <span className="text-neutral-900 font-semibold truncate">{packageItem.name}</span>
        </nav>

        {/* Hero Gallery Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-2.5 rounded-3xl overflow-hidden h-[300px] md:h-[440px] mb-8 shadow-sm">
          {/* Main Large Image */}
          <div
            className="md:col-span-2 md:row-span-2 h-full relative cursor-pointer group"
            onClick={() => setShowAllPhotos(true)}
          >
            <img
              src={images[activeImg]}
              alt={packageItem.name}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-amber-50/95 text-amber-900 border border-amber-200/60 text-xs font-medium px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" /> All-Inclusive Package
              </span>
              <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                {packageItem.duration}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h1 className="text-2xl md:text-3xl font-semibold drop-shadow-sm leading-tight">
                {packageItem.name}
              </h1>
              <p className="text-xs md:text-sm text-white/90 flex items-center gap-1.5 mt-1 font-normal">
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                {packageItem.location}
              </p>
            </div>
          </div>

          {/* 3 Supporting Small Images */}
          {images.slice(1, 4).map((img, idx) => (
            <div
              key={idx}
              className="hidden md:block h-[215px] relative cursor-pointer group overflow-hidden"
              onClick={() => {
                setActiveImg(idx + 1);
                setShowAllPhotos(true);
              }}
            >
              <img
                src={img}
                alt={`${packageItem.name} photo ${idx + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
          ))}

          {/* View All Photos Button */}
          <button
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-white transition-all text-neutral-900 flex items-center gap-2"
          >
            <span>View all {images.length} photos</span>
          </button>

          {/* Quick Actions (Share & Wishlist) */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white text-neutral-800 transition-all"
              title="Share package"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white transition-all"
              title="Save to wishlist"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorited ? "fill-[#6b2bb8] text-[#6b2bb8]" : "text-neutral-800",
                )}
              />
            </button>
          </div>
        </div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          {/* LEFT COLUMN: Details & Itinerary */}
          <div className="space-y-8">
            {/* Highlights Banner */}
            <div className="bg-white rounded-3xl border border-black/[0.08] p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-black/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#6b2bb8]/10 flex items-center justify-center text-[#6b2bb8] shrink-0">
                    <Compass className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">Curated Safari Circuit</h2>
                    <p className="text-xs text-neutral-500">
                      Handcrafted by local Zambian adventure specialists
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 font-bold text-sm bg-[#ffca28]/20 text-neutral-900 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-[#ffca28] text-[#ffca28]" />
                    <span>{packageItem.rating.toFixed(1)}</span>
                  </div>
                  <button
                    onClick={() => setShowReviewsModal(true)}
                    className="text-xs font-semibold text-[#6b2bb8] hover:underline"
                  >
                    ({reviews.length} reviews)
                  </button>
                </div>
              </div>

              {/* Quick Perks Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs text-neutral-700">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#6b2bb8] shrink-0" />
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">
                      Duration
                    </div>
                    <div className="font-semibold text-neutral-900">{packageItem.duration}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Hotel className="h-4 w-4 text-[#6b2bb8] shrink-0" />
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">
                      Stay
                    </div>
                    <div className="font-semibold text-neutral-900">Luxury Lodges</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-[#6b2bb8] shrink-0" />
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">
                      Transfers
                    </div>
                    <div className="font-semibold text-neutral-900">Private 4x4 Included</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-[#6b2bb8] shrink-0" />
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">
                      Catering
                    </div>
                    <div className="font-semibold text-neutral-900">Full Board Included</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Day-by-Day Itinerary */}
            <div className="bg-white rounded-3xl border border-black/[0.08] p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">Day-by-Day Itinerary</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Carefully paced for optimal wildlife encounters and relaxation
                  </p>
                </div>
                <span className="text-xs font-bold text-[#6b2bb8] bg-[#6b2bb8]/10 px-3 py-1 rounded-full">
                  {itinerary.length} Days Planned
                </span>
              </div>

              <div className="relative pl-6 space-y-8 border-l-2 border-[#6b2bb8]/20 ml-3">
                {itinerary.map((item) => (
                  <div key={item.day} className="relative group">
                    {/* Numbered node */}
                    <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center ring-4 ring-white shadow-sm">
                      D{item.day}
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h4 className="font-bold text-base text-neutral-900">{item.title}</h4>
                      </div>

                      {/* Highlight tags */}
                      <div className="flex flex-wrap gap-1.5 py-1">
                        {item.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-semibold bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                        {item.description}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-4 text-[11px] font-medium text-neutral-500">
                        <span className="inline-flex items-center gap-1 text-[#6b2bb8]">
                          <Hotel className="h-3 w-3" /> {item.stay}
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <Utensils className="h-3 w-3" /> {item.meals}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="bg-white rounded-3xl border border-black/[0.08] p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-900 mb-5">
                What&apos;s Included &amp; Excluded
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Included */}
                <div className="space-y-3 bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/15">
                  <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> What is included
                  </div>
                  <ul className="space-y-2 text-xs text-emerald-900/90 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>All luxury lodge / camp accommodation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>All daily game drives, walking safaris &amp; river cruises</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Dedicated licensed local guide &amp; armed wildlife scout</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>All meals (Breakfast, lunch, dinners &amp; bush snacks)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Private roundtrip airport transfers &amp; park fees</span>
                    </li>
                  </ul>
                </div>

                {/* Not Included */}
                <div className="space-y-3 bg-red-500/5 p-5 rounded-2xl border border-red-500/15">
                  <div className="flex items-center gap-2 font-bold text-red-950 text-sm">
                    <XCircle className="h-4 w-4 text-red-600" /> Not included
                  </div>
                  <ul className="space-y-2 text-xs text-red-900/90 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <X className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>International airfare and Zambia tourist visa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Personal travel insurance (mandatory)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Premium vintage imported alcoholic spirits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Gratuities / tips for guide and lodge staff</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Guest Reviews Preview */}
            <div className="bg-white rounded-3xl border border-black/[0.08] p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">Verified Traveler Reviews</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Reviews from travelers who booked this package
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewsModal(true)}
                  className="text-xs font-bold text-[#6b2bb8] hover:underline"
                >
                  View all ({reviews.length})
                </button>
              </div>

              <div className="space-y-3.5">
                {reviews.slice(0, 2).map((r, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-neutral-50/70 border border-black/[0.04] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#6b2bb8]/10 text-[#6b2bb8] font-bold text-xs flex items-center justify-center">
                          {r.author.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900">{r.author}</div>
                          <div className="text-[10px] text-neutral-400">{r.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-neutral-800">
                        <Star className="h-3.5 w-3.5 fill-[#ffca28] text-[#ffca28]" />
                        <span>{r.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed italic">
                      &quot;{r.content}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Booking Sidebar */}
          <aside className="lg:sticky lg:top-20">
            <div className="bg-white rounded-3xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 md:p-7 space-y-5">
              <div className="flex items-baseline justify-between border-b border-black/[0.06] pb-4">
                <div>
                  <div className="text-2xl font-semibold text-neutral-900 tracking-tight">
                    K{packageItem.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-neutral-500 font-normal">
                    per person all-inclusive
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 font-medium text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">
                    <ShieldCheck className="h-3.5 w-3.5" /> Best Rate Guaranteed
                  </div>
                </div>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">Tour Start Date</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="date"
                      min={today}
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-300 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#6b2bb8]"
                    />
                  </div>
                </div>

                {/* Room Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">Accommodation Tier</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRoomType("standard")}
                      className={cn(
                        "p-2.5 rounded-xl border text-xs font-bold transition-all text-center",
                        roomType === "standard"
                          ? "border-[#6b2bb8] bg-[#6b2bb8]/5 text-neutral-900 shadow-sm"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-300",
                      )}
                    >
                      Standard Chalet
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoomType("luxury")}
                      className={cn(
                        "p-2.5 rounded-xl border text-xs font-bold transition-all text-center",
                        roomType === "luxury"
                          ? "border-[#6b2bb8] bg-[#6b2bb8]/5 text-neutral-900 shadow-sm"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-300",
                      )}
                    >
                      Luxury Suite (+K250)
                    </button>
                  </div>
                </div>

                {/* Travelers Stepper */}
                <div className="bg-neutral-50 p-3.5 rounded-xl border border-black/[0.05] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-neutral-900">Adults (12+)</div>
                      <div className="text-[10px] text-neutral-500">K{pricePerAdult} each</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        disabled={adults <= 1}
                        className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 disabled:opacity-30"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-sm">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-black/[0.06]" />

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-neutral-900">Children (Ages 3–11)</div>
                      <div className="text-[10px] text-neutral-500">50% off (K{pricePerChild})</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        disabled={children <= 0}
                        className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 disabled:opacity-30"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-sm">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-2 space-y-1.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>
                      Adults ({adults} × K{pricePerAdult})
                    </span>
                    <span className="font-bold text-neutral-900">
                      K{(pricePerAdult * adults).toLocaleString()}
                    </span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between">
                      <span>
                        Children ({children} × K{pricePerChild})
                      </span>
                      <span className="font-bold text-neutral-900">
                        K{(pricePerChild * children).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-black/[0.06] flex items-baseline justify-between font-bold text-base text-neutral-900">
                    <span>Total Cost</span>
                    <span>K{totalPackageCost.toLocaleString()}</span>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={handleProceedToBook}
                  className="w-full h-12 rounded-2xl bg-[#ffca28] hover:bg-[#f5be18] active:scale-[0.99] text-black font-bold text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Book Package <ArrowRight className="h-4 w-4" />
                </button>

                <p className="text-center text-[10px] text-neutral-400">
                  ⚡ Instant Confirmation • Free Cancellation up to 7 days prior
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Full-Screen Photo Lightbox Modal */}
      {showAllPhotos && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in"
          onClick={() => setShowAllPhotos(false)}
        >
          <div className="absolute top-0 inset-x-0 p-5 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
            <span className="text-white font-bold text-sm">
              {activeImg + 1} / {images.length} — {packageItem.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllPhotos(false);
              }}
              className="h-9 w-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative p-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImg();
              }}
              className="absolute left-4 z-10 h-12 w-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <img
              src={images[activeImg]}
              alt={packageItem.name}
              className="max-h-[85vh] max-w-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImg();
              }}
              className="absolute right-4 z-10 h-12 w-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* All Reviews Modal */}
      {showReviewsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowReviewsModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-black/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Guest Reviews</h3>
                <p className="text-xs text-neutral-500">
                  {reviews.length} verified reviews for {packageItem.name}
                </p>
              </div>
              <button
                onClick={() => setShowReviewsModal(false)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.05] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#6b2bb8]/10 text-[#6b2bb8] font-bold text-xs flex items-center justify-center">
                        {r.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">{r.author}</div>
                        <div className="text-[10px] text-neutral-400">{r.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-neutral-800">
                      <Star className="h-3.5 w-3.5 fill-[#ffca28] text-[#ffca28]" />
                      <span>{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">{r.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <AuthGuardDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        title="Save to your wishlist"
        description="Sign in to save this holiday package and access it from any device."
      />
    </div>
  );
}

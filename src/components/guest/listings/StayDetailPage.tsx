"use client";

import { useState, useMemo } from "react";
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
  Coffee,
  UtensilsCrossed,
  CheckCircle2,
  X,
  ShowerHead,
  Car,
  Bed,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Navigation,
  Star,
  Wind,
  Droplets,
  Laptop,
  Tv,
  Shirt,
  Sun,
  Flame,
  Eye,
  Anchor,
  ShieldCheck,
  Lock,
  HeartPulse,
  Bell,
  Key,
  Zap,
  Home,
} from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuth } from "@/lib/store/authStore";
import { AuthGuardDialog } from "@/components/guest/auth/AuthGuardDialog";
import { ReviewSection } from "@/components/guest/reviews/ReviewSection";
import { cn } from "@/lib/utils";
import type { StayListing } from "@/types/listing";
import { mockListingReviews } from "@/lib/mock-listing-reviews";
import { mockStayHosts, type StayHost } from "@/lib/mock-profile-data";
import { useAvailabilityStore } from "@/store/availabilityStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { inventoryCounts } from "@/lib/mock-inventory";
import { mockStays } from "@/lib/mock-data";
import {
  STAY_SUBTYPES,
  STAY_GUEST_FAVOURITES,
  STAY_STANDOUTS,
  STAY_SAFETY,
  StayAmenityItem,
} from "@/components/host/create/stay/stayConstants";

// Icon lookup for standard and host-created amenities
const ALL_STAY_AMENITY_SPECS: Record<string, { label: string; icon: React.ReactNode; category: "favourites" | "standouts" | "safety" }> = {
  // Guest favourites
  wifi: { label: "Fast Wi-Fi", icon: <Wifi className="h-4 w-4 text-purple" />, category: "favourites" },
  air_conditioning: { label: "Air Conditioning", icon: <Wind className="h-4 w-4 text-purple" />, category: "favourites" },
  kitchen: { label: "Kitchen", icon: <UtensilsCrossed className="h-4 w-4 text-purple" />, category: "favourites" },
  parking: { label: "Free Parking", icon: <Car className="h-4 w-4 text-purple" />, category: "favourites" },
  hot_water: { label: "Hot Water", icon: <Droplets className="h-4 w-4 text-purple" />, category: "favourites" },
  workspace: { label: "Dedicated Workspace", icon: <Laptop className="h-4 w-4 text-purple" />, category: "favourites" },
  tv: { label: "TV / DStv", icon: <Tv className="h-4 w-4 text-purple" />, category: "favourites" },
  swimming_pool: { label: "Swimming Pool", icon: <Waves className="h-4 w-4 text-purple" />, category: "favourites" },
  laundry: { label: "Laundry Service", icon: <Shirt className="h-4 w-4 text-purple" />, category: "favourites" },
  housekeeping: { label: "Daily Housekeeping", icon: <Sparkles className="h-4 w-4 text-purple" />, category: "favourites" },

  // Standouts
  solar_power: { label: "Solar Backup Power", icon: <Sun className="h-4 w-4 text-purple" />, category: "standouts" },
  borehole_water: { label: "Borehole Water", icon: <Droplets className="h-4 w-4 text-purple" />, category: "standouts" },
  private_pool: { label: "Private Pool", icon: <Waves className="h-4 w-4 text-purple" />, category: "standouts" },
  fire_pit: { label: "Fire Pit / Boma", icon: <Flame className="h-4 w-4 text-purple" />, category: "standouts" },
  viewing_deck: { label: "Wildlife Viewing Deck", icon: <Eye className="h-4 w-4 text-purple" />, category: "standouts" },
  braai_area: { label: "Braai / BBQ Grill", icon: <Flame className="h-4 w-4 text-purple" />, category: "standouts" },
  river_front: { label: "River / Lake Frontage", icon: <Anchor className="h-4 w-4 text-purple" />, category: "standouts" },
  private_chef: { label: "Private Chef Service", icon: <Coffee className="h-4 w-4 text-purple" />, category: "standouts" },
  patio_balcony: { label: "Patio / Balcony", icon: <Home className="h-4 w-4 text-purple" />, category: "standouts" },
  outdoor_shower: { label: "Outdoor Safari Shower", icon: <ShowerHead className="h-4 w-4 text-purple" />, category: "standouts" },

  // Safety
  security_guard: { label: "24/7 Security Guard", icon: <ShieldCheck className="h-4 w-4 text-purple" />, category: "safety" },
  electric_fence: { label: "Electric Perimeter Fence", icon: <Lock className="h-4 w-4 text-purple" />, category: "safety" },
  first_aid: { label: "First Aid Kit", icon: <HeartPulse className="h-4 w-4 text-purple" />, category: "safety" },
  fire_extinguisher: { label: "Fire Extinguisher", icon: <Flame className="h-4 w-4 text-purple" />, category: "safety" },
  smoke_detector: { label: "Smoke Detector", icon: <Bell className="h-4 w-4 text-purple" />, category: "safety" },
  safe_box: { label: "In-room Digital Safe", icon: <Key className="h-4 w-4 text-purple" />, category: "safety" },
  backup_lighting: { label: "Emergency LED Lights", icon: <Zap className="h-4 w-4 text-purple" />, category: "safety" },
};

interface StayDetailPageProps {
  stay: StayListing & any;
  backHref?: string;
}

export function StayDetailPage({ stay, backHref = "/stays" }: StayDetailPageProps) {
  const router = useRouter();
  const images =
    stay.images && stay.images.length > 0
      ? stay.images
      : [stay.image, stay.image, stay.image, stay.image, stay.image];
  const host: StayHost | undefined = mockStayHosts[stay.id] || mockStayHosts["1"];
  const hostName = host?.name || "The Chisanga Family";

  const [activeImg, setActiveImg] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showHostContactModal, setShowHostContactModal] = useState(false);
  const [hostQuestion, setHostQuestion] = useState("");
  const [hostQuestionSent, setHostQuestionSent] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Stay link copied to clipboard!");
    } else {
      toast.success("Link copied!");
    }
  };

  // Single Listing Room/Chalet Inventory
  const inventories = useInventoryStore((s) => s.inventories);
  const getInventory = useInventoryStore((s) => s.getInventory);
  const listingInventory = useMemo(
    () => getInventory(stay.id),
    [stay.id, inventories, getInventory],
  );
  const inventoryStats = useMemo(() => inventoryCounts(listingInventory), [listingInventory]);
  const availableRoomsCount = inventoryStats.available;
  const isSoldOut = availableRoomsCount === 0;

  // Availability state
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<
    "idle" | "available" | "unavailable" | "partial"
  >("idle");

  const { isDateBlocked } = useAvailabilityStore();

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, diff);
  }, [checkIn, checkOut]);

  const totalGuests = adults + children;

  // Single standard nightly price — room types inventory selector removed per instruction
  const nightlyRate = stay.price || (stay.baseRateNgwee ? stay.baseRateNgwee / 100 : 450);
  const priceDisplay = `K${nightlyRate.toLocaleString()}`;

  const handleProceedToBook = () => {
    if (isSoldOut) {
      toast.error("This property is currently sold out with 0 available units.");
      return;
    }
    const params = new URLSearchParams({ type: "stay", id: stay.id });
    const effIn = checkIn || tomorrow;
    const effOut = checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0];
    params.set("checkIn", effIn);
    params.set("checkOut", effOut);
    params.set("guests", String(totalGuests));
    params.set("price", String(nightlyRate));
    router.push(`/checkout/book?${params.toString()}`);
  };

  const { isAuthenticated } = useAuth();
  const { isSaved, addItem, removeItem } = useWishlistStore();
  const isFavorited = isSaved(stay.id);

  const reviews = mockListingReviews[stay.id] || [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : stay.rating || 4.8;
  const reviewCount = reviews.length || stay.reviews || 134;

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeItem(stay.id);
      toast.success("Removed from collections");
    } else {
      addItem(stay);
      toast.success("Saved to collections", {
        icon: <Heart className="h-4 w-4 fill-purple text-purple" />,
      });
    }
  };

  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  const title = stay.title || stay.name || "Chisanga's Lakeside Lodge";
  const locationString =
    typeof stay.location === "object"
      ? `${stay.location.city}, ${stay.location.province}`
      : stay.location || "Livingstone, Zambia";

  // Subtype tag for search/discovery
  const matchedSubtype = STAY_SUBTYPES.find(
    (s) =>
      s.id === stay.subtype ||
      s.id === stay.propertyType ||
      s.title.toLowerCase() === (stay.propertyType || "").toLowerCase(),
  );
  const subtypeLabel = matchedSubtype?.title || stay.propertyType || stay.type || "Stay";

  const descriptionText =
    stay.description ||
    "Located just a short walk from local spots and attractions, this property offers clean, comfortable rooms and warm Zambian hospitality. Enjoy peaceful surroundings, comfortable furnishings, and tranquil settings perfect for relaxing after exploring.";
  const isLongDescription = descriptionText.length > 220;

  // Compile full amenities list categorized
  const rawAmenitiesList: string[] = useMemo(() => {
    if (Array.isArray(stay.amenities) && stay.amenities.length > 0) return stay.amenities;
    if (stay.guestFavourites || stay.standoutAmenities || stay.safetyAmenities) {
      return [
        ...(stay.guestFavourites || []),
        ...(stay.standoutAmenities || []),
        ...(stay.safetyAmenities || []),
      ];
    }
    return [
      "Fast Wi-Fi",
      "Air Conditioning",
      "Free Parking",
      "Hot Water",
      "Swimming Pool",
      "Solar Backup Power",
      "24/7 Security Guard",
      "Fire Pit / Boma",
    ];
  }, [stay]);

  const parsedAmenities = useMemo(() => {
    const favourites: { label: string; icon: React.ReactNode }[] = [];
    const standouts: { label: string; icon: React.ReactNode }[] = [];
    const safety: { label: string; icon: React.ReactNode }[] = [];
    const other: { label: string; icon: React.ReactNode }[] = [];

    rawAmenitiesList.forEach((item) => {
      // Find matching key by ID or label
      const lower = item.toLowerCase().replace(/[\s/-]+/g, "_");
      const matchedKey = Object.keys(ALL_STAY_AMENITY_SPECS).find(
        (k) =>
          k === lower ||
          ALL_STAY_AMENITY_SPECS[k].label.toLowerCase() === item.toLowerCase() ||
          item.toLowerCase().includes(k.replace(/_/g, " ")),
      );

      if (matchedKey) {
        const spec = ALL_STAY_AMENITY_SPECS[matchedKey];
        if (spec.category === "favourites") favourites.push({ label: spec.label, icon: spec.icon });
        else if (spec.category === "standouts") standouts.push({ label: spec.label, icon: spec.icon });
        else safety.push({ label: spec.label, icon: spec.icon });
      } else {
        other.push({ label: item, icon: <Sparkles className="h-4 w-4 text-purple" /> });
      }
    });

    const allFlat = [...favourites, ...standouts, ...safety, ...other];
    return { favourites, standouts, safety, other, allFlat };
  }, [rawAmenitiesList]);

  // Coordinates
  const lat = typeof stay.lat === "number" ? stay.lat : -15.3875;
  const lng = typeof stay.lng === "number" ? stay.lng : 28.3228;

  return (
    <div className="bg-white-warm text-black font-sans min-h-screen">
      <main className="max-w-[1100px] mx-auto px-4 pt-4 pb-28 lg:pb-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center text-xs text-black-faint mb-4">
          <Link href="/" className="hover:text-purple transition-colors">
            Home
          </Link>{" "}
          <span className="mx-1.5 text-black-muted/50">›</span>
          <Link href="/explore" className="hover:text-purple transition-colors">
            Explore
          </Link>{" "}
          <span className="mx-1.5 text-black-muted/50">›</span>
          <Link href={backHref} className="hover:text-purple transition-colors">
            Stays
          </Link>{" "}
          <span className="mx-1.5 text-black-muted/50">›</span>
          <span className="text-black font-medium truncate max-w-xs">{title}</span>
        </nav>

        {/* Hero Gallery */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-auto md:h-[450px] mb-6 group">
          {/* Main Large Image */}
          <div className="md:col-span-2 md:row-span-2 h-64 md:h-full relative group/main">
            <div className="w-full h-full cursor-pointer" onClick={() => setShowAllPhotos(true)}>
              <img
                src={images[activeImg]}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                alt={title}
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImg();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm text-black flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-100 md:opacity-0 md:group-hover/main:opacity-100 z-10 cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImg();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm text-black flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-100 md:opacity-0 md:group-hover/main:opacity-100 z-10 cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* 4 Small Images */}
          {images.slice(1, 5).map((img: string, idx: number) => (
            <div
              key={idx}
              className="hidden md:block h-[222px] relative cursor-pointer"
              onClick={() => {
                setActiveImg(idx + 1);
                setShowAllPhotos(true);
              }}
            >
              <img
                src={img}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                alt={`${title} ${idx + 2}`}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-2 hover:bg-white transition-colors text-black cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {images.length} photos
          </button>

          <div className="absolute top-4 right-4 md:right-auto md:left-4 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite();
              }}
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer"
              title="Save stay"
            >
              <Heart
                className={cn("h-4 w-4", isFavorited ? "fill-purple text-purple" : "text-black")}
              />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white text-black transition-colors cursor-pointer"
              title="Share stay"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Info + Booking Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px] gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN: Trust & Information */}
          <div className="space-y-8 divide-y divide-neutral-200">
            {/* Header: Title, Location, Host */}
            <div className="pt-2">
              <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-neutral-900 leading-tight">
                {title}
              </h1>
              <p className="text-sm font-normal text-neutral-500 mt-1">{locationString}</p>

              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-600">
                <span className="flex items-center gap-1 font-semibold text-neutral-900">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-neutral-300">·</span>
                <button
                  type="button"
                  onClick={() => setShowReviewsModal(true)}
                  className="font-normal text-neutral-500 hover:text-neutral-900 underline transition-colors cursor-pointer"
                >
                  {reviewCount} reviews
                </button>
                <span className="text-neutral-300">·</span>
                <span className="font-normal text-neutral-500">
                  Hosted by <span className="font-medium text-neutral-800">{hostName}</span>
                </span>
              </div>

              {/* Mobile Quick-Book Card */}
              <div className="lg:hidden mt-5 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-3.5">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold text-neutral-900">
                      {priceDisplay}
                    </span>
                    <span className="text-xs font-normal text-neutral-500">/ night</span>
                  </div>
                  <span className="text-xs font-semibold text-purple bg-purple/10 px-2.5 py-1 rounded-full">
                    Instant Book
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                    <span className="text-[10px] font-semibold uppercase text-neutral-400 block mb-0.5">
                      Check-in
                    </span>
                    <input
                      type="date"
                      value={checkIn}
                      min={today}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        setAvailabilityResult("available");
                        if (checkOut && e.target.value >= checkOut) setCheckOut("");
                      }}
                      className="w-full bg-transparent text-xs font-semibold text-neutral-900 focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                    <span className="text-[10px] font-semibold uppercase text-neutral-400 block mb-0.5">
                      Check-out
                    </span>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || today}
                      onChange={(e) => {
                        setCheckOut(e.target.value);
                        setAvailabilityResult("available");
                      }}
                      className="w-full bg-transparent text-xs font-semibold text-neutral-900 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToBook}
                  className="w-full bg-purple hover:bg-purple-hover text-white rounded-xl py-3.5 font-bold text-sm sm:text-base transition-all shadow-md shadow-purple/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Reserve Stay</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* About the Stay (Truncated with Show More Modal) */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">About this place</h2>
              <p
                className={cn(
                  "text-sm font-normal text-neutral-600 leading-relaxed mt-2.5 whitespace-pre-wrap",
                  isLongDescription && "line-clamp-4",
                )}
              >
                {descriptionText}
              </p>
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() => setShowDescriptionModal(true)}
                  className="mt-2 text-xs font-semibold text-purple hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Show more</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Amenities Preview + Show All Modal */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 mt-3.5 text-sm font-normal text-neutral-700">
                {parsedAmenities.allFlat.slice(0, 8).map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-neutral-500 shrink-0">{amenity.icon}</span>
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>

              {parsedAmenities.allFlat.length > 8 && (
                <button
                  type="button"
                  onClick={() => setShowAmenitiesModal(true)}
                  className="mt-5 px-4 py-2 border border-neutral-300 hover:border-neutral-400 rounded-lg text-xs font-medium text-neutral-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  Show all {parsedAmenities.allFlat.length} amenities
                </button>
              )}
            </div>

            {/* Things to know / House Rules */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">Things to know</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 text-xs">
                <div>
                  <p className="font-medium text-neutral-800">Check-in</p>
                  <p className="text-neutral-500 font-normal mt-0.5">
                    {stay.checkInRules?.[0] || "2:00 PM - 10:00 PM"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Check-out</p>
                  <p className="text-neutral-500 font-normal mt-0.5">
                    {stay.checkOutRules?.[0] || "10:30 AM"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Quiet hours</p>
                  <p className="text-neutral-500 font-normal mt-0.5">10:00 PM - 6:00 AM</p>
                </div>
              </div>
            </div>

            {/* Host policies */}
            {(stay.customPolicies || stay.customCancellationPolicy) && (
              <div className="pt-8">
                <h2 className="text-lg font-semibold text-neutral-900">Host policies</h2>
                {stay.customCancellationPolicy && (
                  <div className="mt-3">
                    <p className="font-medium text-xs text-neutral-800">Cancellation</p>
                    <p className="text-xs font-normal text-neutral-600 leading-relaxed mt-0.5 whitespace-pre-wrap">
                      {stay.customCancellationPolicy}
                    </p>
                  </div>
                )}
                {stay.customPolicies && (
                  <div className={stay.customCancellationPolicy ? "mt-3.5" : "mt-3"}>
                    <p className="font-medium text-xs text-neutral-800">Good to know</p>
                    <p className="text-xs font-normal text-neutral-600 leading-relaxed mt-0.5 whitespace-pre-wrap">
                      {stay.customPolicies}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Where you'll be with Google Maps */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">Where you&apos;ll be</h2>
              <p className="text-xs font-normal text-neutral-500 leading-relaxed mt-1.5">
                {stay.address ? `${stay.address}, ` : ""}
                {locationString}. Pinpointed on Google Maps below.
              </p>

              <div className="w-full h-56 sm:h-72 bg-neutral-100 rounded-xl mt-3 overflow-hidden border border-neutral-200 relative shadow-2xs">
                <iframe
                  title={`Google Map for ${title}`}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${lat},${lng}&t=m&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-mono">
                  {lat.toFixed(4)}°, {lng.toFixed(4)}°
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-purple hover:underline inline-flex items-center gap-1.5"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewSection
              listingId={stay.id}
              listingName={title}
              listingType="Stay"
              reviews={reviews.map((r: any) => ({
                id: r.id,
                author: r.author || r.userName || "Guest",
                rating: r.rating || 5,
                content: r.content || r.comment || "",
                date: r.date || "Recent",
                authorLocation: r.authorLocation || "Verified Guest",
                avatar: r.avatar,
              }))}
              avgRating={avgRating}
              reviewCount={reviewCount}
              onViewAllReviews={() => setShowReviewsModal(true)}
            />

            {/* Meet the Host */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">Meet the host</h2>
              <div className="flex items-center gap-3.5 mt-3.5">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-medium text-white text-base shrink-0 shadow-sm"
                  style={{ backgroundColor: host?.avatarColor || "#7C3AED" }}
                >
                  {host?.avatarInitials || "HC"}
                </div>
                <div>
                  <p className="font-semibold text-sm text-neutral-900">{hostName}</p>
                  <p className="text-xs font-normal text-neutral-500 flex items-center gap-1.5 mt-0.5">
                    <span className="bg-emerald-500 w-1.5 h-1.5 rounded-full inline-block"></span>
                    Responds within {host?.responseTime || "20 minutes"}
                  </p>
                </div>
              </div>
              <p className="text-xs font-normal text-neutral-600 leading-relaxed mt-3 italic">
                &quot;
                {host?.bio ||
                  "Our goal is to show travelers that you don't need an overseas platform to have a great escape. We keep our prices honest and reinvest into our local community."}
                &quot;
              </p>
              <div className="mt-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setHostQuestionSent(false);
                    setShowHostContactModal(true);
                  }}
                  className="px-3.5 py-1.5 border border-neutral-300 hover:border-neutral-400 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-neutral-400" />
                  Contact host
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Streamlined Booking Card */}
          <div className="relative" id="booking-section">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm sticky top-24 space-y-4">
              {/* Clear Nightly Pricing */}
              <div className="flex items-baseline justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                    {priceDisplay}
                  </span>
                  <span className="text-xs font-normal text-neutral-500">/ night</span>
                </div>
                <div className="text-xs font-medium text-neutral-700 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{avgRating.toFixed(1)}</span>
                  <span className="text-neutral-400 font-normal">({reviewCount})</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Check-In Date */}
                <div>
                  <label className="text-[11px] font-medium text-neutral-500 block mb-1 uppercase tracking-wider">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      setAvailabilityResult("available");
                      if (checkOut && e.target.value >= checkOut) setCheckOut("");
                    }}
                    className="w-full bg-neutral-50 rounded-lg p-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50 cursor-pointer"
                  />
                </div>

                {/* Check-Out Date */}
                <div>
                  <label className="text-[11px] font-medium text-neutral-500 block mb-1 uppercase tracking-wider">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => {
                      setCheckOut(e.target.value);
                      setAvailabilityResult("available");
                    }}
                    className="w-full bg-neutral-50 rounded-lg p-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50 cursor-pointer"
                  />
                </div>

                {/* Guest Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 block mb-1 uppercase tracking-wider">
                      Adults
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full bg-neutral-50 rounded-lg p-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} adult{n !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 block mb-1 uppercase tracking-wider">
                      Children
                    </label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full bg-neutral-50 rounded-lg p-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50 cursor-pointer"
                    >
                      {[0, 1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} child{n !== 1 ? "ren" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Availability Status */}
                {availabilityResult === "available" && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200/60 rounded-lg flex items-center gap-1.5 text-emerald-800 text-[11px] font-normal">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <span>
                      {availableRoomsCount > 0 ? `${availableRoomsCount} units open` : "Space available"} ·{" "}
                      {nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "Select dates"}
                    </span>
                  </div>
                )}
                {isSoldOut && (
                  <div className="p-2 bg-rose-50 border border-rose-200/60 rounded-lg flex items-center gap-1.5 text-rose-800 text-[11px] font-normal">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                    <span>All units currently booked for this lodge.</span>
                  </div>
                )}

                {/* Price Breakdown */}
                {nights > 0 ? (
                  <div className="pt-3 border-t border-neutral-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-500 font-normal">
                      <span>
                        {nights} night{nights !== 1 ? "s" : ""} x K{nightlyRate.toLocaleString()}
                      </span>
                      <span className="text-neutral-900 font-medium">
                        K{(nightlyRate * nights).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-500 font-normal">
                      <span>Breakfast &amp; Wi-Fi</span>
                      <span className="text-emerald-700 font-medium">Included</span>
                    </div>
                    <div className="flex justify-between text-neutral-900 font-semibold border-t border-neutral-100 pt-2 text-sm">
                      <span>Total</span>
                      <span>K{(nightlyRate * nights).toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-normal text-center mt-1">
                      No surprise fees · Taxes included
                    </p>
                  </div>
                ) : (
                  <div className="pt-1 text-xs font-normal text-neutral-400 text-center">
                    Select dates to see total
                  </div>
                )}
              </div>

              {/* Main Booking Action Button */}
              <button
                type="button"
                onClick={handleProceedToBook}
                disabled={isSoldOut}
                className={cn(
                  "w-full rounded-xl py-3.5 sm:py-4 font-bold text-base transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] cursor-pointer",
                  isSoldOut
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    : "bg-purple hover:bg-purple-hover text-white shadow-md shadow-purple/25 hover:shadow-lg hover:shadow-purple/35",
                )}
              >
                <span>{isSoldOut ? "Sold Out (0 Rooms Available)" : "Reserve Stay"}</span>
                {!isSoldOut && <ArrowRight className="h-5 w-5" />}
              </button>

              {/* Cross-sell */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-normal">Need transport or tours?</span>
                <Link href="/experiences" className="text-purple font-medium hover:underline">
                  Explore activities →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Places Section */}
        <section className="mt-16 pt-8 border-t border-neutral-200">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Similar stays in {locationString.split(",")[0]}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">Explore popular alternative lodges</p>
            </div>
            <Link
              href="/stays"
              className="text-xs font-medium text-purple hover:underline inline-flex items-center gap-1"
            >
              See all stays →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockStays
              .filter((s) => s.id !== stay.id)
              .slice(0, 4)
              .map((item) => (
                <Link
                  key={item.id}
                  href={`/stays/${item.id}`}
                  className="group block bg-white rounded-xl overflow-hidden border border-neutral-200/80 p-2.5 hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-4/3 rounded-lg overflow-hidden mb-2.5 bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="font-medium text-sm text-neutral-900 group-hover:text-purple transition-colors truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-0.5 text-xs font-medium text-neutral-700 shrink-0">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs font-normal text-neutral-500 mt-0.5">{item.location}</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    K{item.price}{" "}
                    <span className="font-normal text-xs text-neutral-500">/ night</span>
                  </p>
                </Link>
              ))}
          </div>
        </section>
      </main>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-5 py-3.5 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-neutral-900">{priceDisplay}</span>{" "}
            <span className="text-xs font-medium text-neutral-500">/ night</span>
          </div>
          <div className="text-xs text-neutral-600 flex items-center gap-1 font-medium mt-0.5">
            <span className="text-purple font-semibold">{subtypeLabel}</span>
            {nights > 0 && (
              <>
                <span>·</span>
                <span className="text-neutral-500">
                  {nights} night{nights !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleProceedToBook}
          disabled={isSoldOut}
          className={cn(
            "px-7 py-3 rounded-xl font-bold text-sm ml-4 cursor-pointer transition-colors",
            isSoldOut
              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              : "bg-purple text-white shadow-md shadow-purple/25 hover:bg-purple-hover",
          )}
        >
          {isSoldOut ? "Sold out" : "Book now"}
        </button>
      </div>

      {/* Full-screen Photo Lightbox */}
      {showAllPhotos && (
        <div
          className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in"
          onClick={() => setShowAllPhotos(false)}
        >
          <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent pb-10">
            <span className="text-white font-medium text-sm px-2">
              {activeImg + 1} / {images.length}
            </span>
            <button
              type="button"
              className="h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllPhotos(false);
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative w-full h-full">
            <button
              type="button"
              className="absolute left-2 md:left-6 z-10 h-12 w-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-white/20 backdrop-blur-sm transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                prevImg();
              }}
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
              type="button"
              className="absolute right-2 md:right-6 z-10 h-12 w-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-white/20 backdrop-blur-sm transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                nextImg();
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}

      {/* Full Description Modal */}
      {showDescriptionModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowDescriptionModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-black/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">About this place</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{title}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDescriptionModal(false)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <p className="text-sm font-normal text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {descriptionText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Categorized All Amenities Modal */}
      {showAmenitiesModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowAmenitiesModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-black/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">What this stay offers</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {parsedAmenities.allFlat.length} amenities available for guests
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAmenitiesModal(false)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-800">
              {parsedAmenities.favourites.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3">
                    Guest Favourites
                  </h4>
                  <div className="space-y-2.5">
                    {parsedAmenities.favourites.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="shrink-0">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parsedAmenities.standouts.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3">
                    Standouts &amp; Surroundings
                  </h4>
                  <div className="space-y-2.5">
                    {parsedAmenities.standouts.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="shrink-0">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parsedAmenities.safety.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3">
                    Safety &amp; Security
                  </h4>
                  <div className="space-y-2.5">
                    {parsedAmenities.safety.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="shrink-0">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parsedAmenities.other.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3">
                    Additional Amenities
                  </h4>
                  <div className="space-y-2.5">
                    {parsedAmenities.other.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="shrink-0">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* All Reviews Modal */}
      {showReviewsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowReviewsModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-black/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">
                  {avgRating.toFixed(1)} ★ ({reviewCount} reviews)
                </h3>
                <p className="text-xs text-neutral-500">Verified guest reviews for {title}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewsModal(false)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {reviews.map((r: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-neutral-50 rounded-2xl space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-neutral-900">
                      {r.userName || r.author}
                    </span>
                    <span className="text-[10px] text-neutral-400">{r.date}</span>
                  </div>
                  <div className="text-[10px] text-amber-500 font-bold">★★★★★ 5.0</div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    &quot;{r.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Host Modal */}
      {showHostContactModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowHostContactModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.08]">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Message {hostName}</h3>
                <p className="text-xs text-neutral-500">Typical response time: within 20 mins</p>
              </div>
              <button
                type="button"
                onClick={() => setShowHostContactModal(false)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {hostQuestionSent ? (
              <div className="py-8 text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-neutral-900">Message Sent!</h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  {hostName} has received your inquiry and will reply to your registered email/phone.
                </p>
                <button
                  type="button"
                  onClick={() => setShowHostContactModal(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-purple text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">Quick question</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Is early check-in possible?",
                      "Can you arrange airport pickup?",
                      "Do you have vegan meal options?",
                    ].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setHostQuestion(q)}
                        className="text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700">Your message</label>
                  <textarea
                    rows={4}
                    value={hostQuestion}
                    onChange={(e) => setHostQuestion(e.target.value)}
                    placeholder="Hi! I have a question about booking this stay..."
                    className="w-full rounded-xl border border-neutral-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!hostQuestion.trim()) {
                      toast.error("Please type a message first");
                      return;
                    }
                    setHostQuestionSent(true);
                  }}
                  className="w-full py-3 bg-purple hover:bg-purple-hover text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Send Message
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <AuthGuardDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        title="Save to your collections"
        description="Sign in to save this property and access it from any device."
      />
    </div>
  );
}

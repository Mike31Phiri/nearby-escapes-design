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
  Search,
  AlertCircle,
  Loader2,
  MessageSquare,
  Check,
  ArrowRight,
  Bed,
  Users,
  Navigation,
  Star,
} from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuth } from "@/lib/store/authStore";
import { AuthGuardDialog } from "@/components/guest/auth/AuthGuardDialog";
import { ReviewSection } from "@/components/guest/reviews/ReviewSection";
import { cn } from "@/lib/utils";
import type { StayListing, RoomType } from "@/types/listing";
import { mockListingReviews } from "@/lib/mock-listing-reviews";
import { mockStayHosts, type StayHost } from "@/lib/mock-profile-data";
import { useAvailabilityStore } from "@/store/availabilityStore";
import { mockStays } from "@/lib/mock-data";

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

  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (nights <= 0) {
      toast.error("Check-out must be after check-in");
      return;
    }
    setCheckingAvailability(true);
    // Simulate API delay
    setTimeout(() => {
      const stayId = stay.id;
      let hasBlocked = false;
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        if (isDateBlocked(stayId, dateStr)) {
          hasBlocked = true;
          break;
        }
      }
      setAvailabilityResult(hasBlocked ? "unavailable" : "available");
      setCheckingAvailability(false);
    }, 800);
  };

  const baseNightZMW = stay.price || (stay.baseRateNgwee ? stay.baseRateNgwee / 100 : 450);

  const availableRoomTypes: RoomType[] = useMemo(() => {
    if (stay.roomTypes && stay.roomTypes.length > 0) {
      return stay.roomTypes;
    }
    return [
      {
        id: "rt-std",
        name: "Standard Double Room",
        count: 4,
        maxGuests: 2,
        bedrooms: 1,
        beds: [{ type: "Queen", count: 1 }],
        pricePerNightNgwee: baseNightZMW * 100,
      },
      {
        id: "rt-deluxe",
        name: "Deluxe Safari Chalet",
        count: 2,
        maxGuests: 3,
        bedrooms: 1,
        beds: [
          { type: "King", count: 1 },
          { type: "Daybed", count: 1 },
        ],
        pricePerNightNgwee: Math.round(baseNightZMW * 1.35) * 100,
      },
      {
        id: "rt-family",
        name: "Executive Family Cottage",
        count: 1,
        maxGuests: 5,
        bedrooms: 2,
        beds: [
          { type: "King", count: 1 },
          { type: "Twin", count: 2 },
        ],
        pricePerNightNgwee: Math.round(baseNightZMW * 1.8) * 100,
      },
    ];
  }, [stay.roomTypes, baseNightZMW]);

  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    availableRoomTypes[0]?.id || "rt-std",
  );

  const selectedRoom = useMemo(() => {
    return availableRoomTypes.find((r) => r.id === selectedRoomId) || availableRoomTypes[0];
  }, [availableRoomTypes, selectedRoomId]);

  const currentRoomRate = selectedRoom ? selectedRoom.pricePerNightNgwee / 100 : baseNightZMW;
  const price = `K${currentRoomRate.toLocaleString()}`;

  const handleSelectRoom = (rt: RoomType) => {
    setSelectedRoomId(rt.id);
    if (!checkIn) {
      setCheckIn(tomorrow);
      setCheckOut(new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]);
    }
    setAvailabilityResult("available");
    toast.success(
      `Selected: ${rt.name} (K${(rt.pricePerNightNgwee / 100).toLocaleString()}/night)`,
    );
  };

  const handleProceedToBook = () => {
    const params = new URLSearchParams({ type: "stay", id: stay.id });
    const effIn = checkIn || tomorrow;
    const effOut = checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0];
    params.set("checkIn", effIn);
    params.set("checkOut", effOut);
    params.set("guests", String(totalGuests));
    if (selectedRoom) {
      params.set("roomType", selectedRoom.name);
      params.set("roomId", selectedRoom.id);
      params.set("price", String(currentRoomRate));
    }
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
  const type = stay.propertyType || stay.type || "Guest House";

  return (
    <div className="bg-white-warm text-black font-sans min-h-screen">
      <main className="max-w-[1100px] mx-auto px-4 pt-4 pb-28 lg:pb-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center text-xs text-black-faint mb-4">
          <Link href="/" className="hover:text-purple transition-colors">
            Home
          </Link>{" "}
          <span className="mx-1.5 text-black-muted/50">›</span>
          <Link href="/explore" className="hover:text-purple transition-colors">
            Explore
          </Link>{" "}
          <span className="mx-1.5 text-black-muted/50">›</span>
          <Link href="/" className="hover:text-purple transition-colors">
            Zambia
          </Link>{" "}
          <span className="mx-1.5 text-black-muted/50">›</span>
          <Link href={backHref} className="hover:text-purple transition-colors">
            {type}s
          </Link>{" "}
          <span className="mx-1.5 text-black-muted/50">›</span>
          <span className="text-black font-medium">{title}</span>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImg();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm text-black flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-100 md:opacity-0 md:group-hover/main:opacity-100 z-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImg();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm text-black flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-100 md:opacity-0 md:group-hover/main:opacity-100 z-10"
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
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-2 hover:bg-white transition-colors text-black"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            {images.length} photos
          </button>

          <div className="absolute top-4 right-4 md:right-auto md:left-4 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite();
              }}
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
              title="Save stay"
            >
              <Heart
                className={cn("h-4 w-4", isFavorited ? "fill-purple text-purple" : "text-black")}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white text-black transition-colors"
              title="Share stay"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Info + Booking Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* LEFT COLUMN: Trust & Information */}
          <div className="space-y-8 divide-y divide-neutral-200">
            {/* Title & Host Business */}
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
                  onClick={() => setShowReviewsModal(true)}
                  className="font-normal text-neutral-500 hover:text-neutral-900 underline transition-colors"
                >
                  {reviewCount} reviews
                </button>
                <span className="text-neutral-300">·</span>
                <span className="font-normal text-neutral-500">
                  Hosted by <span className="font-medium text-neutral-800">{hostName}</span>
                </span>
              </div>
            </div>

            {/* The Details */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">
                About the {type.toLowerCase()}
              </h2>
              <p className="text-sm font-normal text-neutral-600 leading-relaxed mt-2.5 whitespace-pre-wrap">
                {stay.description ||
                  "Located just a short walk from local spots and attractions, this property offers clean, comfortable rooms and warm Zambian hospitality. Enjoy complimentary breakfast every morning and tranquil surroundings perfect for relaxing after exploring."}
              </p>
            </div>

            {/* Amenities */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 mt-3.5 text-sm font-normal text-neutral-700">
                {stay.amenities?.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-3">
                    <span className="text-neutral-500">
                      {amenityIconMap[amenity] || <Sparkles className="h-4 w-4 text-purple" />}
                    </span>
                    <span>{amenity}</span>
                  </div>
                ))}
                {!stay.amenities && (
                  <>
                    <div className="flex items-center gap-3">
                      <Coffee className="h-4 w-4 text-purple shrink-0" />
                      <span>Complimentary Breakfast</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wifi className="h-4 w-4 text-purple shrink-0" />
                      <span>High-Speed Wi-Fi</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShowerHead className="h-4 w-4 text-purple shrink-0" />
                      <span>Hot Water & Private Bathroom</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Car className="h-4 w-4 text-purple shrink-0" />
                      <span>Free Secure Parking</span>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowAmenitiesModal(true)}
                className="mt-5 px-4 py-2 border border-neutral-300 hover:border-neutral-400 rounded-lg text-xs font-medium text-neutral-700 transition-colors inline-flex items-center gap-1.5"
              >
                Show all {stay.amenities?.length || 12} amenities
              </button>
            </div>

            {/* Rooms & Rates */}
            <div id="rooms-section" className="pt-8">
              <div className="flex items-baseline justify-between mb-1">
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  <Bed className="h-4 w-4 text-purple" />
                  Select your room
                </h2>
                <span className="text-xs font-normal text-neutral-500">
                  {availableRoomTypes.length} spaces available
                </span>
              </div>
              <p className="text-xs font-normal text-neutral-500 mb-4">
                Prices include daily breakfast, Wi-Fi, and all taxes.
              </p>

              <div className="space-y-3">
                {availableRoomTypes.map((rt, idx) => {
                  const isSelected = selectedRoomId === rt.id;
                  const roomPriceZMW = rt.pricePerNightNgwee / 100;
                  const isSoldOut = rt.count === 0;

                  return (
                    <div
                      key={rt.id}
                      className={cn(
                        "rounded-xl border p-4 sm:p-5 transition-all duration-200 bg-white",
                        isSelected
                          ? "border-purple ring-1 ring-purple/30 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300",
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-sm sm:text-base text-neutral-900">
                              {rt.name}
                            </h3>
                            {idx === 0 && (
                              <span className="text-[11px] font-medium bg-purple/10 text-purple px-2 py-0.5 rounded-full">
                                Popular
                              </span>
                            )}
                            {idx === 1 && (
                              <span className="text-[11px] font-medium bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
                                Best Value
                              </span>
                            )}
                            {isSelected && (
                              <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Check className="h-3 w-3" /> Selected
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2.5 text-xs font-normal text-neutral-500">
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3.5 w-3.5 text-neutral-400" />
                              Sleeps {rt.maxGuests}
                            </span>
                            <span className="text-neutral-300">·</span>
                            <span>
                              {rt.bedrooms} Bedroom{rt.bedrooms !== 1 ? "s" : ""}
                              {rt.beds && rt.beds.length > 0
                                ? ` (${rt.beds.map((b) => `${b.count} ${b.type}`).join(", ")})`
                                : ""}
                            </span>
                            <span className="text-neutral-300">·</span>
                            <span className="text-neutral-600">Ensuite bathroom</span>
                          </div>

                          <div className="pt-1 flex items-center gap-2">
                            {isSoldOut ? (
                              <span className="text-[11px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                Sold Out
                              </span>
                            ) : rt.count <= 2 ? (
                              <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                                Only {rt.count} left
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                {rt.count} available
                              </span>
                            )}
                            <span className="text-[11px] font-normal text-neutral-400">
                              · Free cancellation
                            </span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100 gap-2 shrink-0">
                          <div className="text-left sm:text-right">
                            <div className="text-base font-semibold text-neutral-900">
                              K{roomPriceZMW.toLocaleString()}
                              <span className="text-xs font-normal text-neutral-500"> / night</span>
                            </div>
                            {nights > 0 && (
                              <p className="text-[11px] font-normal text-neutral-400">
                                K{(roomPriceZMW * nights).toLocaleString()} for {nights} nights
                              </p>
                            )}
                          </div>

                          {isSelected ? (
                            <button
                              disabled
                              className="px-3.5 py-1.5 rounded-lg bg-purple text-white text-xs font-medium inline-flex items-center gap-1 cursor-default"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Selected
                            </button>
                          ) : isSoldOut ? (
                            <button
                              disabled
                              className="px-3.5 py-1.5 rounded-lg bg-neutral-100 text-neutral-400 text-xs font-medium cursor-not-allowed"
                            >
                              Sold Out
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSelectRoom(rt)}
                              className="px-3.5 py-1.5 rounded-lg bg-white border border-neutral-300 hover:border-purple hover:text-purple text-neutral-800 transition-colors text-xs font-medium inline-flex items-center gap-1"
                            >
                              Choose room
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* House Rules */}
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

            {/* Host's own policies */}
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

            {/* Location */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">Where you&apos;ll be</h2>
              <p className="text-xs font-normal text-neutral-500 leading-relaxed mt-1.5">
                Nestled in a safe neighborhood in {locationString.split(",")[0]}. Short walk from
                local spots. Exact location shared after reservation.
              </p>
              <div className="w-full h-44 bg-neutral-100 rounded-xl mt-3 flex items-center justify-center border border-neutral-200 relative overflow-hidden">
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
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-normal">
                  Coordinates: {stay.lat ?? -15.5}° S, {stay.lng ?? 29.1}° E
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title + " " + locationString)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-purple hover:underline inline-flex items-center gap-1"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Get directions
                </a>
              </div>
            </div>

            {/* Reviews Component */}
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
                  onClick={() => {
                    setHostQuestionSent(false);
                    setShowHostContactModal(true);
                  }}
                  className="px-3.5 py-1.5 border border-neutral-300 hover:border-neutral-400 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-neutral-400" />
                  Contact host
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Booking Card */}
          <div className="relative">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm sticky top-24 space-y-4">
              {/* Clear, Honest Pricing */}
              <div className="flex items-baseline justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-neutral-900">{price}</span>
                  <span className="text-xs font-normal text-neutral-500">/ night</span>
                </div>
                <div className="text-xs font-medium text-neutral-700 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{avgRating.toFixed(1)}</span>
                  <span className="text-neutral-400 font-normal">({reviewCount})</span>
                </div>
              </div>

              {/* Selected Room Indicator */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-purple">
                    Selected Space
                  </span>
                  <p className="text-xs font-semibold text-neutral-900 leading-tight mt-0.5">
                    {selectedRoom?.name}
                  </p>
                  <p className="text-[11px] font-normal text-neutral-500">
                    Up to {selectedRoom?.maxGuests} guests · {selectedRoom?.count} available
                  </p>
                </div>
                <a
                  href="#rooms-section"
                  className="text-xs font-medium text-purple hover:underline"
                >
                  Change
                </a>
              </div>

              {/* Guest Capacity Warning */}
              {totalGuests > (selectedRoom?.maxGuests || 2) && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-1.5 text-amber-800 text-[11px] font-normal leading-tight">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    {totalGuests} guests exceeds {selectedRoom?.name}&apos;s limit (
                    {selectedRoom?.maxGuests}). Choose a larger room below.
                  </span>
                </div>
              )}

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
                    className="w-full bg-neutral-50 rounded-lg p-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50"
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
                    className="w-full bg-neutral-50 rounded-lg p-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50"
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
                      className="w-full bg-neutral-50 rounded-lg p-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
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
                      className="w-full bg-neutral-50 rounded-lg p-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50"
                    >
                      {[0, 1, 2, 3, 4].map((n) => (
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
                      {selectedRoom?.name} available ·{" "}
                      {nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "Select dates"}
                    </span>
                  </div>
                )}

                {/* Price Breakdown */}
                {nights > 0 ? (
                  <div className="pt-3 border-t border-neutral-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-500 font-normal">
                      <span>
                        {nights} night{nights !== 1 ? "s" : ""} x K
                        {currentRoomRate.toLocaleString()}
                      </span>
                      <span className="text-neutral-900">
                        K{(currentRoomRate * nights).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-500 font-normal">
                      <span>Breakfast & Wi-Fi</span>
                      <span className="text-emerald-700 font-medium">Included</span>
                    </div>
                    <div className="flex justify-between text-neutral-900 font-semibold border-t border-neutral-100 pt-2 text-sm">
                      <span>Total</span>
                      <span>K{(currentRoomRate * nights).toLocaleString()}</span>
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
                onClick={handleProceedToBook}
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl py-3 font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Reserve {selectedRoom?.name || "Room"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Cross-sell */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-normal">Need transport or safari?</span>
                <Link href="/experiences" className="text-purple font-medium hover:underline">
                  Explore tours →
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
                Similar stays you might like
              </h2>
              <p className="text-xs font-normal text-neutral-500 mt-0.5">
                Explore more authentic Zambian lodges and guest houses
              </p>
            </div>
            <Link href="/stays" className="text-xs font-medium text-purple hover:underline">
              View all stays →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockStays
              .filter((s) => s.id !== stay.id)
              .slice(0, 3)
              .map((item) => (
                <Link href={`/stays/${item.id}`} key={item.id} className="group block">
                  <div className="w-full h-48 rounded-xl bg-neutral-100 overflow-hidden mb-2.5 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <Heart className="h-4 w-4 text-neutral-700 group-hover:text-purple transition-colors" />
                    </div>
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-white-soft p-4 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-black">{price}</span>{" "}
            <span className="text-xs text-black-muted">/ night</span>
          </div>
          <div className="text-xs text-black-muted flex items-center gap-1">
            <span className="text-purple font-bold">{selectedRoom?.name || "Available"}</span>
            {nights > 0 && (
              <>
                {" "}
                ·{" "}
                <span>
                  {nights} night{nights !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={handleProceedToBook}
          className="bg-purple text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-purple-hover transition-colors text-sm flex-1 ml-4 max-w-[140px]"
        >
          Book now
        </button>
      </div>

      {/* Full-screen photo lightbox */}
      {showAllPhotos && (
        <div
          className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in"
          onClick={() => setShowAllPhotos(false)}
        >
          {/* Top Bar */}
          <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent pb-10">
            <span className="text-white font-medium text-sm px-2">
              {activeImg + 1} / {images.length}
            </span>
            <button
              className="h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllPhotos(false);
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center relative w-full h-full">
            <button
              className="absolute left-2 md:left-6 z-10 h-12 w-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-white/20 backdrop-blur-sm transition-colors"
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
              className="absolute right-2 md:right-6 z-10 h-12 w-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-white/20 backdrop-blur-sm transition-colors"
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
                onClick={() => setShowReviewsModal(false)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-2 p-3.5 bg-neutral-50 rounded-2xl text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Cleanliness</span>
                  <span className="font-bold text-neutral-900">4.9 ★</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Accuracy</span>
                  <span className="font-bold text-neutral-900">4.8 ★</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Communication</span>
                  <span className="font-bold text-neutral-900">5.0 ★</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Location</span>
                  <span className="font-bold text-neutral-900">4.9 ★</span>
                </div>
              </div>

              {reviews.map((r: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.05] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
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

      {/* All Amenities Modal */}
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
              <h3 className="text-xl font-bold text-neutral-900">What this stay offers</h3>
              <button
                onClick={() => setShowAmenitiesModal(false)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-800">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3">
                  Bathroom &amp; Bedroom
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <ShowerHead className="h-4 w-4 text-purple" />
                    <span>Private bathroom with continuous hot water</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-purple" />
                    <span>Clean bed linens &amp; extra pillows</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-purple" />
                    <span>Towels, soap &amp; toilet paper provided</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3">
                  Internet &amp; Office
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-4 w-4 text-purple" />
                    <span>High-speed Wi-Fi available throughout property</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-purple" />
                    <span>Dedicated workspace in room</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3">
                  Food &amp; Dining
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <Coffee className="h-4 w-4 text-purple" />
                    <span>Complimentary daily hot breakfast</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <UtensilsCrossed className="h-4 w-4 text-purple" />
                    <span>On-site restaurant &amp; bar serving Zambian dishes</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-3">
                  Parking &amp; Facilities
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <Car className="h-4 w-4 text-purple" />
                    <span>Free secure parking on premises</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Waves className="h-4 w-4 text-purple" />
                    <span>Communal swimming pool &amp; gardens</span>
                  </div>
                </div>
              </div>
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
                onClick={() => setShowHostContactModal(false)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200"
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
                  {hostName} has received your inquiry and will reply to your registered
                  email/phone.
                </p>
                <button
                  onClick={() => setShowHostContactModal(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-purple text-white text-xs font-bold"
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
                        className="text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded-full font-medium transition-colors"
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
                  onClick={() => {
                    if (!hostQuestion.trim()) {
                      toast.error("Please type a message first");
                      return;
                    }
                    setHostQuestionSent(true);
                  }}
                  className="w-full py-3 bg-purple hover:bg-purple-hover text-white rounded-xl font-bold text-xs transition-colors"
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

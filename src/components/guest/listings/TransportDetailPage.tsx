"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Timer,
  Wifi,
  MapPin,
  Wind,
  Fuel,
  Droplets,
  Zap,
  Luggage,
  ShieldCheck,
  HeartPulse,
  Navigation,
  FileText,
  Ban,
  CheckCircle2,
  XCircle,
  X,
  Search,
  AlertCircle,
  Loader2,
  ArrowRight,
  Star,
  Sparkles,
  MessageSquare,
  CarFront,
  Bus,
  Plane,
  Key,
  Anchor,
} from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuth } from "@/lib/store/authStore";
import { AuthGuardDialog } from "@/components/guest/auth/AuthGuardDialog";
import { ReviewSection } from "@/components/guest/reviews/ReviewSection";
import { cn } from "@/lib/utils";
import type { Transport } from "@/lib/mock-data";
import { fetchTransports } from "@/lib/api/discovery";
import { mockTransport } from "@/lib/mock-data";
import { mockListingReviews } from "@/lib/mock-listing-reviews";
import { useInventoryStore } from "@/store/inventoryStore";
import { inventoryCounts } from "@/lib/mock-inventory";
import {
  TRANSPORT_SUBTYPES,
  TRANSPORT_FEATURES,
  TRANSPORT_WHAT_TO_CARRY,
  TRANSPORT_GUIDELINES,
} from "@/components/host/create/transport/transportConstants";

const ALL_TRANSPORT_FEATURE_SPECS: Record<string, { label: string; icon: React.ReactNode }> = {
  ac: { label: "Dual Cabin Air Conditioning", icon: <Wind className="h-4 w-4 text-purple" /> },
  pro_driver: { label: "Licensed Professional Chauffeur", icon: <Navigation className="h-4 w-4 text-purple" /> },
  fuel_included: { label: "Fuel Included in Rate", icon: <Fuel className="h-4 w-4 text-purple" /> },
  chilled_water: { label: "Complimentary Chilled Water", icon: <Droplets className="h-4 w-4 text-purple" /> },
  usb_charging: { label: "Fast USB & 12V Phone Charging", icon: <Zap className="h-4 w-4 text-purple" /> },
  wifi: { label: "High-Speed Mobile Onboard Wi-Fi", icon: <Wifi className="h-4 w-4 text-purple" /> },
  luggage_capacity: { label: "Luggage Trailer / Roof Rack", icon: <Luggage className="h-4 w-4 text-purple" /> },
  passenger_insurance: { label: "Full Passenger Liability Cover", icon: <ShieldCheck className="h-4 w-4 text-purple" /> },
  child_seat: { label: "Infant / Child Booster Seat", icon: <HeartPulse className="h-4 w-4 text-purple" /> },
};

interface TransportDetailPageProps {
  route: Transport & any;
  backHref?: string;
}

export function TransportDetailPage({
  route,
  backHref = "/transport",
}: TransportDetailPageProps) {
  const router = useRouter();

  const [activeImg, setActiveImg] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showHostContactModal, setShowHostContactModal] = useState(false);
  const [hostQuestion, setHostQuestion] = useState("");
  const [hostQuestionSent, setHostQuestionSent] = useState(false);

  // Gallery images matching standard 5-photo grid
  const images = useMemo(() => {
    if (route.images && route.images.length > 0) return route.images;
    if (route.image) return [route.image, route.image, route.image, route.image, route.image];
    return [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ];
  }, [route]);
  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Transport link copied to clipboard!");
    } else {
      toast.success("Link copied!");
    }
  };

  const [isBookingSectionVisible, setIsBookingSectionVisible] = useState(false);
  useEffect(() => {
    const el = document.getElementById("booking-section");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsBookingSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Single Listing Inventory & Fleet availability
  const inventories = useInventoryStore((s) => s.inventories);
  const getInventory = useInventoryStore((s) => s.getInventory);
  const listingInventory = useMemo(
    () => getInventory(route.id),
    [route.id, inventories, getInventory],
  );
  const inventoryStats = useMemo(() => inventoryCounts(listingInventory), [listingInventory]);
  const availableVehiclesCount = inventoryStats.available;
  const isSoldOut = availableVehiclesCount === 0;

  const [similarRoutes, setSimilarRoutes] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchTransports({ limit: 8 })
      .then((items) => {
        if (isMounted && items && items.length > 0) {
          setSimilarRoutes(items);
        }
      })
      .catch((err) => console.error("Failed to load similar routes:", err));
    return () => {
      isMounted = false;
    };
  }, []);

  // Availability & Booking state
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPickupTime, setSelectedPickupTime] = useState(
    route.departureTime || "08:30 AM",
  );
  const [passengers, setPassengers] = useState(1);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<
    "idle" | "available" | "unavailable"
  >("idle");

  const basePrice = Number(route.price) || 250;
  const rateUnit = route.rateUnit === "day" ? "day" : "trip";
  const priceDisplay = `K${basePrice.toLocaleString()}`;

  const handleCheckAvailability = () => {
    if (!selectedDate) {
      toast.error("Please pick a travel date");
      return;
    }
    setCheckingAvailability(true);
    setTimeout(() => {
      if (isSoldOut) {
        setAvailabilityResult("unavailable");
        setCheckingAvailability(false);
        toast.error("All vehicles of this type are currently booked out");
      } else {
        setAvailabilityResult("available");
        setCheckingAvailability(false);
        toast.success(`${availableVehiclesCount} vehicle(s) ready for this date!`);
      }
    }, 600);
  };

  const handleProceedToBook = () => {
    if (!selectedDate) {
      toast.error("Please pick a travel date first.");
      return;
    }
    if (availabilityResult !== "available") {
      toast.info("Please verify vehicle availability for your date first.");
      handleCheckAvailability();
      return;
    }
    if (isSoldOut) {
      toast.error("This transport listing is currently sold out (0 available in fleet).");
      return;
    }
    const params = new URLSearchParams({ type: "transport", id: route.id });
    params.set("date", selectedDate);
    if (selectedPickupTime) params.set("pickupTime", selectedPickupTime);
    params.set("guests", String(passengers));
    params.set("price", String(basePrice));
    router.push(`/checkout/book?${params.toString()}`);
  };

  const { isAuthenticated } = useAuth();
  const { isSaved, addItem, removeItem } = useWishlistStore();
  const isFavorited = isSaved(route.id);

  const reviews = mockListingReviews[route.id] || [];
  const avgRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 4.8;
  const reviewCount = reviews.length || 98;

  const handleToggleFavorite = async () => {
    try {
      if (isFavorited) {
        await removeItem(route.id);
        toast.success("Removed from collections");
      } else {
        await addItem({
          id: route.id,
          name: route.name || `${route.from} to ${route.to} Transport`,
          image: route.image || images[0],
          price: basePrice,
          location: route.from || "Zambia",
          rating: avgRating,
          reviews: reviewCount,
          type: "Transport",
        });
        toast.success("Saved to collections", {
          icon: <Heart className="h-4 w-4 fill-purple text-purple" />,
        });
      }
    } catch {
      toast.error("Could not update saved collection. Please try again.");
    }
  };

  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  const title =
    route.title ||
    route.name ||
    (route.from && route.to ? `${route.from} to ${route.to} Express` : "Zambia Chauffeur & Transfer");
  const hostName = route.operator || route.hostName || "Professional Transport Partner";
  const locationString =
    route.location || (route.from ? `${route.from} (Depot), Zambia` : "Lusaka, Zambia");

  // Subtype tag for search/discovery
  const matchedSubtype = TRANSPORT_SUBTYPES.find(
    (s) =>
      s.id === route.subtype ||
      s.id === route.vehicleType ||
      s.id === route.serviceType ||
      s.title.toLowerCase().includes((route.type || "").toLowerCase()),
  );
  const subtypeLabel = matchedSubtype?.title || route.subtype || "Transport";

  const descriptionText =
    route.description ||
    `Operating with high reliability and comfort, ${hostName} provides scheduled and private passenger transport across Zambia. Features air conditioning, luggage storage, and licensed professional drivers with comprehensive passenger cover.`;
  const isLongDescription = descriptionText.length > 220;

  // Features, What to Carry, Guidelines parsing
  const vehicleFeaturesList: string[] = useMemo(() => {
    if (Array.isArray(route.features) && route.features.length > 0) return route.features;
    if (Array.isArray(route.vehicleFeatures) && route.vehicleFeatures.length > 0)
      return route.vehicleFeatures;
    return [
      "Dual Cabin Air Conditioning",
      "Licensed Professional Chauffeur",
      "Fuel Included in Rate",
      "Complimentary Chilled Water",
      "Fast USB & 12V Phone Charging",
      "Full Passenger Liability Cover",
    ];
  }, [route]);

  const whatToCarryList: string[] = useMemo(() => {
    if (Array.isArray(route.whatToCarry) && route.whatToCarry.length > 0) return route.whatToCarry;
    if (Array.isArray(route.whatToBring) && route.whatToBring.length > 0) return route.whatToBring;
    return [
      "Lead Passenger Passport or National ID",
      "Digital Booking Confirmation Voucher",
      "Personal Audio AUX / Charging Cable",
    ];
  }, [route]);

  const guidelinesList: string[] = useMemo(() => {
    if (Array.isArray(route.guidelines) && route.guidelines.length > 0) return route.guidelines;
    return [
      "Strictly No Smoking / Vaping inside vehicle",
      "No Open Alcoholic Beverages",
      "No Overloading beyond licensed seat capacity",
    ];
  }, [route]);

  const totalFeaturesCount =
    vehicleFeaturesList.length + whatToCarryList.length + guidelinesList.length;

  // Coordinates
  const lat = typeof route.lat === "number" ? route.lat : -15.3875;
  const lng = typeof route.lng === "number" ? route.lng : 28.3228;

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
            Transport
          </Link>{" "}
          <span className="mx-1.5 text-black-muted/50">›</span>
          <span className="text-black font-medium truncate max-w-xs">{title}</span>
        </nav>

        {/* Hero Gallery (Standard: 1 large + 4 small thumbnails on desktop) */}
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
              title="Save transport"
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
              title="Share transport"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Info + Booking Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px] gap-8 lg:gap-10">
          {/* LEFT COLUMN: Trust & Information */}
          <div className="space-y-8 divide-y divide-neutral-200">
            {/* Header: Title, Location, Operator */}
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
                  Operated by <span className="font-medium text-neutral-800">{hostName}</span>
                </span>
              </div>
            </div>

            {/* About this Transport (Truncated with Show More Modal) */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">About this transport</h2>
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

            {/* Vehicle Features & Guidelines (Preview + Show All Modal) */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">
                Vehicle features &amp; guidelines
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Onboard equipment, passenger recommendations, and safety rules
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 mt-4 text-sm font-normal text-neutral-700">
                {vehicleFeaturesList.slice(0, 6).map((feat, idx) => {
                  const lower = feat.toLowerCase().replace(/[\s/-]+/g, "_");
                  const matchedKey = Object.keys(ALL_TRANSPORT_FEATURE_SPECS).find(
                    (k) =>
                      k === lower ||
                      ALL_TRANSPORT_FEATURE_SPECS[k].label.toLowerCase() === feat.toLowerCase() ||
                      feat.toLowerCase().includes(k.replace(/_/g, " ")),
                  );
                  const icon = matchedKey ? (
                    ALL_TRANSPORT_FEATURE_SPECS[matchedKey].icon
                  ) : (
                    <CarFront className="h-4 w-4 text-purple" />
                  );

                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="shrink-0">{icon}</span>
                      <span>{feat}</span>
                    </div>
                  );
                })}
              </div>

              {totalFeaturesCount > 6 && (
                <button
                  type="button"
                  onClick={() => setShowFeaturesModal(true)}
                  className="mt-5 px-4 py-2 border border-neutral-300 hover:border-neutral-400 rounded-lg text-xs font-medium text-neutral-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  Show all {totalFeaturesCount} features &amp; guidelines
                </button>
              )}
            </div>

            {/* Service Highlights / Things to know */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">Things to know</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 text-xs">
                <div>
                  <p className="font-medium text-neutral-800">Rate basis</p>
                  <p className="text-neutral-500 font-normal mt-0.5 capitalize">
                    Charged {rateUnit === "day" ? "per calendar day" : "per one-way trip"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Luggage allowance</p>
                  <p className="text-neutral-500 font-normal mt-0.5">
                    Standard baggage + hand carry
                  </p>
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Cancellation</p>
                  <p className="text-neutral-500 font-normal mt-0.5">Free up to 24 hrs before</p>
                </div>
              </div>
            </div>

            {/* Depot & Pickup Location with Google Maps */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">Depot &amp; pickup location</h2>
              <p className="text-xs font-normal text-neutral-500 leading-relaxed mt-1.5">
                {route.address ? `${route.address}, ` : ""}
                {locationString}. Base depot and pickup point on Google Maps below.
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
              listingId={route.id}
              listingName={title}
              listingType="Transport"
              reviews={reviews.map((r: any) => ({
                id: r.id,
                author: r.author || r.userName || "Traveler",
                rating: r.rating || 5,
                content: r.content || r.comment || "",
                date: r.date || "Recent",
                authorLocation: r.authorLocation || "Verified Passenger",
                avatar: r.avatar,
              }))}
              avgRating={avgRating}
              reviewCount={reviewCount}
              onViewAllReviews={() => setShowReviewsModal(true)}
            />

            {/* Host/operator section removed per instruction */}
          </div>

          {/* RIGHT COLUMN: Streamlined Sticky Booking Card */}
          <div className="relative h-full" id="booking-section">
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-sm sticky top-20 space-y-3 max-h-[calc(100vh-5.5rem)] overflow-y-auto">
              {/* Clear Pricing Header */}
              <div className="flex items-baseline justify-between border-b border-neutral-100 pb-2.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-[26px] font-extrabold text-neutral-900 tracking-tight">
                    {priceDisplay}
                  </span>
                  <span className="text-xs font-normal text-neutral-500">/ {rateUnit}</span>
                </div>
                <div className="text-xs font-medium text-neutral-700 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{avgRating.toFixed(1)}</span>
                  <span className="text-neutral-400 font-normal">({reviewCount})</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Select Travel Date & Passengers Side-by-Side */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-neutral-500 block mb-1 uppercase tracking-wider">
                      Travel Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={today}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setAvailabilityResult("idle");
                      }}
                      className="w-full bg-neutral-50 rounded-lg py-1.5 px-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-neutral-500 block mb-1 uppercase tracking-wider">
                      Passengers
                    </label>
                    <select
                      value={passengers}
                      onChange={(e) => {
                        setPassengers(Number(e.target.value));
                        setAvailabilityResult("idle");
                      }}
                      className="w-full bg-neutral-50 rounded-lg py-1.5 px-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} passenger{n !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Departure / Pickup Time Slot */}
                <div>
                  <label className="text-[10px] font-semibold text-neutral-500 block mb-1 uppercase tracking-wider">
                    Departure / Pickup Time
                  </label>
                  <select
                    value={selectedPickupTime}
                    onChange={(e) => {
                      setSelectedPickupTime(e.target.value);
                      setAvailabilityResult("idle");
                    }}
                    className="w-full bg-neutral-50 rounded-lg py-1.5 px-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50 cursor-pointer"
                  >
                    <option value="07:00 AM">07:00 AM — Early Morning Departure</option>
                    <option value="08:30 AM">08:30 AM — Morning Departure</option>
                    <option value="11:00 AM">11:00 AM — Midday Departure</option>
                    <option value="14:00 PM">14:00 PM — Afternoon Departure</option>
                    <option value="16:30 PM">16:30 PM — Late Afternoon Departure</option>
                    <option value="Flexible">Flexible / On-Demand Timing</option>
                  </select>
                </div>

                {/* Availability status */}
                {availabilityResult === "available" && (
                  <div className="py-1 px-2.5 bg-emerald-50 border border-emerald-200/60 rounded-lg flex items-center gap-1.5 text-emerald-800 text-[11px] font-normal">
                    <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" />
                    <span>
                      {availableVehiclesCount} vehicle{availableVehiclesCount !== 1 ? "s" : ""} ready for dispatch on this date
                    </span>
                  </div>
                )}
                {availabilityResult === "unavailable" && (
                  <div className="py-1 px-2.5 bg-rose-50 border border-rose-200/60 rounded-lg flex items-center gap-1.5 text-rose-800 text-[11px] font-normal">
                    <AlertCircle className="h-3 w-3 shrink-0 text-rose-600" />
                    <span>No vehicles available for this date. Check other dates.</span>
                  </div>
                )}

                {/* Price Breakdown */}
                {selectedDate ? (
                  <div className="pt-2 border-t border-neutral-100 space-y-1 text-xs">
                    <div className="flex justify-between text-neutral-500 font-normal">
                      <span>Rate ({rateUnit})</span>
                      <span className="text-neutral-900 font-medium">
                        K{basePrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-500 font-normal">
                      <span>Passenger Cover &amp; Fuel</span>
                      <span className="text-emerald-700 font-medium">Included</span>
                    </div>
                    <div className="flex justify-between text-neutral-900 font-semibold border-t border-neutral-100 pt-1.5 text-sm">
                      <span>Total</span>
                      <span>K{basePrice.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-normal text-center">
                      Direct booking · Verified vehicle
                    </p>
                  </div>
                ) : (
                  <div className="pt-1 text-[11px] font-normal text-neutral-400 text-center">
                    Select a travel date to proceed
                  </div>
                )}
              </div>

              {/* Main Booking Action Button */}
              {!selectedDate ? (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-xl py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
                >
                  <span>Select Date to Check Availability</span>
                </button>
              ) : availabilityResult === "idle" ? (
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={checkingAvailability || isSoldOut}
                  className="w-full rounded-xl py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 bg-purple hover:bg-purple-hover text-white shadow-md shadow-purple/25 hover:shadow-lg hover:shadow-purple/35 cursor-pointer transform active:scale-[0.99]"
                >
                  {checkingAvailability ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Checking Vehicle Availability...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Check Availability</span>
                    </>
                  )}
                </button>
              ) : availabilityResult === "unavailable" || isSoldOut ? (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-xl py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 bg-neutral-200 text-neutral-400 cursor-not-allowed"
                >
                  <span>Sold Out on Selected Date</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleProceedToBook}
                  className="w-full rounded-xl py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 bg-purple hover:bg-purple-hover text-white shadow-md shadow-purple/25 hover:shadow-lg hover:shadow-purple/35 cursor-pointer transform active:scale-[0.99]"
                >
                  <span>Reserve Transport</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {/* Cross-sell */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500 font-normal">Need stays or tours?</span>
                <Link href="/stays" className="text-purple font-medium hover:underline">
                  Find stays →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Transport Section */}
        <section className="mt-16 pt-8 border-t border-neutral-200">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Similar transport options in Zambia
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">Explore popular connections and vehicles</p>
            </div>
            <Link
              href="/transport"
              className="text-xs font-medium text-purple hover:underline inline-flex items-center gap-1"
            >
              See all transport →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(similarRoutes.length > 0 ? similarRoutes : mockTransport)
              .filter((t) => t.id !== route.id)
              .slice(0, 4)
              .map((item) => {
                const img = item.images?.[0] || item.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=70";
                const fromCity = item.fromCity || item.from || "Lusaka";
                const toCity = item.toCity || item.to || "Livingstone";
                const operatorName = item.operator || "Express Transport";

                return (
                  <Link
                    key={item.id}
                    href={`/transport/${item.id}`}
                    className="group block bg-white rounded-xl overflow-hidden border border-neutral-200/80 p-2.5 hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-4/3 rounded-lg overflow-hidden mb-2.5 bg-neutral-100">
                      <img
                        src={img}
                        alt={`${fromCity} to ${toCity}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-medium text-sm text-neutral-900 group-hover:text-purple transition-colors truncate">
                        {fromCity} to {toCity}
                      </h3>
                      <div className="flex items-center gap-0.5 text-xs font-medium text-neutral-700 shrink-0">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>4.8</span>
                      </div>
                    </div>
                    <p className="text-xs font-normal text-neutral-500 mt-0.5">{operatorName}</p>
                    <p className="text-sm font-semibold text-neutral-900 mt-1">
                      K{item.price}{" "}
                      <span className="font-normal text-xs text-neutral-500">/ trip</span>
                    </p>
                  </Link>
                );
              })}
          </div>
        </section>
      </main>

      {/* MOBILE STICKY BOTTOM BAR (Solid white, hides when booking section is visible) */}
      <div
        className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-5 py-3.5 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 transition-all duration-300",
          isBookingSectionVisible ? "opacity-0 pointer-events-none translate-y-full" : "opacity-100 translate-y-0",
        )}
      >
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-neutral-900">{priceDisplay}</span>{" "}
            <span className="text-xs font-medium text-neutral-500">/ {rateUnit}</span>
          </div>
          <div className="text-xs text-neutral-600 flex items-center gap-1 font-medium mt-0.5">
            <span className="text-purple font-semibold">{subtypeLabel}</span>
            {selectedDate && (
              <>
                <span>·</span>
                <span className="text-neutral-500">{passengers} passengers</span>
              </>
            )}
          </div>
        </div>
        {availabilityResult === "available" ? (
          <button
            type="button"
            onClick={handleProceedToBook}
            className="px-7 py-3 rounded-xl font-bold text-sm ml-4 cursor-pointer transition-colors bg-purple text-white shadow-md shadow-purple/25 hover:bg-purple-hover flex items-center gap-1.5"
          >
            <span>Reserve</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (selectedDate) {
                handleCheckAvailability();
              } else {
                const el = document.getElementById("booking-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            disabled={isSoldOut}
            className={cn(
              "px-6 py-3 rounded-xl font-bold text-sm ml-4 cursor-pointer transition-colors flex items-center gap-1.5",
              isSoldOut
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : "bg-purple text-white shadow-md shadow-purple/25 hover:bg-purple-hover",
            )}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Check Availability</span>
          </button>
        )}
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
                <h3 className="text-xl font-bold text-neutral-900">About this transport</h3>
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

      {/* Full Features & Guidelines Modal */}
      {showFeaturesModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowFeaturesModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-black/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Features &amp; Guidelines</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{title}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFeaturesModal(false)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-800">
              {/* Vehicle Features */}
              {vehicleFeaturesList.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-purple mb-3 flex items-center gap-1.5">
                    <CarFront className="h-4 w-4 text-purple" />
                    <span>Vehicle Features &amp; Equipment</span>
                  </h4>
                  <div className="space-y-2.5">
                    {vehicleFeaturesList.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What to Bring / Carry */}
              {whatToCarryList.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-purple" />
                    <span>Passenger Requirements &amp; What to Carry</span>
                  </h4>
                  <div className="space-y-2.5">
                    {whatToCarryList.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Navigation className="h-4 w-4 text-purple shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guidelines & Safety Rules */}
              {guidelinesList.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-rose-700 mb-3 flex items-center gap-1.5">
                    <Ban className="h-4 w-4 text-rose-600" />
                    <span>Passenger Safety Guidelines &amp; Policies</span>
                  </h4>
                  <div className="space-y-2.5">
                    {guidelinesList.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-neutral-700">
                        <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                        <span>{rule}</span>
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
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">
                  <span className="text-purple">{avgRating.toFixed(1)} ★</span>{" "}
                  <span className="text-neutral-500 font-normal text-sm">({reviewCount} reviews)</span>
                </h3>
                <p className="text-xs text-neutral-500">Verified passenger reviews for {title}</p>
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

      {/* Contact Operator Modal */}
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
                  {hostName} has received your inquiry and will reply to your registered contact info.
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
                      "Can you pick up from our hotel?",
                      "Do you have a child booster seat?",
                      "Is extra luggage permitted?",
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
                    placeholder="Hi! I have a question about this vehicle or route..."
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
        description="Sign in to save this transport option and access it from any device."
      />
    </div>
  );
}

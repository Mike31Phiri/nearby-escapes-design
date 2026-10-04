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
  Compass,
  CheckCircle2,
  XCircle,
  X,
  Search,
  AlertCircle,
  Loader2,
  ArrowRight,
  Navigation,
  Star,
  Clock,
  Users,
  ShieldCheck,
  Sparkles,
  MapPin,
  Backpack,
  Ban,
  MessageSquare,
} from "lucide-react";
import { ReviewSection } from "@/components/guest/reviews/ReviewSection";
import { cn } from "@/lib/utils";
import type { Experience, Package } from "@/lib/mock-data";
import { mockExperiences, mockGems, mockPackages } from "@/lib/mock-data";
import { mockListingReviews } from "@/lib/mock-listing-reviews";
import { useInventoryStore } from "@/store/inventoryStore";
import { inventoryCounts } from "@/lib/mock-inventory";
import { useAuth } from "@/lib/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { AuthGuardDialog } from "@/components/guest/auth/AuthGuardDialog";
import {
  EXPERIENCE_SUBTYPES,
  EXPERIENCE_WHATS_INCLUDED,
  EXPERIENCE_WHAT_TO_BRING,
  EXPERIENCE_WHAT_NOT_TO_BRING,
} from "@/components/host/create/experience/experienceConstants";

// Rich fallback descriptions if not provided in listing
const richDescriptions: Record<string, string> = {
  e1: "Witness the sheer scale and raw power of the Victoria Falls from above in a thrilling helicopter flight! Known locally as 'Mosi-oa-Tunya' (The Smoke That Thunders), you will soar directly over the falls, the Zambezi River, and the surrounding national park. Marvel at the dramatic, deep basalt gorges and capture once-in-a-lifetime aerial photographs from custom panoramic view windows. A professional pilot provides complete narration throughout the flight.",
  e2: "Step off the safari vehicle and immerse yourself directly in the African wilderness. South Luangwa is widely celebrated as the birthplace of the walking safari. Accompanied by a highly trained, armed wildlife scout and an expert naturalist guide, you will track animal footprints, learn about medicinal bush plants, and experience direct, thrilling close encounters with giraffes, elephants, and abundant birdlife in their natural habitat.",
  e3: "Plunge into the pristine, crystal-clear turquoise waters of Lake Tanganyika—the longest freshwater lake in the world! Home to over 250 species of vibrant cichlid fish found nowhere else on earth, this snorkeling safari offers unmatched aquatic viewing. Relax on secluded sandy beaches, swim alongside colorful schools of fish, and enjoy a freshly prepared lakeside lunch on the shore.",
  e4: "Embark on an unforgettable game drive through Kafue National Park, Zambia's oldest and largest national park. Traverse diverse habitats, from riverine forests and marshlands to open dambos. Our professional tracking guide will lead you in search of lions, leopards, wild dogs, cheetahs, and massive herds of buffalo. Enjoy a classic African sundowner cocktail drink as the sun sets over the Kafue River.",
};

interface ExperienceDetailPageProps {
  item: Experience | Package | any;
  backHref?: string;
}

export function ExperienceDetailPage({
  item,
  backHref = "/experiences",
}: ExperienceDetailPageProps) {
  const router = useRouter();

  const [activeImg, setActiveImg] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showInclusionsModal, setShowInclusionsModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showHostContactModal, setShowHostContactModal] = useState(false);
  const [hostQuestion, setHostQuestion] = useState("");
  const [hostQuestionSent, setHostQuestionSent] = useState(false);

  const images = useMemo(() => {
    if (item.images && item.images.length > 0) return item.images;
    if (item.image) return [item.image, item.image, item.image, item.image, item.image];
    return [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200",
    ];
  }, [item]);
  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Experience link copied to clipboard!");
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

  // Single Listing Time Slots & Inventory
  const inventories = useInventoryStore((s) => s.inventories);
  const getInventory = useInventoryStore((s) => s.getInventory);
  const listingInventory = useMemo(
    () => getInventory(item.id),
    [item.id, inventories, getInventory],
  );
  const inventoryStats = useMemo(() => inventoryCounts(listingInventory), [listingInventory]);
  const availableSlotsCount = inventoryStats.available;
  const isSoldOut = availableSlotsCount === 0;

  // Time Slots
  const timeSlots = useMemo(() => listingInventory.units, [listingInventory]);
  const defaultSlot = useMemo(() => {
    const firstAvail = timeSlots.find((u) => u.status === "available");
    return firstAvail?.timeSlot || timeSlots[0]?.timeSlot || "08:00 AM";
  }, [timeSlots]);
  const [selectedSlot, setSelectedSlot] = useState(defaultSlot);

  // Availability & Booking state
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<
    "idle" | "available" | "unavailable"
  >("idle");

  const totalGuests = adults + children;
  const pricePerPerson = Number(item.price) || 850;
  const priceDisplay = `K${pricePerPerson.toLocaleString()}`;

  const handleCheckAvailability = () => {
    if (!selectedDate) {
      toast.error("Please pick a date for your adventure");
      return;
    }
    setCheckingAvailability(true);
    setTimeout(() => {
      if (isSoldOut) {
        setAvailabilityResult("unavailable");
        setCheckingAvailability(false);
        toast.error("All time slots are booked for this date");
      } else {
        setAvailabilityResult("available");
        setCheckingAvailability(false);
        toast.success(`${availableSlotsCount} time slot(s) open for this date!`);
      }
    }, 600);
  };

  const handleProceedToBook = () => {
    if (!selectedDate) {
      toast.error("Please select a date for your experience first.");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please pick a time slot for this experience.");
      return;
    }
    if (availabilityResult !== "available") {
      toast.info("Checking availability for your selected date and slot...");
      handleCheckAvailability();
      return;
    }
    if (isSoldOut) {
      toast.error("This experience has no open time slots right now.");
      return;
    }
    const params = new URLSearchParams({ type: "experience", id: item.id });
    params.set("date", selectedDate);
    params.set("slot", selectedSlot);
    params.set("guests", String(totalGuests));
    params.set("price", String(pricePerPerson));
    router.push(`/checkout/book?${params.toString()}`);
  };

  const { isAuthenticated } = useAuth();
  const { isSaved, addItem, removeItem } = useWishlistStore();
  const isFavorited = isSaved(item.id);

  const reviews = mockListingReviews[item.id] || [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : item.rating || 4.9;
  const reviewCount = reviews.length || item.reviews || 84;

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeItem(item.id);
      toast.success("Removed from collections");
    } else {
      addItem({
        id: item.id,
        name: item.name,
        image: item.image || images[0],
        price: pricePerPerson,
        location: item.location || "Zambia",
        rating: avgRating,
        reviews: reviewCount,
        type: "Experience",
      });
      toast.success("Saved to collections", {
        icon: <Heart className="h-4 w-4 fill-purple text-purple" />,
      });
    }
  };

  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

  const title = item.name || item.title || "Zambezi Wildlife & River Adventure";
  const locationString =
    typeof item.location === "object"
      ? `${item.location.city}, ${item.location.province}`
      : item.location || "Livingstone, Zambia";

  // Subtype tag for search/discovery
  const matchedSubtype = EXPERIENCE_SUBTYPES.find(
    (s) =>
      s.id === item.subtype ||
      s.id === item.category ||
      s.id === item.activityType ||
      s.title.toLowerCase().includes((item.category || "").toLowerCase()),
  );
  const subtypeLabel = matchedSubtype?.title || item.category || "Experience";

  const descriptionText =
    item.description ||
    richDescriptions[item.id] ||
    "Immerse yourself in this unforgettable guided Zambian experience. Accompanied by experienced guides and certified experts, enjoy unique perspectives of our wilderness, rich culture, and pristine natural landmarks.";
  const isLongDescription = descriptionText.length > 220;

  // Inclusions & Rules parsing
  const whatsIncludedList: string[] = useMemo(() => {
    if (Array.isArray(item.whatsIncluded) && item.whatsIncluded.length > 0) return item.whatsIncluded;
    if (Array.isArray(item.inclusions) && item.inclusions.length > 0) return item.inclusions;
    return [
      "National Park Entry & Conservation Fees",
      "Professional Certified Safari Guide",
      "Open 4x4 Safari Vehicle Transport",
      "Complimentary Chilled Water & Snacks",
    ];
  }, [item]);

  const whatToBringList: string[] = useMemo(() => {
    if (Array.isArray(item.whatToBring) && item.whatToBring.length > 0) return item.whatToBring;
    if (Array.isArray(item.whatToCarry) && item.whatToCarry.length > 0) return item.whatToCarry;
    return [
      "Valid ID or Passport for Gate Clearance",
      "Comfortable Closed Walking or Hiking Shoes",
      "Sunscreen, UV Sunglasses, and Safari Hat",
      "Camera or Smartphone with Extra Battery",
    ];
  }, [item]);

  const whatNotToBringList: string[] = useMemo(() => {
    if (Array.isArray(item.whatNotToBring) && item.whatNotToBring.length > 0) return item.whatNotToBring;
    return [
      "Drones (Prohibited in National Parks)",
      "Single-Use Plastic Bags",
      "Bright Red / Neon Colored Clothes",
      "Domestic Pets",
    ];
  }, [item]);

  const totalInclusionsCount =
    whatsIncludedList.length + whatToBringList.length + whatNotToBringList.length;

  // Coordinates
  const lat = typeof item.lat === "number" ? item.lat : -17.8419;
  const lng = typeof item.lng === "number" ? item.lng : 25.8543;

  const hostName = item.hostName || item.guideName || "Certified Safari Guide";

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
            Experiences
          </Link>{" "}
          <span className="mx-1.5 text-black-muted/50">›</span>
          <span className="text-black font-medium truncate max-w-xs">{title}</span>
        </nav>

        {/* Hero Gallery (Consistent Standard: 1 large + 4 thumbnails on desktop) */}
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
              title="Save experience"
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
              title="Share experience"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Info + Booking Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px] gap-8 lg:gap-10">
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
            </div>

            {/* About the Experience (Truncated with Show More Modal) */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">About this experience</h2>
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

            {/* Inclusions & What to Bring (Preview + Show All Modal) */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">
                What&apos;s included &amp; requirements
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Key equipment provided and packing suggestions
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-4 text-sm font-normal">
                {/* Top Included items */}
                {whatsIncludedList.slice(0, 3).map((item, idx) => (
                  <div key={`inc-${idx}`} className="flex items-center gap-3 text-neutral-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}

                {/* Top What to Bring items */}
                {whatToBringList.slice(0, 3).map((item, idx) => (
                  <div key={`bring-${idx}`} className="flex items-center gap-3 text-neutral-800">
                    <Backpack className="h-4 w-4 text-purple shrink-0" />
                    <span>Bring: {item}</span>
                  </div>
                ))}
              </div>

              {totalInclusionsCount > 6 && (
                <button
                  type="button"
                  onClick={() => setShowInclusionsModal(true)}
                  className="mt-5 px-4 py-2 border border-neutral-300 hover:border-neutral-400 rounded-lg text-xs font-medium text-neutral-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  Show all {totalInclusionsCount} inclusions &amp; guidelines
                </button>
              )}
            </div>

            {/* Things to know / Activity Highlights */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">Things to know</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 text-xs">
                <div>
                  <p className="font-medium text-neutral-800">Duration</p>
                  <p className="text-neutral-500 font-normal mt-0.5">
                    {item.duration || "Approx. 3-4 hours"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Group setting</p>
                  <p className="text-neutral-500 font-normal mt-0.5">
                    {item.groupSize || "Small group (up to 10 guests)"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Cancellation</p>
                  <p className="text-neutral-500 font-normal mt-0.5">Free up to 24 hrs before</p>
                </div>
              </div>
            </div>

            {/* Meeting Point & Location with Google Maps */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">Meeting point &amp; location</h2>
              <p className="text-xs font-normal text-neutral-500 leading-relaxed mt-1.5">
                {item.address ? `${item.address}, ` : ""}
                {locationString}. Exact pin location on Google Maps below.
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
              listingId={item.id}
              listingName={title}
              listingType="Experience"
              reviews={reviews.map((r: any) => ({
                id: r.id,
                author: r.author || r.userName || "Guest",
                rating: r.rating || 5,
                content: r.content || r.comment || "",
                date: r.date || "Recent",
                authorLocation: r.authorLocation || "Verified Traveler",
                avatar: r.avatar,
              }))}
              avgRating={avgRating}
              reviewCount={reviewCount}
              onViewAllReviews={() => setShowReviewsModal(true)}
            />

            {/* Host section removed per instruction */}
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
                  <span className="text-xs font-normal text-neutral-500">/ person</span>
                </div>
                <div className="text-xs font-medium text-neutral-700 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{avgRating.toFixed(1)}</span>
                  <span className="text-neutral-400 font-normal">({reviewCount})</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Guest Selectors (At Top of Card) */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-neutral-500 block mb-1 uppercase tracking-wider">
                      Adults
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => {
                        setAdults(Number(e.target.value));
                        setAvailabilityResult("idle");
                      }}
                      className="w-full bg-neutral-50 rounded-lg py-1.5 px-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((n) => (
                        <option key={n} value={n}>
                          {n} adult{n !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-neutral-500 block mb-1 uppercase tracking-wider">
                      Children
                    </label>
                    <select
                      value={children}
                      onChange={(e) => {
                        setChildren(Number(e.target.value));
                        setAvailabilityResult("idle");
                      }}
                      className="w-full bg-neutral-50 rounded-lg py-1.5 px-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50 cursor-pointer"
                    >
                      {[0, 1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} child{n !== 1 ? "ren" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date & Time Slot Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-neutral-500 block mb-1 uppercase tracking-wider">
                      Experience Date
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
                      Time Slot
                    </label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => {
                        setSelectedSlot(e.target.value);
                        setAvailabilityResult("idle");
                      }}
                      className="w-full bg-neutral-50 rounded-lg py-1.5 px-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50 cursor-pointer"
                    >
                      {(timeSlots.length > 0 ? timeSlots : [
                        { id: "slot-default", label: "08:00 AM", timeSlot: "08:00 AM", status: "available" as const, capacity: 6 }
                      ]).map((slot) => {
                        const slotVal = slot.timeSlot || slot.label || "08:00 AM";
                        const isAvail = slot.status === "available";
                        return (
                          <option key={slot.id} value={slotVal} disabled={!isAvail}>
                            {slotVal} {isAvail ? `(${slot.capacity ?? 4} spots)` : "(Sold out)"}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Availability status */}
                {availabilityResult === "available" && (
                  <div className="py-1 px-2.5 bg-emerald-50 border border-emerald-200/60 rounded-lg flex items-center gap-1.5 text-emerald-800 text-[11px] font-normal">
                    <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" />
                    <span>
                      Confirmed for {selectedSlot || "chosen slot"} · {totalGuests} guests
                    </span>
                  </div>
                )}
                {availabilityResult === "unavailable" && (
                  <div className="py-1 px-2.5 bg-rose-50 border border-rose-200/60 rounded-lg flex items-center gap-1.5 text-rose-800 text-[11px] font-normal">
                    <AlertCircle className="h-3 w-3 shrink-0 text-rose-600" />
                    <span>All slots booked for this date. Pick another date or slot.</span>
                  </div>
                )}

                {/* Price Breakdown */}
                {selectedDate ? (
                  <div className="pt-2 border-t border-neutral-100 space-y-1 text-xs">
                    <div className="flex justify-between text-neutral-500 font-normal">
                      <span>
                        {totalGuests} guest{totalGuests !== 1 ? "s" : ""} x K
                        {pricePerPerson.toLocaleString()}
                      </span>
                      <span className="text-neutral-900 font-medium">
                        K{(pricePerPerson * totalGuests).toLocaleString()}
                      </span>
                    </div>
                    {selectedSlot && (
                      <div className="flex justify-between text-neutral-500 font-normal">
                        <span>Slot: {selectedSlot}</span>
                        <span className="text-purple font-medium">Reserved</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-900 font-semibold border-t border-neutral-100 pt-1.5 text-sm">
                      <span>Total</span>
                      <span>K{(pricePerPerson * totalGuests).toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-normal text-center">
                      Direct booking · Instant confirmation
                    </p>
                  </div>
                ) : (
                  <div className="pt-1 text-[11px] font-normal text-neutral-400 text-center">
                    Select a date &amp; slot to see total
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
                  <span>Select Date to Check Slots</span>
                </button>
              ) : availabilityResult === "idle" ? (
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={checkingAvailability || isSoldOut}
                  className="w-full rounded-xl py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 bg-purple hover:bg-purple-hover text-white shadow-md shadow-purple/25 hover:shadow-lg hover:shadow-purple/35 cursor-pointer"
                >
                  {checkingAvailability ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Checking Available Slots...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Check Slot Availability</span>
                    </>
                  )}
                </button>
              ) : availabilityResult === "unavailable" || isSoldOut ? (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-xl py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 bg-neutral-200 text-neutral-400 cursor-not-allowed"
                >
                  <span>Sold Out on This Date</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleProceedToBook}
                  className="w-full rounded-xl py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 bg-purple hover:bg-purple-hover text-white shadow-md shadow-purple/25 hover:shadow-lg hover:shadow-purple/35 cursor-pointer transform active:scale-[0.99]"
                >
                  <span>Reserve Slot ({selectedSlot})</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {/* Cross-sell */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500 font-normal">Need a stay nearby?</span>
                <Link href="/stays" className="text-purple font-medium hover:underline">
                  Find stays →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Experiences Section */}
        <section className="mt-16 pt-8 border-t border-neutral-200">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Similar experiences you might like
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">Explore popular adventures in Zambia</p>
            </div>
            <Link
              href="/experiences"
              className="text-xs font-medium text-purple hover:underline inline-flex items-center gap-1"
            >
              See all experiences →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockExperiences
              .filter((e) => e.id !== item.id)
              .slice(0, 4)
              .map((exp) => (
                <Link
                  key={exp.id}
                  href={`/experiences/${exp.id}`}
                  className="group block bg-white rounded-xl overflow-hidden border border-neutral-200/80 p-2.5 hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-4/3 rounded-lg overflow-hidden mb-2.5 bg-neutral-100">
                    <img
                      src={exp.image}
                      alt={exp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="font-medium text-sm text-neutral-900 group-hover:text-purple transition-colors truncate">
                      {exp.name}
                    </h3>
                    <div className="flex items-center gap-0.5 text-xs font-medium text-neutral-700 shrink-0">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{exp.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs font-normal text-neutral-500 mt-0.5">{exp.location}</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    K{exp.price}{" "}
                    <span className="font-normal text-xs text-neutral-500">/ person</span>
                  </p>
                </Link>
              ))}
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
            <span className="text-xs font-medium text-neutral-500">/ person</span>
          </div>
          <div className="text-xs text-neutral-600 flex items-center gap-1 font-medium mt-0.5">
            <span className="text-purple font-semibold">{subtypeLabel}</span>
            {selectedDate && (
              <>
                <span>·</span>
                <span className="text-neutral-500">{totalGuests} guests</span>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={availabilityResult === "available" ? handleProceedToBook : handleCheckAvailability}
          disabled={isSoldOut || (Boolean(selectedDate) && availabilityResult === "unavailable")}
          className={cn(
            "px-7 py-3 rounded-xl font-bold text-sm ml-4 cursor-pointer transition-colors",
            isSoldOut || (Boolean(selectedDate) && availabilityResult === "unavailable")
              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              : "bg-purple text-white shadow-md shadow-purple/25 hover:bg-purple-hover",
          )}
        >
          {isSoldOut || (Boolean(selectedDate) && availabilityResult === "unavailable")
            ? "Sold out"
            : availabilityResult === "available"
            ? "Book slot"
            : "Check slots"}
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
                <h3 className="text-xl font-bold text-neutral-900">About this experience</h3>
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

      {/* Full Inclusions & Guidelines Modal */}
      {showInclusionsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowInclusionsModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-black/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Inclusions &amp; Guidelines</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{title}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowInclusionsModal(false)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-800">
              {/* What's Included */}
              {whatsIncludedList.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-700 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>What&apos;s Included</span>
                  </h4>
                  <div className="space-y-2.5">
                    {whatsIncludedList.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What to Bring */}
              {whatToBringList.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-purple mb-3 flex items-center gap-1.5">
                    <Backpack className="h-4 w-4 text-purple" />
                    <span>What to Bring / Packing Suggestions</span>
                  </h4>
                  <div className="space-y-2.5">
                    {whatToBringList.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Backpack className="h-4 w-4 text-purple shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What NOT to Bring */}
              {whatNotToBringList.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-rose-700 mb-3 flex items-center gap-1.5">
                    <Ban className="h-4 w-4 text-rose-600" />
                    <span>What NOT to Bring / Restrictions</span>
                  </h4>
                  <div className="space-y-2.5">
                    {whatNotToBringList.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-neutral-700">
                        <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                        <span>{item}</span>
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
                <p className="text-xs text-neutral-500">Typical response time: within 30 mins</p>
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
                      "Can you pick up from our hotel?",
                      "Is this suitable for young children?",
                      "Are dietary requests accommodated?",
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
                    placeholder="Hi! I have a question about this tour..."
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
        description="Sign in to save this experience and access it from any device."
      />
    </div>
  );
}

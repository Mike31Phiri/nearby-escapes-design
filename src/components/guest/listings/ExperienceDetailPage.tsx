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
  ChevronDown,
  Compass,
  CheckCircle2,
  XCircle,
  X,
  Search,
  AlertCircle,
  AlertTriangle,
  Accessibility,
  Footprints,
  Info,
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
  const [isSlotDropdownOpen, setIsSlotDropdownOpen] = useState(false);

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

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    if (!newDate) {
      setAvailabilityResult("idle");
      return;
    }
    setCheckingAvailability(true);
    setAvailabilityResult("idle");
    setTimeout(() => {
      setCheckingAvailability(false);
      if (isSoldOut) {
        setAvailabilityResult("unavailable");
        toast.error("No times available for this date");
      } else {
        setAvailabilityResult("available");
        const currentSlotObj = timeSlots.find((s) => (s.timeSlot || s.label) === selectedSlot);
        if (!currentSlotObj || currentSlotObj.status !== "available") {
          const firstAvail = timeSlots.find((s) => s.status === "available");
          if (firstAvail) {
            setSelectedSlot(firstAvail.timeSlot || firstAvail.label || "08:00 AM");
          }
        }
      }
    }, 350);
  };

  const handleCheckAvailability = () => {
    if (!selectedDate) {
      toast.error("Please pick a date for your adventure first.");
      const el = document.getElementById("booking-date-input");
      if (el) el.focus();
      return;
    }
    handleDateChange(selectedDate);
  };

  const handleProceedToBook = () => {
    if (!selectedDate) {
      toast.error("Please select a date for your experience first.");
      const el = document.getElementById("booking-date-input");
      if (el) el.focus();
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select a time for this experience.");
      return;
    }
    const currentSlotObj = timeSlots.find((s) => (s.timeSlot || s.label) === selectedSlot);
    if (currentSlotObj && currentSlotObj.status !== "available") {
      toast.error("The selected time is unavailable. Please choose another time.");
      return;
    }
    if (isSoldOut || availabilityResult === "unavailable") {
      toast.error("No times available for this date.");
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

  // Itinerary Stops
  const itineraryStops = useMemo(() => {
    if (Array.isArray(item.itinerary) && item.itinerary.length > 0) {
      return item.itinerary;
    }
    const lowerTitle = title.toLowerCase();
    const lowerCategory = (item.category || "").toLowerCase();
    if (lowerTitle.includes("flight") || lowerTitle.includes("helicopter") || lowerTitle.includes("falls") || lowerCategory.includes("vic_falls")) {
      return [
        {
          time: "08:00 AM",
          title: "Hotel Pick-up & Helipad Welcome",
          description: "Convenient pick-up from your lodge followed by safety orientation, flight headset fitting, and pilot briefing.",
        },
        {
          time: "08:45 AM",
          title: "Scenic Flight Over Victoria Falls & Gorge",
          description: "Take to the skies directly over the Batoka Gorge and Victoria Falls. Enjoy continuous 360-degree panoramic viewpoints and aerial photography.",
        },
        {
          time: "09:45 AM",
          title: "Zambezi National Park Low-Level Sweep",
          description: "Low-altitude pass along the upper Zambezi River spotting elephants, hippos, and buffalo herds in their natural habitat.",
        },
        {
          time: "10:30 AM",
          title: "Touchdown, Route Certificate & Refreshments",
          description: "Land back at the helipad, receive your personalized flight route certificate, enjoy chilled drinks, and return transfer to your hotel.",
        },
      ];
    }
    if (lowerTitle.includes("boat") || lowerTitle.includes("cruise") || lowerTitle.includes("river") || lowerCategory.includes("water")) {
      return [
        {
          time: "15:30 PM",
          title: "Boarding & Welcome Refreshment",
          description: "Board our spacious river vessel with comfortable seating and safety life jackets. Introduction to the river captain.",
        },
        {
          time: "16:00 PM",
          title: "Zambezi Islands & Hippo Pods Cruise",
          description: "Navigate upstream along palm-fringed islands observing hippo pods, sunbathing crocodiles, and exotic water birds.",
        },
        {
          time: "17:30 PM",
          title: "African Sunset & Gourmet Canapés",
          description: "Anchor in quiet calm waters to witness the legendary golden African sunset over the water while enjoying drinks and local snacks.",
        },
        {
          time: "18:30 PM",
          title: "Disembarkation & Transfer",
          description: "Return to the jetty as twilight settles. Transfer back to your accommodation.",
        },
      ];
    }
    if (lowerTitle.includes("village") || lowerTitle.includes("cultural") || lowerTitle.includes("art")) {
      return [
        {
          time: "09:00 AM",
          title: "Village Welcome & Chief Greeting",
          description: "Arrive at the community gates, welcome greetings with local community elders, and historical background of the area.",
        },
        {
          time: "10:00 AM",
          title: "Traditional Crafts & Artisan Demonstrations",
          description: "Hands-on participation in authentic basket weaving, pottery shaping, and traditional tool making.",
        },
        {
          time: "11:15 AM",
          title: "Community Tour & Folk Music",
          description: "Experience community traditions, local instruments, folk songs, and educational projects.",
        },
        {
          time: "12:15 PM",
          title: "Traditional Feast & Farewell",
          description: "Taste authentic Zambian Nshima, seasonal vegetables, and wild relish before concluding the cultural tour.",
        },
      ];
    }
    if (lowerTitle.includes("farm") || lowerCategory.includes("farm")) {
      return [
        {
          time: "08:30 AM",
          title: "Farm Welcome & Dairy Barn Tour",
          description: "Arrival at the farmhouse, morning orientation, and hands-on participation in organic dairy care and milking.",
        },
        {
          time: "09:45 AM",
          title: "Orchard & Crop Fields Walk",
          description: "Walk through seasonal organic vegetable gardens and fruit orchards with tips on sustainable Zambian farming.",
        },
        {
          time: "11:00 AM",
          title: "Harvesting & Farm-to-Table Workshop",
          description: "Pick fresh produce and learn traditional bread baking and cheese making techniques in the outdoor kitchen.",
        },
        {
          time: "12:15 PM",
          title: "Country Lunch & Tasting",
          description: "Relaxed family-style farm lunch with ingredients picked fresh from the fields, fresh juice, and local honey.",
        },
      ];
    }
    // Default Wildlife Safari & General Adventure
    return [
      {
        time: "06:00 AM",
        title: "Sunrise Bush Departure & Gate Entry",
        description: "Meet your licensed safari ranger in a custom open 4x4 vehicle. Enter the park as the morning light activates wildlife.",
      },
      {
        time: "07:00 AM",
        title: "Predator & Big Game Tracking",
        description: "Navigate river loops and waterholes tracking lions, leopards, and large elephant herds during peak activity hours.",
      },
      {
        time: "09:30 AM",
        title: "Bush Coffee & Traditional Snacks Break",
        description: "Scenic stop along the riverbank for fresh Zambian coffee, tea, homemade rusks, and bird identification.",
      },
      {
        time: "10:30 AM",
        title: "Late Morning Wildlife Circuit & Return",
        description: "Secondary wildlife circuit focusing on plains game and raptors before returning to the safari base camp.",
      },
    ];
  }, [item, title]);

  // Inclusions & Rules parsing
  const whatsIncludedList: string[] = useMemo(() => {
    if (Array.isArray(item.whatsIncluded) && item.whatsIncluded.length > 0) return item.whatsIncluded;
    if (Array.isArray(item.inclusions) && item.inclusions.length > 0) return item.inclusions;
    return [
      "National Park Entry & Conservation Fees",
      "Professional Certified Safari Guide",
      "Open 4x4 Safari Vehicle Transport",
      "Complimentary Chilled Water & Snacks",
      "Safety Equipment & First Aid Coverage",
      "Hotel Pick-up & Drop-off (Within 10km)",
    ];
  }, [item]);

  const whatsNotIncludedList: string[] = useMemo(() => {
    if (Array.isArray(item.whatsNotIncluded) && item.whatsNotIncluded.length > 0) return item.whatsNotIncluded;
    if (Array.isArray(item.exclusions) && item.exclusions.length > 0) return item.exclusions;
    return [
      "Gratuities & tips for guides and drivers (discretionary)",
      "Alcoholic beverages & premium wine selections",
      "Personal travel, medical, or evacuation insurance",
      "Souvenirs, artisan crafts, and personal shopping expenses",
      "Specialized camera gear and lens rental fees",
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
      "Insect Repellent Spray or Cream",
      "Warm Fleece or Light Jacket for Early Mornings",
    ];
  }, [item]);

  const whatNotToBringList: string[] = useMemo(() => {
    if (Array.isArray(item.whatNotToBring) && item.whatNotToBring.length > 0) return item.whatNotToBring;
    return [
      "Drones (Strictly Prohibited in National Parks)",
      "Single-Use Plastic Bags & Wrappers",
      "Bright Red / Neon Colored Clothes (Spooks Wildlife)",
      "Domestic Pets or Companion Animals",
      "Firearms, Hunting Knives, or Weapons",
      "Hard-shell or Oversized Heavy Luggage",
    ];
  }, [item]);

  const totalInclusionsCount =
    whatsIncludedList.length + whatsNotIncludedList.length + whatToBringList.length + whatNotToBringList.length;

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

            {/* Experience Itinerary */}
            <div className="pt-8">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Experience Itinerary</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Planned schedule and key stops for this adventure
                </p>
              </div>

              <div className="mt-5 relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                {itineraryStops.map((stop: any, idx: number) => (
                  <div key={`stop-${idx}`} className="relative group">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-purple bg-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple" />
                    </div>

                    <div>
                      <span className="text-xs font-medium text-neutral-500">
                        {stop.time}
                      </span>
                      <h3 className="text-sm font-semibold text-neutral-900 mt-0.5">
                        {stop.title}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {stop.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included & What's Not Included */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">What&apos;s included &amp; not included</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Everything provided by your host vs what you should budget for separately
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {/* What's Included */}
                <div className="bg-emerald-50/40 border border-emerald-200/70 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs uppercase tracking-wider mb-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>What&apos;s included</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-neutral-800">
                    {whatsIncludedList.map((inc, idx) => (
                      <li key={`inc-${idx}`} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="leading-snug">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What's NOT Included */}
                <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-neutral-700 font-semibold text-xs uppercase tracking-wider mb-3">
                    <X className="h-4 w-4 text-neutral-400" />
                    <span>What&apos;s not included</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-neutral-600">
                    {whatsNotIncludedList.map((notInc, idx) => (
                      <li key={`not-inc-${idx}`} className="flex items-start gap-2.5">
                        <X className="h-3.5 w-3.5 text-neutral-400 mt-0.5 shrink-0" />
                        <span className="leading-snug">{notInc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* What to Bring & What's Not Allowed / What NOT to Bring */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">What to bring &amp; what&apos;s not allowed</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Essential packing recommendations and forbidden items
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {/* What to Bring */}
                <div className="bg-purple/5 border border-purple/20 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-purple font-semibold text-xs uppercase tracking-wider mb-3">
                    <Backpack className="h-4 w-4 text-purple" />
                    <span>What to bring</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-neutral-800">
                    {whatToBringList.map((bring, idx) => (
                      <li key={`bring-${idx}`} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-purple mt-0.5 shrink-0" />
                        <span className="leading-snug">{bring}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What NOT to Bring / Forbidden */}
                <div className="bg-rose-50/40 border border-rose-200/70 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-rose-900 font-semibold text-xs uppercase tracking-wider mb-3">
                    <Ban className="h-4 w-4 text-rose-600" />
                    <span>What not to bring (Not allowed)</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-neutral-700">
                    {whatNotToBringList.map((nobring, idx) => (
                      <li key={`nobring-${idx}`} className="flex items-start gap-2.5">
                        <Ban className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                        <span className="leading-snug">{nobring}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Important Information & Suitability ("Not Suitable For") */}
            <div className="pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">Important information &amp; suitability</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Accessibility details, physical fitness requirements, and health guidance
              </p>

              {/* Dedicated "Not Suitable For" Card */}
              <div className="mt-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs uppercase tracking-wider mb-3">
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                  <span>Not suitable for</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/80 flex items-center justify-center shrink-0 text-amber-900">
                      <Accessibility className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Wheelchair users</p>
                      <p className="text-neutral-600 text-[11px] mt-0.5 leading-relaxed">
                        Not wheelchair accessible due to unpaved natural dirt tracks, rocky trails, and high step-up vehicle chassis.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/80 flex items-center justify-center shrink-0 text-amber-900">
                      <Footprints className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">People with mobility impairments</p>
                      <p className="text-neutral-600 text-[11px] mt-0.5 leading-relaxed">
                        Requires moderate walking, boarding open safari vehicles, and navigating uneven wilderness trails.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/80 flex items-center justify-center shrink-0 text-amber-900">
                      <Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Pregnant women</p>
                      <p className="text-neutral-600 text-[11px] mt-0.5 leading-relaxed">
                        Not recommended for pregnant guests past their second trimester due to bumpy unpaved wilderness paths.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/80 flex items-center justify-center shrink-0 text-amber-900">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Children under 6 years</p>
                      <p className="text-neutral-600 text-[11px] mt-0.5 leading-relaxed">
                        Children under 6 are not permitted on open game vehicles or active trails due to park safety regulations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Guidelines Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-3.5">
                <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-neutral-800 font-semibold text-xs mb-1">
                    <Clock className="h-3.5 w-3.5 text-purple" />
                    <span>Duration &amp; Arrival</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    {item.duration || "Approx. 3-4 hours"}. Please arrive 15 minutes before scheduled start time.
                  </p>
                </div>

                <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-neutral-800 font-semibold text-xs mb-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Safety &amp; First Aid</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    Certified Wilderness First Responder on site. Emergency medical kit carried on all excursions.
                  </p>
                </div>

                <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-neutral-800 font-semibold text-xs mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <span>Cancellation Policy</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    Free cancellation up to 24 hours before the experience start time for a full refund.
                  </p>
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
                {/* 1. Guest Selectors (At Top of Card) */}
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

                {/* 2. Experience Date */}
                <div>
                  <label className="text-[10px] font-semibold text-neutral-500 block mb-1 uppercase tracking-wider">
                    Experience Date
                  </label>
                  <input
                    id="booking-date-input"
                    type="date"
                    value={selectedDate}
                    min={today}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full bg-neutral-50 rounded-lg py-1.5 px-2 border border-neutral-200 text-xs font-normal text-neutral-900 focus:outline-none focus:ring-1 focus:ring-purple/50 cursor-pointer"
                  />
                </div>

                {/* 3. Time Selection as Dropdown (Times Only, Unavailable Times Fainted) */}
                <div className="relative">
                  <label className="text-[10px] font-semibold text-neutral-500 block mb-1 uppercase tracking-wider">
                    Time
                  </label>

                  <button
                    type="button"
                    disabled={!selectedDate || checkingAvailability || isSoldOut}
                    onClick={() => setIsSlotDropdownOpen((prev) => !prev)}
                    className={cn(
                      "w-full bg-neutral-50 rounded-lg py-2 px-2.5 border text-xs font-normal text-left flex items-center justify-between transition-all",
                      !selectedDate || isSoldOut
                        ? "border-neutral-200 text-neutral-400 cursor-not-allowed bg-neutral-100/60"
                        : isSlotDropdownOpen
                        ? "border-purple ring-1 ring-purple/30 bg-white text-neutral-900 shadow-2xs cursor-pointer"
                        : "border-neutral-200 text-neutral-900 hover:border-neutral-300 hover:bg-neutral-100/50 cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Clock className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate font-medium">
                        {checkingAvailability ? (
                          "Loading available times..."
                        ) : !selectedDate ? (
                          "Select date to view times"
                        ) : selectedSlot ? (
                          selectedSlot
                        ) : (
                          "Select time"
                        )}
                      </span>
                    </div>
                    {checkingAvailability ? (
                      <Loader2 className="h-3.5 w-3.5 text-neutral-400 animate-spin" />
                    ) : (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 text-neutral-400 transition-transform duration-200",
                          isSlotDropdownOpen && "rotate-180"
                        )}
                      />
                    )}
                  </button>

                  {/* Dropdown Menu (Times Only) */}
                  {isSlotDropdownOpen && !checkingAvailability && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsSlotDropdownOpen(false)}
                      />
                      <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-neutral-200 rounded-xl shadow-lg p-1 space-y-0.5 max-h-52 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                        {(timeSlots.length > 0
                          ? timeSlots
                          : [
                              { id: "slot-default", label: "08:00 AM", timeSlot: "08:00 AM", status: "available" as const, capacity: 6 },
                            ]
                        ).map((slot) => {
                          const timeText = slot.timeSlot || slot.label || "08:00 AM";
                          const isAvail = slot.status === "available";
                          const isSelected = selectedSlot === timeText;
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={!isAvail}
                              onClick={() => {
                                if (isAvail) {
                                  setSelectedSlot(timeText);
                                  setIsSlotDropdownOpen(false);
                                }
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between",
                                // Unavailable times become fainted in color
                                !isAvail
                                  ? "opacity-35 bg-neutral-100/70 text-neutral-400 cursor-not-allowed select-none line-through"
                                  : isSelected
                                  ? "bg-purple/10 text-purple font-semibold"
                                  : "text-neutral-800 hover:bg-neutral-100 cursor-pointer"
                              )}
                            >
                              <span>{timeText}</span>
                              {isSelected && isAvail && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-purple shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Availability status */}
                {availabilityResult === "unavailable" && (
                  <div className="py-1 px-2.5 bg-rose-50 border border-rose-200/60 rounded-lg flex items-center gap-1.5 text-rose-800 text-[11px] font-normal">
                    <AlertCircle className="h-3 w-3 shrink-0 text-rose-600" />
                    <span>No times available for this date. Pick another date.</span>
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
                        <span>Time: {selectedSlot}</span>
                        <span className="text-emerald-700 font-medium">Confirmed</span>
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
                    Select a date to see times &amp; total
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
                  <span>Select Date to See Times</span>
                </button>
              ) : checkingAvailability ? (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-xl py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 bg-purple/70 text-white cursor-wait"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading Times...</span>
                </button>
              ) : availabilityResult === "unavailable" || isSoldOut ? (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-xl py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 bg-neutral-200 text-neutral-400 cursor-not-allowed"
                >
                  <span>No Times Available</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleProceedToBook}
                  className="w-full rounded-xl py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 bg-purple hover:bg-purple-hover text-white shadow-md shadow-purple/25 hover:shadow-lg hover:shadow-purple/35 cursor-pointer transform active:scale-[0.99]"
                >
                  <span>Book {selectedSlot}</span>
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
            : !selectedDate
            ? "Select date"
            : selectedSlot
            ? `Book ${selectedSlot}`
            : "Book now"}
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

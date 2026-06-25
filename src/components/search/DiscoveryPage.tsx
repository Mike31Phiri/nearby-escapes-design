"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect, Suspense } from "react";
import { DateRangePicker, serializeDates, deserializeDates, type DateRange } from "@/components/ui/DateRangePicker";
import {
  MagnifyingGlass as Search,
  SlidersHorizontal,
  MapPin,
  Heart,
  Star,
  Compass,
  Users,
  ArrowRight,
  CaretDown as ChevronDown,
  SquaresFour as LayoutGrid,
  List,
  MapTrifold as MapIcon,
  Plant as Sprout,
  Buildings as Building2,
  Warehouse,
  PawPrint,
  Tree as TreePine,
  Tent,
  Buildings as Hotel,
  Path as Route,
  Crown,
  Diamond as Gem,
  Check,
  Bus,
  Sun,
  Bed,
  Binoculars,
  CarProfile,
  GlobeHemisphereWest,
  MapTrifold,
  Factory,
} from "@phosphor-icons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { mockStays, mockTransport, mockExperiences, mockGems, mockPackages } from "@/lib/mock-data";

/* Types */

type UnifiedItem = {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  location: string;
  distance: string;
  price: number;
  priceLabel: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  href: string;
  bgColor: string;
  icon: React.ReactNode;
  type: string;
};

type CategoryDef = {
  slug: string;
  label: string;
  icon: React.ReactNode;
};

type FilterSection = {
  id: string;
  label: string;
  type:
    | "sub-type"
    | "price"
    | "amenities"
    | "distance"
    | "operator"
    | "duration"
    | "from-city"
    | "property-type"
    | "review-score"
    | "landmarks"
    | "travel-group"
    | "distance-centre";
  options?: { slug: string; label: string; count?: number }[];
};

/* Category Definitions */

const CATEGORIES: CategoryDef[] = [
  { slug: "all", label: "All", icon: <GlobeHemisphereWest className="h-4 w-4" weight="duotone" /> },
  { slug: "stays", label: "Stays", icon: <Bed className="h-4 w-4" weight="duotone" /> },
  { slug: "experiences", label: "Experiences", icon: <Binoculars className="h-4 w-4" weight="duotone" /> },
  { slug: "transport", label: "Transport", icon: <CarProfile className="h-4 w-4" weight="duotone" /> },
  { slug: "local-tours", label: "Local Tours", icon: <Factory className="h-4 w-4" weight="duotone" /> },
];

/* Computed filter options from mock data */
function getPropertyTypeOptions() {
  const counts: Record<string, number> = {};
  mockStays.forEach((s) => {
    counts[s.type] = (counts[s.type] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([label, count]) => ({
      slug: STAY_SUB_TYPE_MAP[label] || label.toLowerCase(),
      label,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

function getReviewScoreOptions() {
  const superb = mockStays.filter((s) => s.rating >= 4.5).length;
  const veryGood = mockStays.filter((s) => s.rating >= 4.0).length;
  const good = mockStays.filter((s) => s.rating >= 3.5).length;
  const pleasant = mockStays.filter((s) => s.rating >= 3.0).length;
  return [
    { slug: "superb", label: "Superb: 9+", count: superb },
    { slug: "very-good", label: "Very good: 8+", count: veryGood },
    { slug: "good", label: "Good: 7+", count: good },
    { slug: "pleasant", label: "Pleasant: 6+", count: pleasant },
  ];
}

function getLandmarkOptions() {
  const counts: Record<string, number> = {};
  mockStays.forEach((s) => {
    if (s.closestAttraction) {
      counts[s.closestAttraction] = (counts[s.closestAttraction] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .map(([label, count]) => ({
      slug: label.toLowerCase().replace(/\s+/g, "-"),
      label,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

function getTravelGroupOptions() {
  const pets = mockStays.filter((s) =>
    s.amenities.some((a) => a.toLowerCase().includes("pet")),
  ).length;
  const family = mockStays.filter((s) => (s.guests ?? 2) >= 4).length;
  return [
    { slug: "pets-allowed", label: "Pets allowed", count: pets },
    { slug: "family-friendly", label: "Family friendly properties", count: family },
  ];
}

/* Per-category filter definitions */
const CATEGORY_FILTERS: Record<string, FilterSection[]> = {
  all: [
    {
      id: "sub-type",
      label: "Filter by",
      type: "sub-type",
      options: [
        { slug: "stays", label: "Stays" },
        { slug: "experiences", label: "Experiences" },
        { slug: "transport", label: "Transport" },
        { slug: "tours", label: "Tours" },
      ],
    },
    { id: "price", label: "Price range", type: "price" },
    { id: "distance", label: "Distance from centre", type: "distance" },
  ],
  stays: [
    {
      id: "property-type",
      label: "Property type",
      type: "property-type",
    },
    {
      id: "review-score",
      label: "Review score",
      type: "review-score",
    },
    { id: "price", label: "Price per night (K)", type: "price" },
    {
      id: "distance-centre",
      label: "Distance from centre",
      type: "distance-centre",
    },
    {
      id: "landmarks",
      label: "Landmarks",
      type: "landmarks",
    },
    {
      id: "travel-group",
      label: "Travel group",
      type: "travel-group",
    },
    { id: "amenities", label: "Amenities", type: "amenities" },
  ],
  experiences: [
    { id: "price", label: "Price per person", type: "price" },
    { id: "distance", label: "Location distance", type: "distance" },
  ],
  transport: [
    { id: "price", label: "Price per seat", type: "price" },
    { id: "operator", label: "Operator", type: "operator" },
  ],
  tours: [
    { id: "price", label: "Price per package", type: "price" },
    { id: "duration", label: "Duration", type: "duration" },
  ],
};



/* Sub-type mapping: raw data → stay sub-type slug */
const STAY_SUB_TYPE_MAP: Record<string, string> = {
  Lodge: "lodges",
  Hotel: "hotels",
  Camp: "camps",
  Resort: "resorts",
  Boutique: "boutiques",
};

const categoryIcons: Record<string, React.ReactNode> = {
  Lodge: <Building2 className="h-4 w-4" />,
  Hotel: <Hotel className="h-4 w-4" />,
  Camp: <Tent className="h-4 w-4" />,
  Resort: <TreePine className="h-4 w-4" />,
  Boutique: <Crown className="h-4 w-4" />,
  "Farm stay": <Sprout className="h-4 w-4" />,
  Experience: <Compass className="h-4 w-4" />,
  Wildlife: <PawPrint className="h-4 w-4" />,
  Industrial: <Warehouse className="h-4 w-4" />,
  Transport: <Bus className="h-4 w-4" />,
  Package: <Sun className="h-4 w-4" />,
};

const categoryBgColors: Record<string, string> = {
  Lodge: "#1C2A3A",
  Hotel: "#2A1A3A",
  Camp: "#1A2A10",
  Resort: "#0F2030",
  Boutique: "#2A1A4A",
  "Farm stay": "#1C2A1A",
  Experience: "#2A1A08",
  Wildlife: "#0F2030",
  Industrial: "#3A2A10",
  Transport: "#1A2A3A",
  Package: "#2A1A30",
};

const DISTANCE_PILLS = ["Under 1 hr", "1–2 hrs", "2–4 hrs", "4+ hrs"];
const AMENITY_OPTIONS = ["Wi-Fi", "Hot water", "Parking", "Pet friendly", "Kitchen", "Transport"];

/* Badge generator */
const getBadge = (id: string, idx: number): string | undefined => {
  const num = parseInt(id.replace(/\D/g, "") || "0", 10) + idx;
  const badges = ["Hot deal", "Unique", "New", "Trending", "Top rated", null, null, null];
  return badges[num % badges.length] ?? undefined;
};



/* Unified data builder */
function buildUnifiedItems(): UnifiedItem[] {
  const items: UnifiedItem[] = [];

  mockStays.forEach((s, i) => {
    const cat = s.type;
    items.push({
      id: s.id,
      name: s.name,
      category: cat,
      categorySlug: "stays",
      location: s.location,
      distance: s.distance || `${Math.floor(Math.random() * 4) + 1} hrs`,
      price: s.price,
      priceLabel: "/night",
      rating: s.rating,
      reviews: s.reviews,
      image: s.image,
      badge: getBadge(s.id, i),
      href: `/listings/stays/${s.id}`,
      bgColor: categoryBgColors[cat] || "#1C2A3A",
      icon: categoryIcons[cat] || <Building2 className="h-4 w-4" />,
      type: "stay",
    });
  });

  mockExperiences.forEach((e, i) => {
    items.push({
      id: e.id,
      name: e.name,
      category: "Experience",
      categorySlug: "experiences",
      location: e.location,
      distance: `${Math.floor(Math.random() * 3) + 1} hrs`,
      price: e.price,
      priceLabel: "/person",
      rating: e.rating,
      reviews: e.reviews,
      image: e.image,
      badge: getBadge(e.id, i + 10),
      href: `/listings/experiences/${e.id}`,
      bgColor: "#2A1A08",
      icon: <Compass className="h-4 w-4" />,
      type: "experience",
    });
  });

  mockGems.forEach((g) => {
    items.push({
      id: g.id,
      name: g.name,
      category: "Experience",
      categorySlug: "experiences",
      location: g.location,
      distance: `${Math.floor(Math.random() * 4) + 1} hrs`,
      price: g.price,
      priceLabel: "/person",
      rating: g.rating,
      reviews: g.reviews,
      image: g.image,
      badge: "Unique",
      href: `/gems/${g.id}`,
      bgColor: "#2A1A08",
      icon: <Gem className="h-4 w-4" />,
      type: "experience",
    });
  });

  mockPackages.forEach((p) => {
    items.push({
      id: p.id,
      name: p.name,
      category: "Package",
      categorySlug: "tours",
      location: p.location,
      distance: `${Math.floor(Math.random() * 3) + 2} hrs`,
      price: p.price,
      priceLabel: "/package",
      rating: p.rating,
      reviews: Math.floor(p.rating * 10),
      image: p.image,
      badge: getBadge(p.id, 20),
      href: `/packages/${p.id}`,
      bgColor: "#2A1A30",
      icon: <Sun className="h-4 w-4" />,
      type: "tour",
    });
  });

  mockTransport.forEach((t) => {
    items.push({
      id: t.id,
      name: `${t.from} → ${t.to}`,
      category: "Transport",
      categorySlug: "transport",
      location: t.from,
      distance: t.duration,
      price: t.price,
      priceLabel: "/seat",
      rating: 4.5,
      reviews: Math.floor(Math.random() * 50) + 10,
      image: t.image,
      badge: undefined,
      href: `/listings/transport/${t.id}`,
      bgColor: "#1A2A3A",
      icon: <Bus className="h-4 w-4" />,
      type: "transport",
    });
  });

  return items;
}

/* Stats */
/* 
   MAIN COMPONENT
    */

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tagParam = searchParams.get("tag") || searchParams.get("q") || "";
  const sortByParam = searchParams.get("sortBy") || "recommended";
  const datesParam = searchParams.get("dates") || "";
  const guestsParam = parseInt(searchParams.get("guests") || "1", 10);

  const urlCategory = searchParams.get("category") || "all";
  const initialCategory = CATEGORIES.some((c) => c.slug === urlCategory) ? urlCategory : "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(sortByParam);
  const [searchText, setSearchText] = useState(tagParam);
  const [dateRange, setDateRange] = useState<DateRange>(() => deserializeDates(datesParam));
  const [guestsCount, setGuestsCount] = useState(guestsParam);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Shared filter state
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedReviewScore, setSelectedReviewScore] = useState<string>("");
  const [selectedDistanceCentre, setSelectedDistanceCentre] = useState<string>("");
  const [selectedLandmarks, setSelectedLandmarks] = useState<string[]>([]);
  const [selectedTravelGroups, setSelectedTravelGroups] = useState<string[]>([]);

  const allItems = useMemo(() => buildUnifiedItems(), []);
  useEffect(() => {
    setSearchText(tagParam);
  }, [tagParam]);

  // Get active filter sections for the current category
  const activeFilters = useMemo(
    () => CATEGORY_FILTERS[activeCategory] || CATEGORY_FILTERS.all,
    [activeCategory],
  );

  //Filtered items ──
  const filteredItems = useMemo(() => {
    let items = [...allItems];

    // Category pill filter
    if (activeCategory !== "all") {
      items = items.filter((i) => i.categorySlug === activeCategory);
    }

    // Text search
    if (searchText) {
      const q = searchText.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q),
      );
    }

    // Sub-type filter (stay property types, or all-category sub-types)
    if (selectedSubTypes.length > 0) {
      if (activeCategory === "stays") {
        const allowedTypes = selectedSubTypes.flatMap((slug) => {
          const entry = Object.entries(STAY_SUB_TYPE_MAP).find(([, v]) => v === slug);
          return entry ? [entry[0]] : [];
        });
        items = items.filter((i) => allowedTypes.includes(i.category));
      } else if (activeCategory === "all") {
        items = items.filter((i) => selectedSubTypes.includes(i.categorySlug));
      }
    }

    // Price range
    if (priceMin) {
      const min = parseFloat(priceMin);
      if (!isNaN(min)) items = items.filter((i) => i.price >= min);
    }
    if (priceMax) {
      const max = parseFloat(priceMax);
      if (!isNaN(max)) items = items.filter((i) => i.price <= max);
    }

    // Property type filter (booking.com-style for stays)
    if (selectedPropertyTypes.length > 0) {
      const allowedCats = selectedPropertyTypes.flatMap((slug) => {
        const entry = Object.entries(STAY_SUB_TYPE_MAP).find(([, v]) => v === slug);
        return entry ? [entry[0]] : [];
      });
      items = items.filter((i) => allowedCats.includes(i.category));
    }

    // Review score filter
    if (selectedReviewScore) {
      const minRating =
        selectedReviewScore === "superb"
          ? 4.5
          : selectedReviewScore === "very-good"
            ? 4.0
            : selectedReviewScore === "good"
              ? 3.5
              : selectedReviewScore === "pleasant"
                ? 3.0
                : 0;
      items = items.filter((i) => i.rating >= minRating);
    }

    // Distance from centre filter (simplified)
    if (selectedDistanceCentre) {
      // In real app: check actual distance value
    }

    // Landmarks filter
    if (selectedLandmarks.length > 0) {
      const landmarkNames = selectedLandmarks.map((slug) => slug.replace(/-/g, " ").toLowerCase());
      const stayIdsWithLandmark = mockStays
        .filter(
          (s) => s.closestAttraction && landmarkNames.includes(s.closestAttraction.toLowerCase()),
        )
        .map((s) => s.id);
      items = items.filter((i) => stayIdsWithLandmark.includes(i.id));
    }

    // Guests capacity filter (stays only)
    if (guestsCount > 1) {
      items = items.filter((i) => {
        if (i.type !== "stay") return true;
        const stay = mockStays.find((s) => s.id === i.id);
        return stay ? (stay.guests ?? 2) >= guestsCount : true;
      });
    }

    // Date availability filter (simulated)
    if (dateRange?.checkIn && dateRange?.checkOut) {
      items = items.filter((i) => {
        // Deterministic mock availability check based on id and start date
        const day = dateRange.checkIn!.getDate();
        const numId = parseInt(i.id.replace(/\D/g, "") || "0", 10);
        // Exclude ~20% of items to simulate some being booked for the selected dates
        return (numId + day) % 5 !== 0;
      });
    }

    // Travel group filter
    if (selectedTravelGroups.length > 0) {
      if (selectedTravelGroups.includes("family-friendly")) {
        items = items.filter(
          (i) =>
            (i.type === "stay" && (mockStays.find((s) => s.id === i.id)?.guests ?? 2) >= 4) ||
            i.type !== "stay",
        );
      }
      if (selectedTravelGroups.includes("pets-allowed")) {
        items = items.filter((i) => {
          if (i.type !== "stay") return true;
          const stay = mockStays.find((s) => s.id === i.id);
          return stay ? stay.amenities.some((a) => a.toLowerCase().includes("pet")) : true;
        });
      }
    }

    // Distance filter (simplified)
    if (selectedDistance) {
      // keep all for demo
    }

    // Amenities filter
    if (selectedAmenities.length > 0) {
      items = items.filter((i) => {
        if (i.type !== "stay") return true;
        const stay = mockStays.find((s) => s.id === i.id);
        return stay ? selectedAmenities.every((a) => stay.amenities.includes(a)) : true;
      });
    }

    // Sort
    items.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return b.rating * b.reviews - a.rating * a.reviews;
      }
    });

    return items;
  }, [
    allItems,
    activeCategory,
    searchText,
    sortBy,
    selectedSubTypes,
    priceMin,
    priceMax,
    selectedDistance,
    selectedAmenities,
    selectedPropertyTypes,
    selectedReviewScore,
    selectedDistanceCentre,
    selectedLandmarks,
    selectedTravelGroups,
    guestsCount,
  ]);

  //Handlers ──
  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setSelectedSubTypes([]);
    setPriceMin("");
    setPriceMax("");
    setSelectedDistance("");
    setSelectedAmenities([]);
    setSelectedPropertyTypes([]);
    setSelectedReviewScore("");
    setSelectedDistanceCentre("");
    setSelectedLandmarks([]);
    setSelectedTravelGroups([]);
    const params = new URLSearchParams();
    if (slug !== "all") params.set("category", slug);
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchText.trim()) params.set("tag", searchText.trim());
    if (activeCategory !== "all") params.set("category", activeCategory);
    const dates = serializeDates(dateRange);
    if (dates) params.set("dates", dates);
    params.set("guests", String(guestsCount));
    router.push(`/search?${params.toString()}`);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val !== "recommended") params.set("sortBy", val);
    else params.delete("sortBy");
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const toggleSubType = (slug: string) => {
    setSelectedSubTypes((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const togglePropertyType = (slug: string) => {
    setSelectedPropertyTypes((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const toggleLandmark = (slug: string) => {
    setSelectedLandmarks((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const toggleTravelGroup = (slug: string) => {
    setSelectedTravelGroups((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const clearFilters = () => {
    setSelectedSubTypes([]);
    setPriceMin("");
    setPriceMax("");
    setSelectedDistance("");
    setSelectedAmenities([]);
    setSelectedPropertyTypes([]);
    setSelectedReviewScore("");
    setSelectedDistanceCentre("");
    setSelectedLandmarks([]);
    setSelectedTravelGroups([]);
    setSearchText("");
    router.push("/search");
  };

  //Render sidebar filter section by type ──
  const renderFilterSection = (section: FilterSection) => {
    switch (section.type) {
      case "sub-type":
        return (
          <div key={section.id} className="pb-6 mb-6 border-b border-[#E0DBD0]/50 last:border-b-0">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.8px] mb-3">
              {section.label}
            </div>
            <div className="flex flex-col gap-[8px]">
              {(section.options || []).map((opt) => (
                <label
                  key={opt.slug}
                  className="flex items-center gap-2 cursor-pointer group select-none"
                  onClick={() => toggleSubType(opt.slug)}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-[4px] border border-[#E0DBD0] bg-white shrink-0 flex items-center justify-center transition-colors group-hover:border-[#1A0B2E]",
                      selectedSubTypes.includes(opt.slug) && "bg-[#1A0B2E] border-[#1A0B2E]",
                    )}
                  >
                    {selectedSubTypes.includes(opt.slug) && (
                      <Check className="h-[11px] w-[11px] text-[#F9F7F2]" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-[12px] text-[#3A3040] transition-colors group-hover:text-[#1A0B2E]">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case "price":
        return (
          <div key={section.id} className="pb-6 mb-6 border-b border-[#E0DBD0]/50 last:border-b-0">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.8px] mb-3">
              {section.label}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min"
                className="w-0 flex-1 bg-white border border-[#E0DBD0] rounded-[8px] px-[9px] py-[7px] text-[12px] font-medium text-[#334155] text-center focus:outline-none focus:border-[#1A0B2E]"
              />
              <span className="text-[12px] text-[#64748B] shrink-0">—</span>
              <input
                type="text"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Max"
                className="w-0 flex-1 bg-white border border-[#E0DBD0] rounded-[8px] px-[9px] py-[7px] text-[12px] font-medium text-[#334155] text-center focus:outline-none focus:border-[#1A0B2E]"
              />
            </div>
          </div>
        );

      case "amenities":
        return (
          <div key={section.id} className="pb-6 mb-6 border-b border-[#E0DBD0]/50 last:border-b-0">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.8px] mb-3">
              {section.label}
            </div>
            <div className="flex flex-col gap-[8px]">
              {AMENITY_OPTIONS.map((a) => (
                <label
                  key={a}
                  className="flex items-center gap-2 cursor-pointer group select-none"
                  onClick={() =>
                    setSelectedAmenities((prev) =>
                      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
                    )
                  }
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-[4px] border border-[#E0DBD0] bg-white shrink-0 flex items-center justify-center transition-colors group-hover:border-[#1A0B2E]",
                      selectedAmenities.includes(a) && "bg-[#1A0B2E] border-[#1A0B2E]",
                    )}
                  >
                    {selectedAmenities.includes(a) && (
                      <Check className="h-[11px] w-[11px] text-[#F9F7F2]" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-[12px] text-[#3A3040] transition-colors group-hover:text-[#1A0B2E]">
                    {a}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case "distance":
        return (
          <div key={section.id} className="pb-6 mb-6 border-b border-[#E0DBD0]/50 last:border-b-0">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.8px] mb-3">
              {section.label}
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {DISTANCE_PILLS.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDistance(selectedDistance === d ? "" : d)}
                  className={cn(
                    "px-[10px] py-[5px] rounded-[20px] text-[11px] border transition-colors",
                    selectedDistance === d
                      ? "bg-[#1A0B2E] border-[#1A0B2E] text-[#F9F7F2]"
                      : "bg-white border-[#E0DBD0] text-[#1A0B2E] hover:border-[#1A0B2E]/40",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        );

      case "operator":
        return (
          <div key={section.id} className="mb-6">
            <div className="text-[11px] font-medium text-[#64748B] uppercase tracking-[0.8px] mb-3">
              {section.label}
            </div>
            <div className="text-[12px] text-[#64748B] italic">
              Filter by bus operator (coming soon)
            </div>
          </div>
        );

      case "duration":
        return (
          <div key={section.id} className="mb-6">
            <div className="text-[11px] font-medium text-[#64748B] uppercase tracking-[0.8px] mb-3">
              {section.label}
            </div>
            <div className="text-[12px] text-[#64748B] italic">
              Filter by tour duration (coming soon)
            </div>
          </div>
        );

      case "property-type": {
        const options = getPropertyTypeOptions();
        return (
          <div key={section.id} className="pb-6 mb-6 border-b border-[#E0DBD0]/50 last:border-b-0">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.8px] mb-3">
              {section.label}
            </div>
            <div className="flex flex-col gap-[8px]">
              {options.map((opt) => (
                <label
                  key={opt.slug}
                  className="flex items-center gap-2 cursor-pointer group select-none"
                  onClick={() => togglePropertyType(opt.slug)}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-[4px] border border-[#E0DBD0] bg-white shrink-0 flex items-center justify-center transition-colors group-hover:border-[#1A0B2E]",
                      selectedPropertyTypes.includes(opt.slug) && "bg-[#1A0B2E] border-[#1A0B2E]",
                    )}
                  >
                    {selectedPropertyTypes.includes(opt.slug) && (
                      <Check className="h-[11px] w-[11px] text-[#F9F7F2]" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-[12px] text-[#3A3040] flex-1 transition-colors group-hover:text-[#1A0B2E]">
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-[#64748B]">{opt.count}</span>
                </label>
              ))}
            </div>
          </div>
        );
      }

      case "review-score": {
        const options = getReviewScoreOptions();
        return (
          <div key={section.id} className="pb-6 mb-6 border-b border-[#E0DBD0]/50 last:border-b-0">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.8px] mb-3">
              {section.label}
            </div>
            <div className="flex flex-col gap-[8px]">
              {options.map((opt) => (
                <label
                  key={opt.slug}
                  className="flex items-center gap-2 cursor-pointer group select-none"
                  onClick={() =>
                    setSelectedReviewScore(selectedReviewScore === opt.slug ? "" : opt.slug)
                  }
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-[4px] border border-[#E0DBD0] bg-white shrink-0 flex items-center justify-center transition-colors group-hover:border-[#1A0B2E]",
                      selectedReviewScore === opt.slug && "bg-[#1A0B2E] border-[#1A0B2E]",
                    )}
                  >
                    {selectedReviewScore === opt.slug && (
                      <Check className="h-[11px] w-[11px] text-[#F9F7F2]" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-[12px] text-[#3A3040] flex-1 transition-colors group-hover:text-[#1A0B2E]">
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-[#64748B]">{opt.count}</span>
                </label>
              ))}
            </div>
          </div>
        );
      }

      case "distance-centre":
        return (
          <div key={section.id} className="pb-6 mb-6 border-b border-[#E0DBD0]/50 last:border-b-0">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.8px] mb-3">
              {section.label}
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {[
                { slug: "1km", label: "Less than 1 km", count: 4 },
                { slug: "3km", label: "Less than 3 km", count: 53 },
                { slug: "5km", label: "Less than 5 km", count: 83 },
              ].map((d) => (
                <button
                  key={d.slug}
                  onClick={() =>
                    setSelectedDistanceCentre(selectedDistanceCentre === d.slug ? "" : d.slug)
                  }
                  className={cn(
                    "px-[10px] py-[5px] rounded-[20px] text-[11px] border transition-colors",
                    selectedDistanceCentre === d.slug
                      ? "bg-[#1A0B2E] border-[#1A0B2E] text-[#F9F7F2]"
                      : "bg-white border-[#E0DBD0] text-[#1A0B2E] hover:border-[#1A0B2E]/40",
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        );

      case "landmarks": {
        const options = getLandmarkOptions();
        return (
          <div key={section.id} className="pb-6 mb-6 border-b border-[#E0DBD0]/50 last:border-b-0">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.8px] mb-3">
              {section.label}
            </div>
            <div className="flex flex-col gap-[8px]">
              {options.map((opt) => (
                <label
                  key={opt.slug}
                  className="flex items-center gap-2 cursor-pointer group select-none"
                  onClick={() => toggleLandmark(opt.slug)}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-[4px] border border-[#E0DBD0] bg-white shrink-0 flex items-center justify-center transition-colors group-hover:border-[#1A0B2E]",
                      selectedLandmarks.includes(opt.slug) && "bg-[#1A0B2E] border-[#1A0B2E]",
                    )}
                  >
                    {selectedLandmarks.includes(opt.slug) && (
                      <Check className="h-[11px] w-[11px] text-[#F9F7F2]" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-[12px] text-[#3A3040] flex-1 transition-colors group-hover:text-[#1A0B2E]">
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-[#64748B]">{opt.count}</span>
                </label>
              ))}
            </div>
          </div>
        );
      }

      case "travel-group": {
        const options = getTravelGroupOptions();
        return (
          <div key={section.id} className="pb-6 mb-6 border-b border-[#E0DBD0]/50 last:border-b-0">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.8px] mb-3">
              {section.label}
            </div>
            <div className="flex flex-col gap-[8px]">
              {options.map((opt) => (
                <label
                  key={opt.slug}
                  className="flex items-center gap-2 cursor-pointer group select-none"
                  onClick={() => toggleTravelGroup(opt.slug)}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-[4px] border border-[#E0DBD0] bg-white shrink-0 flex items-center justify-center transition-colors group-hover:border-[#1A0B2E]",
                      selectedTravelGroups.includes(opt.slug) && "bg-[#1A0B2E] border-[#1A0B2E]",
                    )}
                  >
                    {selectedTravelGroups.includes(opt.slug) && (
                      <Check className="h-[11px] w-[11px] text-[#F9F7F2]" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-[12px] text-[#3A3040] flex-1 transition-colors group-hover:text-[#1A0B2E]">
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-[#64748B]">{opt.count}</span>
                </label>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  //Mobile filter bottom sheet ──
  const renderMobileFilterSheet = () => {
    if (!mobileFilterOpen) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col justify-end"
        onClick={() => setMobileFilterOpen(false)}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[rgba(28,16,48,0.55)]" />
        {/* Sheet */}
        <div
          className="relative bg-[#F9F7F2] rounded-t-[20px] px-4 pt-4 pb-8 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle — click to close */}
          <div
            className="w-9 h-1 bg-[#E0DBD0] rounded-full mx-auto mb-4 cursor-pointer"
            onClick={() => setMobileFilterOpen(false)}
          />
          {/* Title */}
          <div className="text-[15px] font-medium text-[#334155] mb-[14px]">Filter escapes</div>

          {/* Dynamic filter sections — same as desktop sidebar */}
          {activeFilters.map(renderFilterSection)}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => {
                clearFilters();
                setMobileFilterOpen(false);
              }}
              className="bg-white border border-[#E0DBD0] rounded-[10px] py-3 text-[13px] font-medium text-[#1A0B2E]"
            >
              Clear all
            </button>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="bg-[#1A0B2E] rounded-[10px] py-3 text-[13px] font-medium text-[#F9F7F2] border-none"
            >
              Show {filteredItems.length} escape{filteredItems.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    );
  };

  //Grid card renderer ──
  const renderCard = (item: UnifiedItem) => (
    <Link
      key={item.id}
      href={item.href}
      className="group block transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] bg-[#F0EAE0] rounded-xl overflow-hidden transition-shadow duration-300 group-hover:shadow-sm">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {item.badge && (
          <span className="absolute top-3 left-3 bg-[#D4AF37] text-[#111111] text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
            {item.badge}
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 backdrop-blur-md transition-colors hover:bg-black/40 z-10"
          aria-label="Save to wishlist"
        >
          <Heart className="h-4 w-4 text-white" />
        </button>
      </div>
      <div className="pt-2.5 px-0.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[14px] font-semibold text-[#334155] leading-snug line-clamp-1 flex-1">{item.name}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" strokeWidth={1.5} />
            <span className="text-[12px] font-semibold text-[#6B6258]">{item.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-baseline gap-0.5 mt-1.5">
          <span className="text-[14px] font-bold text-[#1A0B2E]">K{item.price.toLocaleString()}</span>
          <span className="text-[11px] text-[#64748B]">{item.priceLabel}</span>
        </div>
      </div>
    </Link>
  );

  //List card renderer ──
  const renderListCard = (item: UnifiedItem) => (
    <Link
      key={item.id}
      href={item.href}
      className="group flex gap-4 bg-white border border-[#E0DBD0] rounded-[14px] overflow-hidden hover:shadow-md transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative w-[200px] shrink-0 bg-[#F0EAE0]">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {item.badge && (
          <span className="absolute top-2.5 left-2.5 bg-[#D4AF37] text-[#111111] text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
            {item.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between py-4 pr-4 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-[15px] font-semibold text-[#334155] leading-snug line-clamp-1 flex-1">{item.name}</h3>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="p-1.5 rounded-full hover:bg-[#F0EAE0] transition-colors shrink-0"
              aria-label="Save to wishlist"
            >
              <Heart className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <MapPin className="h-3.5 w-3.5 text-[#64748B]" strokeWidth={1.5} />
            <span className="text-[12px] text-[#64748B] line-clamp-1">{item.location}</span>
            <span className="text-[12px] text-[#C8C3BC] mx-1">·</span>
            <span className="text-[12px] text-[#64748B]">{item.distance}</span>
          </div>
          <span className="inline-block text-[11px] font-medium text-[#64748B] bg-[#F0EAE0] px-2 py-0.5 rounded-md">
            {item.category}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" strokeWidth={1.5} />
            <span className="text-[13px] font-semibold text-[#6B6258]">{item.rating.toFixed(1)}</span>
            <span className="text-[12px] text-[#64748B]">({item.reviews})</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-[16px] font-bold text-[#1A0B2E]">K{item.price.toLocaleString()}</span>
            <span className="text-[11px] text-[#64748B]">{item.priceLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2] font-sans">
      {/*  MOBILE VIEW  */}
      <div className="md:hidden">
        <div className="bg-[#F9F7F2] px-4 pb-4 pt-6">
          <div className="text-[22px] font-display font-bold text-[#1A0B2E] mb-4">
            Search your next escape
          </div>
          <div className="flex flex-col gap-3 mb-5">
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-white border border-[#E0DBD0] rounded-xl px-4 py-3 shadow-sm focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all">
                <Search className="h-5 w-5 text-[#D4AF37]" strokeWidth={2} />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Where are you going?"
                  className="flex-1 bg-transparent text-[15px] font-medium text-[#334155] placeholder:text-[#A09898] placeholder:font-normal focus:outline-none border-none p-0"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white border border-[#E0DBD0] rounded-xl px-4 py-3 shadow-sm flex items-center justify-center focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    variant="compact"
                    className="w-full text-center text-[14px]"
                  />
                </div>
                <div className="flex items-center justify-center gap-2 bg-white border border-[#E0DBD0] rounded-xl px-4 py-3 shadow-sm w-[110px] shrink-0 focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all">
                  <Users className="h-[18px] w-[18px] text-[#D4AF37]" />
                  <input
                    type="number"
                    min={1}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Math.max(1, Number(e.target.value)))}
                    className="w-8 bg-transparent text-[15px] font-medium text-[#334155] focus:outline-none text-center p-0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="w-[48px] h-[48px] rounded-xl bg-[#1A0B2E] flex items-center justify-center shrink-0 shadow-md transition-transform active:scale-95 hover:bg-[#2E1A4E]"
                  aria-label="Open Filters"
                >
                  <SlidersHorizontal className="h-[22px] w-[22px] text-[#F9F7F2]" strokeWidth={1.5} />
                </button>
              </div>
            </form>
          </div>

          {/* Categories Navigation (Mobile) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full border whitespace-nowrap transition-all duration-200 shrink-0 shadow-sm",
                  activeCategory === cat.slug
                    ? "bg-[#1A0B2E] border-[#1A0B2E] text-[#D4AF37]"
                    : "bg-white border-[#E0DBD0] text-[#64748B] hover:border-[#D4AF37]/40 hover:text-[#1A0B2E]"
                )}
              >
                {cat.icon}
                <span className={cn("text-[13px] font-semibold", activeCategory === cat.slug ? "text-white" : "text-[#334155]")}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>



        <div className="flex items-center justify-between px-4 py-2">
          <div className="text-[12px] text-[#64748B]">
            {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} found
          </div>
          <div className="flex items-center gap-1">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-[12px] text-[#1A0B2E] font-medium bg-transparent border-none focus:outline-none cursor-pointer appearance-none pr-4"
              style={{ backgroundImage: "none" }}
            >
              <option value="recommended">Best value</option>
              <option value="price-low">Price: Low</option>
              <option value="price-high">Price: High</option>
              <option value="rating">Top rated</option>
            </select>
            <ChevronDown className="h-3 w-3 text-[#1A0B2E]" strokeWidth={2} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 px-4 pb-4">
          {filteredItems.slice(0, 12).map((item) => renderCard(item))}
        </div>

        {filteredItems.length > 12 && (
          <button className="mx-4 mb-4 border border-[#E0DBD0] rounded-[10px] py-3 text-center text-[13px] font-medium text-[#1A0B2E] bg-white w-[calc(100%-32px)]">
            Load more escapes
          </button>
        )}

        {filteredItems.length === 0 && (
          <div className="px-4 pb-8 text-center">
            <div className="text-[15px] font-medium text-[#1A0B2E] mb-1">No results found</div>
            <div className="text-[12px] text-[#64748B] mb-3">Try adjusting your filters</div>
            <button
              onClick={clearFilters}
              className="text-[12px] font-medium text-[#D4AF37] underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {renderMobileFilterSheet()}

      {/*  DESKTOP VIEW  */}
      <div className="hidden md:block">
        <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-20 flex flex-col gap-8">
          {/* Top search bar aligned with main grid */}
          <div>
            <form
              onSubmit={handleSearch}
              className="bg-white border border-[#E0DBD0] rounded-[12px] px-5 py-4 flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-[2] flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#1A0B2E] shrink-0" strokeWidth={1.5} />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search stays, experiences, transport & more in Zambia"
                  className="flex-1 text-[13px] font-medium text-[#334155] bg-transparent border-none p-0 focus:outline-none placeholder:text-[#A09898]"
                />
              </div>
              <div className="h-5 w-px bg-[#E0DBD0]" />
              <div className="hidden lg:flex items-center flex-1 min-w-0">
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  variant="compact"
                  className="w-full"
                />
              </div>
              <div className="h-5 w-px bg-[#E0DBD0]" />
              <div className="flex items-center gap-2 text-[13px] text-[#64748B] whitespace-nowrap">
                <Users className="h-4 w-4 text-[#1A0B2E] shrink-0" strokeWidth={1.5} />
                <input
                  type="number"
                  min={1}
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Math.max(1, Number(e.target.value)))}
                  className="w-8 bg-transparent text-[13px] text-[#64748B] focus:outline-none p-0 hidden lg:block"
                />
                <span className="hidden lg:inline text-[#64748B]">guests</span>
              </div>
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#d5b069] text-[#111111] rounded-[9px] px-4 py-[9px] text-[13px] font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
              >
                <Search className="h-3.5 w-3.5" strokeWidth={2} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>
          </div>

          {/* Categories Navigation (Desktop) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-[#E0DBD0]/50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-200 shrink-0 shadow-sm",
                  activeCategory === cat.slug
                    ? "bg-[#1A0B2E] border-[#1A0B2E] text-[#D4AF37]"
                    : "bg-white border-[#E0DBD0] text-[#64748B] hover:border-[#D4AF37]/40 hover:text-[#1A0B2E]"
                )}
              >
                {cat.icon}
                <span className={cn("text-[14px] font-semibold", activeCategory === cat.slug ? "text-white" : "text-[#334155]")}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-10 items-start">
            {/* Sidebar: clean, cardless filter column */}
            <aside className="w-[260px] shrink-0 sticky top-28 self-start">
              <div className="px-1">
                <div className="text-[17px] font-semibold text-[#334155] mb-5">Filters</div>
                {activeFilters.map(renderFilterSection)}
                <div className="h-px bg-[#E0DBD0] my-5" />
                <button
                  onClick={clearFilters}
                  className="w-full bg-[#1A0B2E] rounded-[10px] py-3 text-[13px] font-medium text-[#F9F7F2] hover:bg-[#2E1A4E] transition-colors"
                >
                  Reset filters
                </button>
              </div>
            </aside>

            {/* Main Content: floating listing grid */}
            <main className="flex-1 min-w-0 flex flex-col gap-6">


              <div className="flex items-center justify-between">
                <div className="text-[14px] text-[#64748B]">
                  <span className="font-semibold text-[#1A0B2E]">{filteredItems.length}</span> result{filteredItems.length !== 1 ? "s" : ""} found
                  {(searchText || (dateRange?.checkIn && dateRange?.checkOut) || guestsCount > 1) && (
                    <span>
                      {" for "}
                      {searchText && <span className="font-semibold text-[#1A0B2E]">"{searchText}"</span>}
                      {searchText && ((dateRange?.checkIn && dateRange?.checkOut) || guestsCount > 1) && " · "}
                      {dateRange?.checkIn && dateRange?.checkOut && (
                        <span className="font-semibold text-[#1A0B2E]">
                          {dateRange.checkIn.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {dateRange.checkOut.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                      {dateRange?.checkIn && dateRange?.checkOut && guestsCount > 1 && " · "}
                      {guestsCount > 1 && <span className="font-semibold text-[#1A0B2E]">{guestsCount} guests</span>}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="flex items-center gap-1.5 bg-white border border-[#E0DBD0] rounded-[10px] px-4 py-[10px] text-[13px] font-medium text-[#1A0B2E] cursor-pointer focus:outline-none focus:border-[#1A0B2E]"
                    aria-label="Sort order"
                  >
                    <option value="recommended">Best value</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top rated</option>
                  </select>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "w-8 h-8 rounded-[8px] border flex items-center justify-center transition-colors",
                        viewMode === "grid"
                          ? "bg-[#1A0B2E] border-[#1A0B2E]"
                          : "bg-white border-[#E0DBD0] hover:border-[#1A0B2E]/40",
                      )}
                      aria-label="Grid view"
                    >
                      <LayoutGrid className={cn("h-4 w-4", viewMode === "grid" ? "text-[#F9F7F2]" : "text-[#64748B]")} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "w-8 h-8 rounded-[8px] border flex items-center justify-center transition-colors",
                        viewMode === "list"
                          ? "bg-[#1A0B2E] border-[#1A0B2E]"
                          : "bg-white border-[#E0DBD0] hover:border-[#1A0B2E]/40",
                      )}
                      aria-label="List view"
                    >
                      <List className={cn("h-4 w-4", viewMode === "list" ? "text-[#F9F7F2]" : "text-[#64748B]")} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
                  {filteredItems.slice(0, 12).map((item) => renderCard(item))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredItems.slice(0, 12).map((item) => renderListCard(item))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="text-[14px] text-[#64748B]">
                  Showing {Math.min(filteredItems.length, 12)} of {filteredItems.length} result
                  {filteredItems.length !== 1 ? "s" : ""}
                </div>
                <div className="flex gap-2 items-center">
                  <button className="w-10 h-10 rounded-[10px] bg-[#1A0B2E] border border-[#1A0B2E] flex items-center justify-center text-[14px] font-medium text-[#F9F7F2]">
                    1
                  </button>
                  {filteredItems.length > 12 && (
                    <>
                      <button className="w-10 h-10 rounded-[10px] bg-white border border-[#E0DBD0] flex items-center justify-center text-[14px] font-medium text-[#1A0B2E] hover:border-[#1A0B2E]/40">
                        2
                      </button>
                      <button className="w-10 h-10 rounded-[10px] bg-white border border-[#E0DBD0] flex items-center justify-center text-[14px] font-medium text-[#1A0B2E] hover:border-[#1A0B2E]/40">
                        3
                      </button>
                      <span className="h-10 rounded-[10px] bg-white border border-[#E0DBD0] flex items-center justify-center text-[14px] font-medium text-[#1A0B2E] px-4">
                        ···
                      </span>
                      <button className="w-10 h-10 rounded-[10px] bg-white border border-[#E0DBD0] flex items-center justify-center text-[14px] font-medium text-[#1A0B2E] hover:border-[#1A0B2E]/40">
                        {Math.ceil(filteredItems.length / 12)}
                      </button>
                      <button className="h-10 rounded-[10px] bg-white border border-[#E0DBD0] flex items-center justify-center text-[14px] font-medium text-[#1A0B2E] px-4 hover:border-[#1A0B2E]/40">
                        <ArrowRight className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {filteredItems.length === 0 && (
                <div className="bg-white border border-[#E0DBD0] rounded-[14px] p-12 text-center shadow-sm">
                  <div className="text-[20px] font-medium text-[#1A0B2E] mb-3">
                    No results found
                  </div>
                  <div className="text-[14px] text-[#64748B] mb-5">
                    Try adjusting your search or filters
                  </div>
                  <button
                    onClick={clearFilters}
                    className="bg-[#1A0B2E] rounded-[10px] px-6 py-3 text-[14px] font-medium text-[#F9F7F2] hover:bg-[#2E1A4E] transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
          <div className="text-[14px] font-medium text-[#1A0B2E]">Loading escapes...</div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

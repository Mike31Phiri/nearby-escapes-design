"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DirectoryTab = "tours" | "destinations" | "places" | "categories" | "attractions";

interface DirectoryItem {
  title: string;
  subtitle: string;
  href: string;
}

const DIRECTORY_DATA: Record<
  DirectoryTab,
  {
    title: string;
    items: DirectoryItem[];
  }
> = {
  tours: {
    title: "Tours in Zambia",
    items: [
      { title: "Victoria Falls", subtitle: "Guided walking tours", href: "/experiences?q=Victoria+Falls" },
      { title: "South Luangwa", subtitle: "Game drive safaris", href: "/experiences?q=South+Luangwa" },
      { title: "Kafue River", subtitle: "Sunset boat cruises", href: "/experiences?q=Kafue" },
      { title: "Lake Kariba", subtitle: "Catamaran boat tours", href: "/experiences?q=Lake+Kariba" },
      { title: "Lower Zambezi", subtitle: "Canoe safari expeditions", href: "/experiences?q=Lower+Zambezi" },
      { title: "Lusaka City", subtitle: "Cultural heritage tours", href: "/experiences?q=Lusaka" },
      { title: "Devil's Pool", subtitle: "Livingstone island swim", href: "/experiences?q=Devil%27s+Pool" },
      { title: "Batoka Gorge", subtitle: "Whitewater rafting", href: "/experiences?q=Rafting" },
      { title: "Bangweulu", subtitle: "Shoebill birding safaris", href: "/experiences?q=Bangweulu" },
      { title: "Siavonga", subtitle: "Houseboat fishing trips", href: "/experiences?q=Siavonga" },
      { title: "Mukuni Village", subtitle: "Cultural experiences", href: "/experiences?q=Mukuni" },
      { title: "Munda Wanga", subtitle: "Botanical sanctuary tours", href: "/experiences?q=Munda+Wanga" },
      { title: "Livingstone", subtitle: "Helicopter scenic flights", href: "/experiences?q=Helicopter" },
      { title: "Kafue Wilderness", subtitle: "Wildlife tracking trails", href: "/experiences?q=Kafue" },
      { title: "Chipata & Luangwa", subtitle: "Highway route transfers", href: "/transport?q=Chipata" },
      { title: "Chisimba Falls", subtitle: "Kasama day excursions", href: "/experiences?q=Chisimba" },
      { title: "Ndola", subtitle: "Copperbelt heritage trails", href: "/experiences?q=Ndola" },
      { title: "Blue Lagoon", subtitle: "Birdwatching safaris", href: "/experiences?q=Blue+Lagoon" },
      { title: "Livingstone Gorge", subtitle: "Swing & tandem zipline", href: "/experiences?q=Gorge+Swing" },
      { title: "Victoria Falls", subtitle: "Microlight scenic flights", href: "/experiences?q=Microlight" },
    ],
  },
  destinations: {
    title: "Popular destinations",
    items: [
      { title: "Livingstone", subtitle: "Tours, falls & stays", href: "/explore/southern/livingstone" },
      { title: "Lusaka", subtitle: "City breaks & boutiques", href: "/explore/lusaka" },
      { title: "South Luangwa", subtitle: "Safari bush camps", href: "/explore/eastern" },
      { title: "Siavonga", subtitle: "Lake Kariba villas", href: "/explore/southern/kariba" },
      { title: "Kafue National Park", subtitle: "Wilderness lodges", href: "/explore/central/kafue" },
      { title: "Lower Zambezi", subtitle: "Riverfront suites", href: "/explore/southern" },
      { title: "Mfuwe", subtitle: "Wildlife corridor retreats", href: "/explore/eastern/mfuwe" },
      { title: "Ndola", subtitle: "Urban business stays", href: "/explore/copperbelt/ndola" },
      { title: "Kitwe", subtitle: "Copperbelt hotels", href: "/explore/copperbelt/kitwe" },
      { title: "Chipata", subtitle: "Eastern gateway stays", href: "/explore/eastern/chipata" },
      { title: "Kasama", subtitle: "Northern heritage lodgings", href: "/explore" },
      { title: "Samfya", subtitle: "Lake Bangweulu beaches", href: "/explore/luapula" },
      { title: "Kabwe", subtitle: "Transit guesthouses", href: "/explore/central/kabwe" },
      { title: "Chirundu", subtitle: "Zambezi valley stops", href: "/explore/southern" },
      { title: "Monze", subtitle: "Southern farmstays", href: "/explore/southern" },
      { title: "Mazabuka", subtitle: "Countryside retreats", href: "/explore/southern" },
      { title: "Mansa", subtitle: "Luapula travel hubs", href: "/explore/luapula/mansa" },
      { title: "Solwezi", subtitle: "Northwestern getaways", href: "/explore" },
      { title: "Mongu", subtitle: "Barotseland cultural tours", href: "/explore" },
      { title: "Senanga", subtitle: "Upper Zambezi camps", href: "/explore/southern" },
    ],
  },
  places: {
    title: "Places to visit",
    items: [
      { title: "Victoria Falls", subtitle: "Livingstone Island & Falls", href: "/explore/southern/livingstone" },
      { title: "South Luangwa", subtitle: "National Park wildlife", href: "/explore/eastern" },
      { title: "Lake Kariba", subtitle: "Siavonga shoreline", href: "/explore/southern/kariba" },
      { title: "Kafue Park", subtitle: "Busanga Plains & River", href: "/explore/central/kafue" },
      { title: "Lower Zambezi", subtitle: "National Park & River", href: "/explore/southern" },
      { title: "Bangweulu", subtitle: "Wetlands & Shoebill birding", href: "/explore/luapula" },
      { title: "Lusaka National Park", subtitle: "Elephant sanctuary", href: "/explore/lusaka" },
      { title: "Chisimba Falls", subtitle: "Heritage nature reserve", href: "/explore" },
      { title: "Blue Lagoon", subtitle: "Kafue flats birdlife", href: "/explore/central" },
      { title: "Lochinvar Park", subtitle: "Chunga Lagoon safaris", href: "/explore/southern" },
      { title: "Kalambo Falls", subtitle: "Lake Tanganyika cliff", href: "/explore" },
      { title: "Kundalila Falls", subtitle: "Mkushi Escarpment cascade", href: "/explore/central" },
      { title: "Mukuni Village", subtitle: "Traditional royal village", href: "/explore/southern/livingstone" },
      { title: "Samfya Beach", subtitle: "White sand lakeside", href: "/explore/luapula" },
      { title: "Chimfunshi", subtitle: "Chimpanzee sanctuary", href: "/explore/copperbelt" },
      { title: "Kabwata Village", subtitle: "Lusaka arts & crafts", href: "/explore/lusaka" },
      { title: "Lake Itezhi-Tezhi", subtitle: "Kafue river basin", href: "/explore/central/kafue" },
      { title: "Nyika Plateau", subtitle: "Highland nature reserve", href: "/explore/eastern" },
      { title: "Dag Hammarskjöld", subtitle: "Ndola historical site", href: "/explore/copperbelt/ndola" },
      { title: "Shiwa Ng'andu", subtitle: "Kapishya hot springs", href: "/explore" },
    ],
  },
  categories: {
    title: "Top attraction categories",
    items: [
      { title: "Wildlife Safaris", subtitle: "Game drives & tracking", href: "/experiences?q=Safari" },
      { title: "Victoria Falls", subtitle: "Tours & adventures", href: "/experiences?q=Victoria+Falls" },
      { title: "Lake Cruises", subtitle: "Boat charters & sunsets", href: "/experiences?q=Cruise" },
      { title: "Walking Safaris", subtitle: "Scout-guided bush walks", href: "/experiences?q=Walking+Safari" },
      { title: "Cultural Heritage", subtitle: "Tribal village tours", href: "/experiences?q=Culture" },
      { title: "Whitewater Rafting", subtitle: "Zambezi rapids & gorge", href: "/experiences?q=Rafting" },
      { title: "Zambian Culinary", subtitle: "Local food & dining trails", href: "/experiences?q=Food" },
      { title: "Scenic Flights", subtitle: "Helicopters & microlights", href: "/experiences?q=Flight" },
      { title: "Park Glamping", subtitle: "Luxury canvas retreats", href: "/stays?q=Camp" },
      { title: "Birdwatching", subtitle: "Wetlands bird expeditions", href: "/experiences?q=Birding" },
      { title: "River Canoeing", subtitle: "Zambezi kayak adventures", href: "/experiences?q=Canoe" },
      { title: "Family Lodges", subtitle: "Kid-friendly safari stays", href: "/stays?q=Family" },
      { title: "Romantic Escapes", subtitle: "Honeymoon suites & villas", href: "/stays?q=Romantic" },
      { title: "Intercity Coaches", subtitle: "Reliable bus connections", href: "/transport" },
      { title: "Airport Shuttles", subtitle: "Private vehicle transfers", href: "/transport?q=Transfer" },
      { title: "Eco-Lodges", subtitle: "Conservation stays", href: "/stays?q=Eco" },
      { title: "Sport Fishing", subtitle: "Tigerfish & bream charters", href: "/experiences?q=Fishing" },
      { title: "National Museums", subtitle: "Monuments & heritage", href: "/explore" },
      { title: "Photo Safaris", subtitle: "Wildlife photography", href: "/experiences?q=Photography" },
      { title: "Getaway Packages", subtitle: "Curated weekend escapes", href: "/packages" },
    ],
  },
  attractions: {
    title: "Popular attractions",
    items: [
      { title: "Victoria Falls", subtitle: "Mosi-oa-Tunya waterfall", href: "/explore/southern/livingstone" },
      { title: "South Luangwa", subtitle: "Walking safari valley", href: "/explore/eastern/mfuwe" },
      { title: "Devil's Pool", subtitle: "Livingstone Island rim", href: "/explore/southern/livingstone" },
      { title: "Lake Kariba", subtitle: "Kariba dam & lake", href: "/explore/southern/kariba" },
      { title: "Lower Zambezi", subtitle: "Pristine river park", href: "/explore/southern" },
      { title: "Busanga Plains", subtitle: "Seasonal wildlife plains", href: "/explore/central/kafue" },
      { title: "Bangweulu Swamps", subtitle: "Shoebill bird wetlands", href: "/explore/luapula/mansa" },
      { title: "Lusaka Museum", subtitle: "National history & art", href: "/explore/lusaka/lusaka-cbd" },
      { title: "Luangwa River", subtitle: "Hippo & wildlife haven", href: "/explore/eastern/mfuwe" },
      { title: "Mukuni Sanctuary", subtitle: "Big cat reserve", href: "/explore/southern/livingstone" },
      { title: "Chisimba Falls", subtitle: "Kasama sacred cascades", href: "/explore" },
      { title: "Blue Lagoon", subtitle: "Kafue flats bird sanctuary", href: "/explore/central" },
      { title: "Railway Museum", subtitle: "Livingstone steam heritage", href: "/explore/southern/livingstone" },
      { title: "Dag Hammarskjöld", subtitle: "Ndola UNESCO monument", href: "/explore/copperbelt/ndola" },
      { title: "Munda Wanga", subtitle: "Botanical wildlife reserve", href: "/explore/lusaka/lusaka-cbd" },
      { title: "Kabwata Village", subtitle: "Craft market & culture", href: "/explore/lusaka" },
      { title: "Kalambo Falls", subtitle: "Lake Tanganyika precipice", href: "/explore" },
      { title: "Chimfunshi", subtitle: "Chimpanzee refuge", href: "/explore/copperbelt" },
      { title: "Kundalila Falls", subtitle: "Central Province cascade", href: "/explore/central" },
      { title: "Lochinvar Park", subtitle: "Lakeside lechwe plains", href: "/explore/southern" },
    ],
  },
};

const TABS: { id: DirectoryTab; label: string }[] = [
  { id: "tours", label: "Tours in Zambia" },
  { id: "destinations", label: "Popular destinations" },
  { id: "places", label: "Places to visit" },
  { id: "categories", label: "Top attraction categories" },
  { id: "attractions", label: "Popular attractions" },
];

export function DiscoveryDirectory() {
  const [activeTab, setActiveTab] = useState<DirectoryTab>("tours");
  const [isExpanded, setIsExpanded] = useState(false);

  const currentData = DIRECTORY_DATA[activeTab];
  const items = currentData.items;
  const visibleItems = isExpanded ? items : items.slice(0, 18);

  return (
    <section
      aria-label="Popular travel directory and search tags"
      className="border-t border-purple/10 bg-[#f8f5fc] py-12 md:py-16 transition-colors"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 font-display">
            Inspiration for future getaways
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Explore curated stays, adventures, and top destinations across Zambia
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-purple/15">
          <nav
            className="flex items-center gap-6 md:gap-8 overflow-x-auto scrollbar-hide -mb-[1px]"
            aria-label="Directory Categories"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsExpanded(false);
                }}
                className={cn(
                  "pb-3 text-sm md:text-[15px] transition-all whitespace-nowrap cursor-pointer border-b-2 font-medium",
                  activeTab === tab.id
                    ? "border-purple text-purple font-semibold"
                    : "border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300",
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Responsive Grid with Clean Title + Subtitle Hierarchy */}
        <div className="pt-7">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-5">
            {visibleItems.map((item) => (
              <Link
                key={item.title + item.subtitle}
                href={item.href}
                className="group flex flex-col text-left py-0.5 transition-colors focus:outline-none"
              >
                <span className="text-[13.5px] md:text-sm font-semibold text-neutral-900 group-hover:text-purple transition-colors truncate">
                  {item.title}
                </span>
                <span className="text-[12px] md:text-[12.5px] text-neutral-500 group-hover:text-neutral-700 transition-colors mt-0.5 truncate">
                  {item.subtitle}
                </span>
              </Link>
            ))}
          </div>

          {/* Show more / Show less toggle */}
          {items.length > 18 && (
            <div className="mt-6 pt-2">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:text-purple transition-colors cursor-pointer"
              >
                <span>{isExpanded ? "Show less" : "Show more"}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isExpanded && "rotate-180",
                  )}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

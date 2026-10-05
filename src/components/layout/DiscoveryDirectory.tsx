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
      { title: "Livingstone", subtitle: "Tours, falls & stays", href: "/livingstone/stays" },
      { title: "Lusaka", subtitle: "City breaks & boutiques", href: "/lusaka/stays" },
      { title: "South Luangwa", subtitle: "Safari bush camps", href: "/south-luangwa/stays" },
      { title: "Siavonga", subtitle: "Lake Kariba villas", href: "/lake-kariba/stays" },
      { title: "Kafue National Park", subtitle: "Wilderness lodges", href: "/kafue-national-park/stays" },
      { title: "Lower Zambezi", subtitle: "Riverfront suites", href: "/lower-zambezi/stays" },
      { title: "Mfuwe", subtitle: "Wildlife corridor retreats", href: "/south-luangwa/stays" },
      { title: "Ndola", subtitle: "Urban business stays", href: "/ndola/stays" },
      { title: "Kitwe", subtitle: "Copperbelt hotels", href: "/kitwe/stays" },
      { title: "Chipata", subtitle: "Eastern gateway stays", href: "/chipata/stays" },
      { title: "Kasama", subtitle: "Northern heritage lodgings", href: "/kasama/stays" },
      { title: "Samfya", subtitle: "Lake Bangweulu beaches", href: "/samfya-beach/stays" },
      { title: "Kabwe", subtitle: "Transit guesthouses", href: "/kabwe/stays" },
      { title: "Chirundu", subtitle: "Zambezi valley stops", href: "/stays?q=Chirundu" },
      { title: "Monze", subtitle: "Southern farmstays", href: "/stays?q=Monze" },
      { title: "Mazabuka", subtitle: "Countryside retreats", href: "/stays?q=Mazabuka" },
      { title: "Mansa", subtitle: "Luapula travel hubs", href: "/stays?q=Mansa" },
      { title: "Solwezi", subtitle: "Northwestern getaways", href: "/stays?q=Solwezi" },
      { title: "Mongu", subtitle: "Barotseland cultural tours", href: "/stays?q=Mongu" },
      { title: "Senanga", subtitle: "Upper Zambezi camps", href: "/stays?q=Senanga" },
    ],
  },
  places: {
    title: "Places to visit",
    items: [
      { title: "Victoria Falls", subtitle: "Livingstone Island & Falls", href: "/victoria-falls/stays" },
      { title: "South Luangwa", subtitle: "National Park wildlife", href: "/south-luangwa/stays" },
      { title: "Lake Kariba", subtitle: "Siavonga shoreline", href: "/lake-kariba/stays" },
      { title: "Kafue Park", subtitle: "Busanga Plains & River", href: "/kafue-national-park/stays" },
      { title: "Lower Zambezi", subtitle: "National Park & River", href: "/lower-zambezi/stays" },
      { title: "Bangweulu", subtitle: "Wetlands & Shoebill birding", href: "/experiences?q=Bangweulu" },
      { title: "Lusaka National Park", subtitle: "Elephant sanctuary", href: "/experiences?q=Lusaka+National+Park" },
      { title: "Chisimba Falls", subtitle: "Heritage nature reserve", href: "/experiences?q=Chisimba+Falls" },
      { title: "Blue Lagoon", subtitle: "Kafue flats birdlife", href: "/experiences?q=Blue+Lagoon" },
      { title: "Lochinvar Park", subtitle: "Chunga Lagoon safaris", href: "/experiences?q=Lochinvar" },
      { title: "Kalambo Falls", subtitle: "Lake Tanganyika cliff", href: "/experiences?q=Kalambo+Falls" },
      { title: "Kundalila Falls", subtitle: "Mkushi Escarpment cascade", href: "/experiences?q=Kundalila" },
      { title: "Mukuni Village", subtitle: "Traditional royal village", href: "/experiences?q=Mukuni+Village" },
      { title: "Samfya Beach", subtitle: "White sand lakeside", href: "/samfya-beach/stays" },
      { title: "Chimfunshi", subtitle: "Chimpanzee sanctuary", href: "/experiences?q=Chimfunshi" },
      { title: "Kabwata Village", subtitle: "Lusaka arts & crafts", href: "/experiences?q=Kabwata" },
      { title: "Lake Itezhi-Tezhi", subtitle: "Kafue river basin", href: "/stays?q=Itezhi-Tezhi" },
      { title: "Nyika Plateau", subtitle: "Highland nature reserve", href: "/experiences?q=Nyika" },
      { title: "Dag Hammarskjöld", subtitle: "Ndola historical site", href: "/experiences?q=Dag+Hammarskjold" },
      { title: "Shiwa Ng'andu", subtitle: "Kapishya hot springs", href: "/experiences?q=Shiwa+Ngandu" },
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
      { title: "National Museums", subtitle: "Monuments & heritage", href: "/experiences?q=Museum" },
      { title: "Photo Safaris", subtitle: "Wildlife photography", href: "/experiences?q=Photography" },
      { title: "Getaway Packages", subtitle: "Curated weekend escapes", href: "/packages" },
    ],
  },
  attractions: {
    title: "Popular attractions",
    items: [
      { title: "Victoria Falls", subtitle: "Mosi-oa-Tunya waterfall", href: "/victoria-falls/stays" },
      { title: "South Luangwa", subtitle: "Walking safari valley", href: "/south-luangwa/stays" },
      { title: "Devil's Pool", subtitle: "Livingstone Island rim", href: "/experiences?q=Devil%27s+Pool" },
      { title: "Lake Kariba", subtitle: "Kariba dam & lake", href: "/lake-kariba/stays" },
      { title: "Lower Zambezi", subtitle: "Pristine river park", href: "/lower-zambezi/stays" },
      { title: "Busanga Plains", subtitle: "Seasonal wildlife plains", href: "/kafue-national-park/stays" },
      { title: "Bangweulu Swamps", subtitle: "Shoebill bird wetlands", href: "/experiences?q=Bangweulu" },
      { title: "Lusaka Museum", subtitle: "National history & art", href: "/experiences?q=Lusaka+Museum" },
      { title: "Luangwa River", subtitle: "Hippo & wildlife haven", href: "/south-luangwa/stays" },
      { title: "Mukuni Sanctuary", subtitle: "Big cat reserve", href: "/experiences?q=Mukuni" },
      { title: "Chisimba Falls", subtitle: "Kasama sacred cascades", href: "/experiences?q=Chisimba" },
      { title: "Blue Lagoon", subtitle: "Kafue flats bird sanctuary", href: "/experiences?q=Blue+Lagoon" },
      { title: "Railway Museum", subtitle: "Livingstone steam heritage", href: "/experiences?q=Railway+Museum" },
      { title: "Dag Hammarskjöld", subtitle: "Ndola UNESCO monument", href: "/experiences?q=Dag+Hammarskjold" },
      { title: "Munda Wanga", subtitle: "Botanical wildlife reserve", href: "/experiences?q=Munda+Wanga" },
      { title: "Kabwata Village", subtitle: "Craft market & culture", href: "/experiences?q=Kabwata" },
      { title: "Kalambo Falls", subtitle: "Lake Tanganyika precipice", href: "/experiences?q=Kalambo" },
      { title: "Chimfunshi", subtitle: "Chimpanzee refuge", href: "/experiences?q=Chimfunshi" },
      { title: "Kundalila Falls", subtitle: "Central Province cascade", href: "/experiences?q=Kundalila" },
      { title: "Lochinvar Park", subtitle: "Lakeside lechwe plains", href: "/experiences?q=Lochinvar" },
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
            Exploration directory for all your needs
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

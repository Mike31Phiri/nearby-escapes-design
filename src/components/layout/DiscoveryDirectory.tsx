"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type DirectoryTab = "tours" | "destinations" | "places" | "categories" | "attractions";

interface DirectoryItem {
  label: string;
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
      { label: "Victoria Falls guided walking tours", href: "/experiences?q=Victoria+Falls" },
      { label: "South Luangwa game drive safaris", href: "/experiences?q=South+Luangwa" },
      { label: "Kafue River boat cruises", href: "/experiences?q=Kafue" },
      { label: "Lake Kariba sunset catamaran tours", href: "/experiences?q=Lake+Kariba" },
      { label: "Lower Zambezi canoe safari expeditions", href: "/experiences?q=Lower+Zambezi" },
      { label: "Lusaka cultural city day tours", href: "/experiences?q=Lusaka" },
      { label: "Devil's Pool Livingstone excursions", href: "/experiences?q=Devil%27s+Pool" },
      { label: "Batoka Gorge whitewater rafting", href: "/experiences?q=Rafting" },
      { label: "Bangweulu Wetlands shoebill birding", href: "/experiences?q=Bangweulu" },
      { label: "Siavonga houseboat fishing trips", href: "/experiences?q=Siavonga" },
      { label: "Mukuni Village cultural experiences", href: "/experiences?q=Mukuni" },
      { label: "Munda Wanga botanical park visits", href: "/experiences?q=Munda+Wanga" },
      { label: "Livingstone helicopter scenic flights", href: "/experiences?q=Helicopter" },
      { label: "Kafue wilderness wildlife tracking", href: "/experiences?q=Kafue" },
      { label: "Chipata & Luangwa highway transfers", href: "/transport?q=Chipata" },
      { label: "Chisimba Falls Kasama day tours", href: "/experiences?q=Chisimba" },
      { label: "Ndola Copperbelt heritage trails", href: "/experiences?q=Ndola" },
      { label: "Blue Lagoon birdwatching safaris", href: "/experiences?q=Blue+Lagoon" },
      { label: "Livingstone gorge swing & tandem zipline", href: "/experiences?q=Gorge+Swing" },
      { label: "Victoria Falls Microlight flights", href: "/experiences?q=Microlight" },
    ],
  },
  destinations: {
    title: "Popular destinations",
    items: [
      { label: "Livingstone tours and stays", href: "/explore/southern/livingstone" },
      { label: "Lusaka city breaks & boutique hotels", href: "/explore/lusaka" },
      { label: "South Luangwa safari camps", href: "/explore/eastern" },
      { label: "Siavonga & Lake Kariba villas", href: "/explore/southern/kariba" },
      { label: "Kafue National Park safari lodges", href: "/explore/central/kafue" },
      { label: "Lower Zambezi riverfront suites", href: "/explore/southern" },
      { label: "Mfuwe wildlife corridor retreats", href: "/explore/eastern/mfuwe" },
      { label: "Ndola urban business escapes", href: "/explore/copperbelt/ndola" },
      { label: "Kitwe Copperbelt accommodations", href: "/explore/copperbelt/kitwe" },
      { label: "Chipata eastern gateway stays", href: "/explore/eastern/chipata" },
      { label: "Kasama northern heritage lodgings", href: "/explore" },
      { label: "Samfya Lake Bangweulu beach resorts", href: "/explore/luapula" },
      { label: "Kabwe transit guesthouses", href: "/explore/central/kabwe" },
      { label: "Chirundu Zambezi valley stops", href: "/explore/southern" },
      { label: "Monze southern farmstays", href: "/explore/southern" },
      { label: "Mazabuka countryside retreats", href: "/explore/southern" },
      { label: "Mansa Luapula travel hubs", href: "/explore/luapula/mansa" },
      { label: "Solwezi northwestern getaways", href: "/explore" },
      { label: "Mongu & Barotseland tours", href: "/explore" },
      { label: "Senanga upper Zambezi camps", href: "/explore/southern" },
    ],
  },
  places: {
    title: "Places to visit",
    items: [
      { label: "Victoria Falls & Livingstone Island", href: "/explore/southern/livingstone" },
      { label: "South Luangwa National Park", href: "/explore/eastern" },
      { label: "Lake Kariba & Siavonga Shoreline", href: "/explore/southern/kariba" },
      { label: "Kafue National Park & Busanga Plains", href: "/explore/central/kafue" },
      { label: "Lower Zambezi National Park & River", href: "/explore/southern" },
      { label: "Bangweulu Wetlands & Shoebill Swamps", href: "/explore/luapula" },
      { label: "Lusaka National Park & Elephant Orphanage", href: "/explore/lusaka" },
      { label: "Chisimba Waterfalls & Heritage Reserve", href: "/explore" },
      { label: "Blue Lagoon National Park", href: "/explore/central" },
      { label: "Lochinvar National Park & Chunga Lagoon", href: "/explore/southern" },
      { label: "Kalambo Falls Lake Tanganyika", href: "/explore" },
      { label: "Kundalila Falls & Mkushi Escarpment", href: "/explore/central" },
      { label: "Mukuni Cultural Heritage Village", href: "/explore/southern/livingstone" },
      { label: "Samfya Beach Lake Bangweulu", href: "/explore/luapula" },
      { label: "Chimfunshi Wildlife Sanctuary", href: "/explore/copperbelt" },
      { label: "Kabwata Cultural Village Lusaka", href: "/explore/lusaka" },
      { label: "Lake Itezhi-Tezhi & Kafue River Basin", href: "/explore/central/kafue" },
      { label: "Nyika Plateau National Park", href: "/explore/eastern" },
      { label: "Dag Hammarskjöld Memorial Site", href: "/explore/copperbelt/ndola" },
      { label: "Shiwa Ng'andu & Kapishya Hot Springs", href: "/explore" },
    ],
  },
  categories: {
    title: "Top attraction categories",
    items: [
      { label: "Wildlife safaris and game drives", href: "/experiences?q=Safari" },
      { label: "Victoria Falls tours and adventures", href: "/experiences?q=Victoria+Falls" },
      { label: "Lake Kariba cruises and boat charters", href: "/experiences?q=Cruise" },
      { label: "Walking safaris with licensed scouts", href: "/experiences?q=Walking+Safari" },
      { label: "Cultural heritage and tribal village tours", href: "/experiences?q=Culture" },
      { label: "Whitewater rafting and river rapids", href: "/experiences?q=Rafting" },
      { label: "Traditional Zambian culinary trails", href: "/experiences?q=Food" },
      { label: "Scenic helicopter and microlight flights", href: "/experiences?q=Flight" },
      { label: "National park camping and luxury glamping", href: "/stays?q=Camp" },
      { label: "Birdwatching and wetlands expeditions", href: "/experiences?q=Birding" },
      { label: "Zambezi River canoeing and kayaking", href: "/experiences?q=Canoe" },
      { label: "Family-friendly safari lodges", href: "/stays?q=Family" },
      { label: "Honeymoon suites and romantic escapes", href: "/stays?q=Romantic" },
      { label: "Intercity coach and bus connections", href: "/transport" },
      { label: "Private airport shuttles and transfers", href: "/transport?q=Transfer" },
      { label: "Eco-lodges and conservation retreats", href: "/stays?q=Eco" },
      { label: "Tigerfish and bream sport fishing", href: "/experiences?q=Fishing" },
      { label: "Historical museums and national monuments", href: "/explore" },
      { label: "Wildlife photography safari workshops", href: "/experiences?q=Photography" },
      { label: "All-inclusive weekend getaway packages", href: "/packages" },
    ],
  },
  attractions: {
    title: "Popular attractions",
    items: [
      { label: "Victoria Falls (Mosi-oa-Tunya)", href: "/explore/southern/livingstone" },
      { label: "South Luangwa National Park", href: "/explore/eastern/mfuwe" },
      { label: "Devil's Pool & Livingstone Island", href: "/explore/southern/livingstone" },
      { label: "Lake Kariba & Kariba Dam Wall", href: "/explore/southern/kariba" },
      { label: "Lower Zambezi National Park", href: "/explore/southern" },
      { label: "Kafue National Park & Busanga Plains", href: "/explore/central/kafue" },
      { label: "Bangweulu Wetlands & Swamps", href: "/explore/luapula/mansa" },
      { label: "Lusaka National Museum", href: "/explore/lusaka/lusaka-cbd" },
      { label: "Luangwa River Wildlife Reserve", href: "/explore/eastern/mfuwe" },
      { label: "Mukuni Big Cat Sanctuary", href: "/explore/southern/livingstone" },
      { label: "Chisimba Waterfalls Kasama", href: "/explore" },
      { label: "Blue Lagoon National Park", href: "/explore/central" },
      { label: "Livingstone Railway Museum", href: "/explore/southern/livingstone" },
      { label: "Dag Hammarskjöld Memorial Ndola", href: "/explore/copperbelt/ndola" },
      { label: "Munda Wanga Botanical Reserve", href: "/explore/lusaka/lusaka-cbd" },
      { label: "Kabwata Cultural Heritage Village", href: "/explore/lusaka" },
      { label: "Kalambo Falls Lake Tanganyika", href: "/explore" },
      { label: "Chimfunshi Chimpanzee Orphanage", href: "/explore/copperbelt" },
      { label: "Kundalila Falls Central Province", href: "/explore/central" },
      { label: "Lochinvar National Park", href: "/explore/southern" },
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

  const currentData = DIRECTORY_DATA[activeTab];

  return (
    <section
      aria-label="Popular travel directory and search tags"
      className="border-t border-purple/15 bg-[#f8f5fc] py-10 md:py-14 transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Tab Navigation */}
        <div className="border-b border-purple/10">
          <nav
            className="flex items-center gap-6 md:gap-10 overflow-x-auto scrollbar-hide -mb-[1px]"
            aria-label="Directory Categories"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-3.5 text-sm md:text-[15px] transition-all duration-150 whitespace-nowrap cursor-pointer border-b-2 font-medium",
                  activeTab === tab.id
                    ? "border-[#6b2bb8] text-[#6b2bb8] font-bold"
                    : "border-transparent text-neutral-500 hover:text-[#6b2bb8]",
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Straight Vertical Columns of Numbered Items (Invisible Boxes) */}
        <div className="mt-7">
          <ol className="grid grid-flow-row sm:grid-flow-col sm:grid-rows-10 lg:grid-rows-5 gap-x-8 lg:gap-x-12 gap-y-2.5 p-0 m-0 list-none">
            {currentData.items.map((item, idx) => (
              <li key={item.label} className="p-0 m-0">
                <Link
                  href={item.href}
                  className="group flex items-baseline gap-2 py-1 transition-colors"
                >
                  <span className="text-purple/40 group-hover:text-purple font-semibold text-xs tabular-nums w-5 text-right shrink-0 select-none transition-colors">
                    {idx + 1}.
                  </span>
                  <span className="text-[13px] sm:text-[13.5px] text-neutral-700 group-hover:text-purple group-hover:underline transition-colors leading-snug line-clamp-1">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

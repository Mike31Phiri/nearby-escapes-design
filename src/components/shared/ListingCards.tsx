"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Star,
  MapPin,
  ChevronRight,
  Clock,
  Users,
  Wifi,
  Waves,
  Coffee,
  Sparkles,
  Utensils,
  Dumbbell,
  Car,
  Bus,
  ArrowRight,
} from "lucide-react";
import type { Stay, Experience, Transport } from "@/lib/mock-data";
import { categoryLabels } from "@/lib/mock-data";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-3 w-3" />,
  Pool: <Waves className="h-3 w-3" />,
  Breakfast: <Coffee className="h-3 w-3" />,
  Spa: <Sparkles className="h-3 w-3" />,
  "Guided Tours": <MapPin className="h-3 w-3" />,
  Restaurant: <Utensils className="h-3 w-3" />,
  Gym: <Dumbbell className="h-3 w-3" />,
  "Airport Pickup": <Car className="h-3 w-3" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  wildlife: "from-amber-900/80",
  farm: "from-green-900/80",
  cultural: "from-purple-900/80",
  adventure: "from-orange-900/80",
  water: "from-blue-900/80",
  industrial: "from-slate-900/80",
  general: "from-neutral-900/80",
};

export function StayCard({ stay }: { stay: Stay }) {
  const visibleAmenities = stay.amenities.slice(0, 3);
  const extraCount = stay.amenities.length - 3;

  return (
    <Link
      href={`/stays/${stay.id}`}
      className="group block bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={stay.image}
          alt={stay.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-neutral-800 text-[11px] font-medium px-2.5 py-1 rounded-full shadow-2xs">
          {stay.type}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i <= Math.floor(stay.rating)
                    ? "fill-[#f2ba0d] text-[#f2ba0d]"
                    : "fill-neutral-200 text-neutral-200",
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-neutral-900 ml-0.5">{stay.rating}</span>
          <span className="text-xs text-neutral-400">({stay.reviews})</span>
        </div>

        <h3 className="font-semibold text-sm md:text-base text-neutral-900 line-clamp-1 group-hover:text-purple transition-colors leading-tight">
          {stay.name}
        </h3>

        <p className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          <span className="truncate">{stay.location}</span>
        </p>

        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {visibleAmenities.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 text-[10px] text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-full px-2 py-0.5 font-medium"
            >
              {AMENITY_ICONS[a] ?? <Sparkles className="h-2.5 w-2.5" />}
              {a}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-[10px] text-neutral-400 font-medium">+{extraCount}</span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-semibold text-neutral-900">K{stay.price}</span>
            <span className="text-xs text-neutral-500 font-normal">/ night</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-purple group-hover:text-purple-hover transition-colors">
            View Stay <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ExperienceCard({ exp }: { exp: Experience }) {
  const label = categoryLabels[exp.category] ?? "Experience";
  const gradientFrom = CATEGORY_COLORS[exp.category] ?? "from-neutral-900/80";

  return (
    <Link
      href={`/experiences/${exp.id}`}
      className="group block bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={exp.image}
          alt={exp.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t",
            gradientFrom,
            "via-transparent to-transparent",
          )}
        />
        <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full font-medium backdrop-blur-sm inline-flex items-center gap-1">
          {label}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="h-3.5 w-3.5 fill-[#f2ba0d] text-[#f2ba0d]" />
          <span className="text-xs font-medium text-neutral-900">{exp.rating}</span>
          <span className="text-xs text-neutral-400">({exp.reviews})</span>
        </div>

        <h3 className="font-semibold text-sm md:text-base text-neutral-900 line-clamp-1 group-hover:text-purple transition-colors leading-tight">
          {exp.name}
        </h3>

        <p className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          <span className="truncate">{exp.location}</span>
        </p>

        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {(exp as any).duration && (
            <span className="inline-flex items-center gap-1 text-[10px] text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-full px-2 py-0.5 font-medium">
              <Clock className="h-3 w-3 text-neutral-400" />
              {(exp as any).duration}
            </span>
          )}
          {(exp as any).groupSize && (
            <span className="inline-flex items-center gap-1 text-[10px] text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-full px-2 py-0.5 font-medium">
              <Users className="h-3 w-3 text-neutral-400" />
              {(exp as any).groupSize}
            </span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-semibold text-neutral-900">K{exp.price}</span>
            <span className="text-xs text-neutral-500 font-normal">/ person</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-purple group-hover:text-purple-hover transition-colors">
            Book <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function TransportCard({ route }: { route: Transport }) {
  const isPrivate =
    route.operator.toLowerCase().includes("tour") ||
    route.operator.toLowerCase().includes("transfer");
  const isMinivan = route.id === "t3";

  const vehicleLabel = isPrivate ? "Private Car" : isMinivan ? "Minivan" : "Bus";
  const capacityLabel = isPrivate ? "Up to 4 seats" : isMinivan ? "8 seats" : "40 seats";

  return (
    <Link
      href={`/transport/${route.id}`}
      className="group block bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <img
          src={route.image}
          alt={route.from + " to " + route.to}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full font-medium backdrop-blur-sm inline-flex items-center gap-1">
          {isPrivate ? (
            <Car className="h-3 w-3 text-[#f2ba0d]" />
          ) : (
            <Bus className="h-3 w-3 text-[#f2ba0d]" />
          )}
          {vehicleLabel}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <h3 className="font-semibold text-sm md:text-base text-neutral-900 flex items-center gap-2 group-hover:text-purple transition-colors leading-tight">
            <span>{route.from}</span>
            <ArrowRight className="h-3.5 w-3.5 text-purple shrink-0" />
            <span>{route.to}</span>
          </h3>
        </div>

        <p className="text-xs text-neutral-500">
          By <span className="font-medium text-neutral-700">{route.operator}</span>
        </p>

        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[10px] text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-full px-2 py-0.5 font-medium">
            <Clock className="h-3 w-3 text-neutral-400" />
            {route.duration}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-full px-2 py-0.5 font-medium">
            <Users className="h-3 w-3 text-neutral-400" />
            {capacityLabel}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-semibold text-neutral-900">K{route.price}</span>
            <span className="text-xs text-neutral-500 font-normal">/ person</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-purple group-hover:text-purple-hover transition-colors">
            Book seat <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

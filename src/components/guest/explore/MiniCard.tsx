"use client";

import Link from "next/link";
import { Star } from "lucide-react";

// Shared card shell
function CardShell({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={[
        "group relative flex-none w-[240px]",
        "bg-white rounded-[14px] overflow-hidden",
        "border-[1.5px] border-[#1C3A2F]/07",
        "transition-all duration-200",
        "",
        "hover:border-[#1C3A2F]/20",
        "hover:shadow-[0_8px_24px_rgba(28,58,47,0.10)]",
        // Amber accent bar slides in from left on hover
        "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px]",
        "after:bg-[#E8952E] after:rounded-b-[14px]",
        "after:scale-x-0 after:origin-left after:transition-transform after:duration-250",
        "hover:after:scale-x-100",
      ].join("")}
    >
      {children}
    </Link>
  );
}

// Image block
function CardImage({
  src,
  alt,
  badge,
  badgeVariant = "amber",
  ratio = "3/2",
}: {
  src: string;
  alt: string;
  badge?: string;
  badgeVariant?: "amber" | "forest";
  ratio?: "3/2" | "4/3";
}) {
  return (
    <div className="relative overflow-hidden bg-[#E8E2D8]" style={{ aspectRatio: ratio }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />
      {badge && (
        <span
          className={[
            "absolute top-2.5 left-2.5 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm",
            badgeVariant === "amber"
              ? "bg-[#E8952E]/90 text-[#3D1F00]"
              : "bg-[#1C3A2F]/85 text-white",
          ].join("")}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

// Rating + price row
function RatingPrice({
  rating,
  price,
  priceUnit,
}: {
  rating?: number;
  price?: number;
  priceUnit?: string;
}) {
  return (
    <div className="flex items-center justify-between mt-2.5">
      {rating !== undefined ? (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-[#E8952E] text-[#E8952E]" strokeWidth={0} />
          <span className="text-[12px] font-semibold text-[#5A7A6E]">{rating.toFixed(1)}</span>
        </div>
      ) : (
        <span />
      )}
      {price !== undefined && (
        <div className="flex items-baseline gap-0.5 ml-auto">
          <span className="text-[14px] font-bold text-[#1C3A2F]">ZMW {price}</span>
          {priceUnit && <span className="text-[11px] text-[#9AB3A8] ml-0.5">{priceUnit}</span>}
        </div>
      )}
    </div>
  );
}

// MiniCard
interface MiniCardProps {
  href: string;
  image: string;
  name: string;
  location: string;
  rating?: number;
  price?: number;
  priceUnit?: string;
  badge?: string;
  badgeColor?: "gold" | "purple";
}

export function MiniCard({
  href,
  image,
  name,
  location,
  rating,
  price,
  priceUnit = "/ night",
  badge,
  badgeColor = "gold",
}: MiniCardProps) {
  return (
    <CardShell href={href} ariaLabel={`View ${name}`}>
      <CardImage
        src={image}
        alt={name}
        badge={badge}
        badgeVariant={badgeColor === "gold" ? "amber" : "forest"}
      />
      <div className="px-3.5 pt-3 pb-3.5">
        <h3 className="text-[14px] font-bold text-[#1C3A2F] leading-snug line-clamp-1">{name}</h3>
        <p className="text-[12px] text-[#9AB3A8] mt-0.5 line-clamp-1">{location}</p>
        <RatingPrice rating={rating} price={price} priceUnit={priceUnit} />
      </div>
    </CardShell>
  );
}

// TransportMiniCard
interface TransportMiniCardProps {
  id: string;
  from: string;
  to: string;
  operator: string;
  duration: string;
  departures: string;
  price: number;
  image: string;
}

export function TransportMiniCard({
  id,
  from,
  to,
  operator,
  duration,
  departures,
  price,
  image,
}: TransportMiniCardProps) {
  return (
    <CardShell href={`/transport/${id}`} ariaLabel={`Transport from ${from} to ${to}`}>
      <CardImage src={image} alt={`${from} to ${to}`} badge="🚌 Transport" badgeVariant="forest" />
      <div className="px-3.5 pt-3 pb-3.5">
        <h3 className="text-[14px] font-bold text-[#1C3A2F] leading-snug line-clamp-1 flex items-center gap-1.5">
          {from}
          <span className="text-[#E8952E] font-bold">→</span>
          {to}
        </h3>
        <p className="text-[12px] text-[#9AB3A8] mt-0.5">{operator}</p>
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[12px] text-[#7E9E95]">
            {duration} · {departures}
          </span>
          <span className="text-[14px] font-bold text-[#1C3A2F]">ZMW {price}</span>
        </div>
      </div>
    </CardShell>
  );
}

// PackageMiniCard
interface PackageMiniCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  duration: string;
}

export function PackageMiniCard({
  id,
  name,
  location,
  rating,
  price,
  image,
  duration,
}: PackageMiniCardProps) {
  return (
    <CardShell href={`/packages/${id}`} ariaLabel={`View ${name} package`}>
      <CardImage src={image} alt={name} badge="📦 Package" badgeVariant="amber" />
      <div className="px-3.5 pt-3 pb-3.5">
        <h3 className="text-[14px] font-bold text-[#1C3A2F] leading-snug line-clamp-1">{name}</h3>
        <p className="text-[12px] text-[#9AB3A8] mt-0.5 line-clamp-1">
          {location} · {duration}
        </p>
        <RatingPrice rating={rating} price={price} />
      </div>
    </CardShell>
  );
}

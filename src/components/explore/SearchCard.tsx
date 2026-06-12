import Link from "next/link";
import { Star } from "lucide-react";
import type { Stay, Transport, Experience, Package } from "@/lib/mock-data";

/* ─── SearchStayCard ─── */

interface SearchStayCardProps {
  item: Stay;
}

export function SearchStayCard({ item }: SearchStayCardProps) {
  return (
    <Link href={`/listings/stays/${item.id}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-2 bg-muted">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col py-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm tracking-tight text-foreground line-clamp-1">
            {item.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="font-semibold text-xs text-foreground">
              {item.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
          {item.location}
        </p>
        <div className="flex items-center">
          <p className="text-sm font-semibold text-foreground">
            ${item.price}
            <span className="text-xs font-normal text-muted-foreground ml-1">
              night
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ─── SearchTransportCard ─── */

interface SearchTransportCardProps {
  item: Transport;
}

export function SearchTransportCard({ item }: SearchTransportCardProps) {
  return (
    <Link href={`/listings/transport/${item.id}`} className="group block">
      <div className="relative aspect-[16/9] overflow-hidden rounded-md mb-2 bg-muted">
        <img
          src={item.image}
          alt={`${item.from} → ${item.to}`}
          loading="lazy"
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col py-1">
        <h3 className="font-bold text-sm tracking-tight text-foreground">
          {item.from} → {item.to}
        </h3>
        <p className="text-xs text-muted-foreground">{item.operator}</p>
        <p className="text-xs text-muted-foreground">
          {item.duration} · {item.departures}
        </p>
        <div className="flex items-center mt-1">
          <p className="text-sm font-semibold text-foreground">
            ${item.price}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ─── SearchExperienceCard ─── */

interface SearchExperienceCardProps {
  item: Experience;
  isGem?: boolean;
}

export function SearchExperienceCard({ item, isGem }: SearchExperienceCardProps) {
  return (
    <Link
      href={isGem ? `/gems/${item.id}` : `/listings/experiences/${item.id}`}
      className="group block"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-2 bg-muted">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col py-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm tracking-tight text-foreground line-clamp-1">
            {item.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="font-semibold text-xs text-foreground">
              {item.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
          {item.location}
        </p>
        <div className="flex items-center">
          <p className="text-sm font-semibold text-foreground">
            ${item.price}
            <span className="text-xs font-normal text-muted-foreground ml-1">
              /pp
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ─── SearchPackageCard ─── */

interface SearchPackageCardProps {
  item: Package;
}

export function SearchPackageCard({ item }: SearchPackageCardProps) {
  return (
    <Link href={`/packages/${item.id}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-2 bg-muted">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col py-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm tracking-tight text-foreground line-clamp-1">
            {item.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="font-semibold text-xs text-foreground">
              {item.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-1">
          {item.location} · {item.duration}
        </p>
        <div className="flex items-center">
          <p className="text-sm font-semibold text-foreground">
            ${item.price}
          </p>
        </div>
      </div>
    </Link>
  );
}

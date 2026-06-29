"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Star,
  MapPin,
  Clock,
  Users,
  Flame,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ExperienceListing } from "@/types/listing";
import { Button } from "@/components/ui/button";

interface ExperienceDetailPageProps {
  experience: ExperienceListing & any;
  backHref?: string;
}

export function ExperienceDetailPage({
  experience,
  backHref = "/experiences",
}: ExperienceDetailPageProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const images = experience.images?.length
    ? experience.images
    : [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
      ];
  const title = experience.title || experience.name;
  const priceDisplay = (experience.pricePerAdultNgwee || experience.pricePerPerson || 0) / 100;
  const locationString =
    typeof experience.location === "object"
      ? `${experience.location.city}, ${experience.location.province}`
      : experience.location;

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (!isFavorited) toast.success("Saved to collections");
  };

  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));
  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans pb-20 md:pb-0">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
          <Link
            href={backHref}
            className="hover:text-amber-600 transition-colors font-medium flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-muted-foreground">Experiences</span>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-foreground font-semibold truncate max-w-[200px]">{title}</span>
        </div>

        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full">
                {experience.category || experience.activityType || "Experience"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-foreground mb-1.5">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <strong className="text-foreground">{experience.rating || "New"}</strong>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground/60" />
                {locationString}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toast.success("Link copied")}
              className="h-9 w-9 rounded-xl border border-border/60 flex items-center justify-center hover:bg-muted shadow-sm"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className={cn(
                "h-9 w-9 rounded-xl border shadow-sm flex items-center justify-center",
                isFavorited
                  ? "border-amber-600/30 bg-amber-50 text-amber-600"
                  : "border-border/60 hover:bg-muted",
              )}
            >
              <Heart className={cn("h-4 w-4", isFavorited && "fill-amber-600")} />
            </button>
          </div>
        </div>

        {/* Gallery Mobile */}
        <div className="md:hidden relative rounded-2xl overflow-hidden aspect-[4/3] mb-8">
          <img src={images[activeImg]} alt={title} className="h-full w-full object-cover" />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Desktop Gallery */}
        <div
          className="hidden md:block relative h-[400px] mb-8 rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => setShowAllPhotos(true)}
        >
          <img src={images[0]} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          <div className="space-y-10">
            {/* Quick Facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-y border-border/40">
              <div className="bg-card border border-border/60 rounded-xl p-3.5 flex flex-col gap-1">
                <Clock className="h-5 w-5 text-amber-600" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                  Duration
                </span>
                <span className="text-xs font-bold text-foreground">
                  {experience.duration || `${experience.durationHours} hrs`}
                </span>
              </div>
              <div className="bg-card border border-border/60 rounded-xl p-3.5 flex flex-col gap-1">
                <Users className="h-5 w-5 text-amber-600" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                  Group Size
                </span>
                <span className="text-xs font-bold text-foreground">
                  Up to {experience.maxGroupSize || experience.maxParticipants || 10}
                </span>
              </div>
              <div className="bg-card border border-border/60 rounded-xl p-3.5 flex flex-col gap-1">
                <Flame className="h-5 w-5 text-amber-600" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                  Difficulty
                </span>
                <span className="text-xs font-bold text-foreground">
                  {experience.difficulty || experience.difficultyLevel || "Moderate"}
                </span>
              </div>
              <div className="bg-card border border-border/60 rounded-xl p-3.5 flex flex-col gap-1">
                <Info className="h-5 w-5 text-amber-600" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                  Min Age
                </span>
                <span className="text-xs font-bold text-foreground">
                  {experience.minAge ? `${experience.minAge}+` : "All Ages"}
                </span>
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-xl font-bold mb-3">About this experience</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {experience.description}
              </p>
            </section>

            {/* Inclusions */}
            {experience.whatsIncluded && experience.whatsIncluded.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-3">What&apos;s Included</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {experience.whatsIncluded.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="sticky top-24 bg-card border border-border/60 rounded-2xl p-6 shadow-xl card-shadow hidden lg:block">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-black">K{priceDisplay}</span>
              <span className="text-sm text-muted-foreground">/ person</span>
            </div>
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 text-base">
              Book Experience
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              You won&apos;t be charged yet
            </p>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setShowAllPhotos(false)}
          >
            <X className="h-8 w-8" />
          </button>
          <img src={images[0]} alt="Full view" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}
    </div>
  );
}

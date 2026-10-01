"use client";

import React, { useRef, useState } from "react";
import { Plus, Star, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SharedMediaStepProps {
  images: string[];
  submitting: boolean;
  samplePhotos?: string[];
  title?: string;
  subtitle?: string;
  onImagesChange: (images: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function SharedMediaStep({
  images,
  submitting,
  samplePhotos = [],
  title = "Photos & media",
  subtitle = "Upload clear quality or professionally taken images (up to 5 max).",
  onImagesChange,
  onBack,
  onNext,
}: SharedMediaStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 5 - images.length;
    if (availableSlots <= 0) {
      toast.info("Maximum 5 photos allowed. Remove a photo to add a new one.");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    const newImageUrls: string[] = [];

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return;
      }
      const localUrl = URL.createObjectURL(file);
      newImageUrls.push(localUrl);
    });

    if (newImageUrls.length > 0) {
      onImagesChange([...images, ...newImageUrls].slice(0, 5));
      toast.success(`Added ${newImageUrls.length} photo${newImageUrls.length > 1 ? "s" : ""}`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const availableSlots = 5 - images.length;
    if (availableSlots <= 0) {
      toast.info("Maximum 5 photos allowed.");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    const newImageUrls: string[] = [];

    filesToProcess.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const localUrl = URL.createObjectURL(file);
        newImageUrls.push(localUrl);
      }
    });

    if (newImageUrls.length > 0) {
      onImagesChange([...images, ...newImageUrls].slice(0, 5));
      toast.success(`Added ${newImageUrls.length} photo${newImageUrls.length > 1 ? "s" : ""}`);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onImagesChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetCoverPhoto = (indexToCover: number) => {
    const item = images[indexToCover];
    const rest = images.filter((_, idx) => idx !== indexToCover);
    onImagesChange([item, ...rest]);
    toast.success("Cover photo updated");
  };

  const handleLoadSamplePhotos = () => {
    if (samplePhotos.length > 0) {
      onImagesChange(samplePhotos.slice(0, 5));
      toast.success("Loaded 5 sample professional photos");
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
            {title}
          </h1>
          <p className="text-xs text-black-subtle mt-0.5">{subtitle}</p>
        </div>
        <span className="text-xs font-semibold text-purple bg-purple/10 px-2.5 py-1 rounded-full border border-purple/20">
          {images.length}/5 photos
        </span>
      </div>

      {/* Upload Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 5-Slot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
        {images.map((imgUrl, index) => {
          const isCover = index === 0;
          return (
            <div
              key={index}
              className={cn(
                "group relative aspect-4/3 rounded-xl overflow-hidden border bg-neutral-100 shadow-2xs transition-all",
                isCover ? "border-purple ring-2 ring-purple/20" : "border-neutral-200",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {isCover && (
                <div className="absolute top-1.5 left-1.5 bg-purple text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 fill-white" />
                  <span>Cover</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {!isCover && (
                  <button
                    type="button"
                    title="Make Cover Photo"
                    onClick={() => handleSetCoverPhoto(index)}
                    className="h-7 w-7 rounded-lg bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  title="Remove photo"
                  onClick={() => handleRemoveImage(index)}
                  className="h-7 w-7 rounded-lg bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty slots up to 5 */}
        {Array.from({ length: 5 - images.length }).map((_, i) => (
          <button
            key={`empty-${i}`}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-4/3 rounded-xl border border-dashed border-neutral-300 hover:border-purple/50 hover:bg-neutral-50/70 flex flex-col items-center justify-center text-neutral-400 hover:text-purple transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 mb-0.5" />
            <span className="text-[10px] font-medium">Slot #{images.length + i + 1}</span>
          </button>
        ))}
      </div>

      {/* Drag-and-drop / select bar */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (images.length < 5) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (images.length < 5 && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        className={cn(
          "border border-dashed rounded-xl py-4 px-4 text-center transition-all cursor-pointer flex items-center justify-between gap-3",
          images.length >= 5
            ? "border-neutral-200 bg-neutral-50/50 opacity-60 cursor-not-allowed"
            : isDragging
              ? "border-purple bg-purple/5"
              : "border-neutral-300 hover:border-purple/40 hover:bg-neutral-50/50",
        )}
      >
        <div className="flex items-center gap-2.5 text-left">
          <div className="h-8 w-8 rounded-lg bg-purple/10 text-purple flex items-center justify-center shrink-0">
            <UploadCloud className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-800">
              {images.length >= 5
                ? "Maximum 5 photos uploaded"
                : "Drag photos here or click to browse"}
            </p>
            <p className="text-[11px] text-neutral-400">
              Supports high-resolution JPG, PNG or WebP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {images.length === 0 && samplePhotos.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLoadSamplePhotos();
              }}
              className="h-8 px-3 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-[11px] font-semibold text-neutral-700 transition-colors cursor-pointer"
            >
              Sample photos
            </button>
          )}
          <button
            type="button"
            disabled={images.length >= 5}
            className={cn(
              "h-8 px-3.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer",
              images.length >= 5
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : "bg-purple text-white hover:bg-purple-hover",
            )}
          >
            <Plus className="h-3 w-3" />
            <span>Browse</span>
          </button>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto h-11 px-6 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
        >
          Back
        </button>

        <button
          type="button"
          disabled={images.length === 0 || submitting}
          onClick={onNext}
          className={cn(
            "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
            images.length > 0 && !submitting
              ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
          )}
        >
          <span>{submitting ? "Saving photos..." : "Next"}</span>
        </button>
      </div>
    </div>
  );
}

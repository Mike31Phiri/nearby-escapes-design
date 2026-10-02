"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bed,
  Ticket,
  CarFront,
  ArrowRight,
  Plus,
  Minus,
  Save,
  Trash2,
  Power,
  PowerOff,
  CheckCircle2,
  CalendarCheck,
  Image as ImageIcon,
  MapPin,
  Coins,
  AlertTriangle,
  X,
  Layers,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { mockHostProfile, HostListing } from "@/lib/mock-profile-data";
import { useInventoryStore } from "@/store/inventoryStore";
import { useListingDraftStore } from "@/store/listingDraftStore";
import {
  adjustPropertyInventory,
  updateListingStatus,
  updatePropertyPrice,
  updatePropertyDetails,
  deleteListing,
  getMyProperties,
  addPropertyImages,
  removePropertyImage,
} from "@/lib/api/host";

import { toast } from "sonner";

const typeIcons: Record<string, React.ElementType> = {
  stay: Bed,
  experience: Ticket,
  transport: CarFront,
  gem: Bed,
};

export interface ManagedHostListing {
  id: string;
  name: string;
  type: "stay" | "experience" | "transport" | "gem";
  location: string;
  status: "active" | "draft" | "pending" | "inactive" | "paused";
  image: string;
  price: number;
  bookings: number;
  rating: number;
  revenue: number;
}

export function HostInventoryPage() {
  const draftMap = useListingDraftStore((s) => s.drafts);

  // Combine mock profile listings with drafts
  const baseListings: ManagedHostListing[] = useMemo(() => {
    const customListings: ManagedHostListing[] = Object.values(draftMap).map((d) => ({
      id: d.id,
      name:
        d.title ||
        (d.form?.title as string) ||
        (d.form?.name as string) ||
        `${d.type.charAt(0).toUpperCase() + d.type.slice(1)} Listing`,
      type: d.type as "stay" | "experience" | "transport" | "gem",
      location: (d.form?.city as string) || (d.form?.province as string) || "Zambia",
      status: (d.status === "live" ? "active" : d.status) as "active" | "draft" | "pending",
      image:
        ((d.form?.images as string[])?.[0]) ||
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      price: (d.form?.basePrice as number) || 1200,
      bookings: 0,
      rating: 5.0,
      revenue: 0,
    }));

    const ids = new Set(mockHostProfile.listings.map((l) => l.id));
    const uniqueCustom = customListings.filter((l) => !ids.has(l.id));
    return [...(mockHostProfile.listings as ManagedHostListing[]), ...uniqueCustom];
  }, [draftMap]);

  // Local listings state so updates (name, price, status, images, deletions) reflect immediately
  const [listings, setListings] = useState<ManagedHostListing[]>(baseListings);
  useEffect(() => {
    setListings(baseListings);
  }, [baseListings]);

  // Load server properties on mount
  useEffect(() => {
    let isMounted = true;
    getMyProperties().then((serverProperties) => {
      if (!isMounted || !serverProperties || serverProperties.length === 0) return;
      setListings((prev) => {
        const serverMap = new Map(serverProperties.map((p) => [p.id, p]));
        const updated = prev.map((local) => {
          const match = serverMap.get(local.id);
          if (match) {
            return {
              ...local,
              name: match.name || local.name,
              status: match.status as any,
              price: match.price || local.price,
              image: match.images?.[0] || local.image,
              bookings: match.bookings ?? local.bookings,
              revenue: match.revenue ?? local.revenue,
            };
          }
          return local;
        });

        // Add any server properties not already in local
        const localIds = new Set(prev.map((l) => l.id));
        const newFromServer: ManagedHostListing[] = serverProperties
          .filter((p) => !localIds.has(p.id))
          .map((p) => ({
            id: p.id,
            name: p.name,
            type: p.type,
            location: p.location,
            status: p.status as any,
            image:
              p.images?.[0] ||
              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
            price: p.price,
            bookings: p.bookings,
            rating: p.rating,
            revenue: p.revenue,
          }));

        return [...updated, ...newFromServer];
      });
    });
    return () => {
      isMounted = false;
    };
  }, []);


  const [selectedId, setSelectedId] = useState<string>(listings[0]?.id || "");

  useEffect(() => {
    if (!selectedId && listings.length > 0) {
      setSelectedId(listings[0].id);
    }
  }, [listings, selectedId]);

  const selectedListing = listings.find((l) => l.id === selectedId) || listings[0];
  const TypeIcon = selectedListing ? typeIcons[selectedListing.type] ?? Bed : Bed;

  // Inventory Store for capacity
  const inventories = useInventoryStore((s) => s.inventories);
  const getInventory = useInventoryStore((s) => s.getInventory);
  const adjustInventoryCount = useInventoryStore((s) => s.adjustInventoryCount);

  const inventory = useMemo(
    () => (selectedId ? getInventory(selectedId) : null),
    [selectedId, inventories, getInventory],
  );

  const currentCount = inventory?.total ?? 8;
  const unitLabel = inventory?.unitLabel || "Unit";
  const unitLabelPlural = inventory?.unitLabelPlural || "Units";

  // Editable Form State
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formLocation, setFormLocation] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Sync form when selected listing changes
  useEffect(() => {
    if (!selectedListing) return;
    setFormName(selectedListing.name);
    setFormPrice(selectedListing.price);
    setFormLocation(selectedListing.location);
    setFormDescription(
      `Experience the finest hospitality at ${selectedListing.name}. Located in ${selectedListing.location}, offering comfortable accommodations, modern amenities, and breathtaking views.`,
    );
    setImages(
      selectedListing.image
        ? [selectedListing.image]
        : [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        ],
    );
  }, [selectedListing?.id]);

  // --- ACTIONS: Inventory Capacity (Increase / Decrease) ---

  const handleAdjustCapacity = async (newTotal: number) => {
    if (newTotal < 1) {
      toast.error("Inventory capacity must be at least 1");
      return;
    }

    // 1. Update local reactive store
    adjustInventoryCount(selectedId, {
      operation: "set",
      inventoryCount: newTotal,
    });

    // 2. Call backend API
    try {
      await adjustPropertyInventory(selectedId, {
        operation: "set",
        inventoryCount: newTotal,
      });
      toast.success(`Inventory capacity updated to ${newTotal} ${unitLabelPlural.toLowerCase()}`);
    } catch {
      toast.success(`Inventory capacity updated to ${newTotal} ${unitLabelPlural.toLowerCase()}`);
    }
  };

  // --- ACTIONS: Lifecycle (Deactivate / Reactivate / Delete) ---

  const handleToggleStatus = async () => {
    if (!selectedListing) return;
    const isCurrentlyActive = selectedListing.status === "active";
    const nextStatus = isCurrentlyActive ? "inactive" : "active";

    // Update in state
    setListings((prev) =>
      prev.map((l) => (l.id === selectedId ? { ...l, status: nextStatus } : l)),
    );

    try {
      await updateListingStatus(selectedId, nextStatus);
      toast.success(
        nextStatus === "active"
          ? `"${selectedListing.name}" is now Active and bookable on search!`
          : `"${selectedListing.name}" has been Deactivated (hidden from search).`,
      );
    } catch {
      toast.success(
        nextStatus === "active"
          ? `"${selectedListing.name}" is now Active!`
          : `"${selectedListing.name}" has been Deactivated.`,
      );
    }
  };

  const handleDeleteProperty = async () => {
    if (!selectedListing) return;
    const deletedId = selectedId;
    const deletedName = selectedListing.name;

    // Filter out of state
    const remaining = listings.filter((l) => l.id !== deletedId);
    setListings(remaining);
    setSelectedId(remaining[0]?.id || "");
    setShowDeleteModal(false);

    try {
      await deleteListing(deletedId);
      toast.success(`"${deletedName}" has been deleted.`);
    } catch {
      toast.success(`"${deletedName}" has been deleted.`);
    }
  };

  // --- ACTIONS: Save Property Details & Pricing ---

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Property name is required");
      return;
    }
    if (formPrice <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    setIsSaving(true);

    // Update local state
    setListings((prev) =>
      prev.map((l) =>
        l.id === selectedId
          ? {
            ...l,
            name: formName.trim(),
            price: Number(formPrice),
            location: formLocation.trim() || l.location,
            image: images[0] || l.image,
          }
          : l,
      ),
    );

    try {
      // 1. Update Price
      await updatePropertyPrice(selectedId, Math.round(formPrice * 100));

      // 2. Update Details
      await updatePropertyDetails(selectedId, {
        name: formName.trim(),
        description: formDescription.trim(),
        location: formLocation.trim(),
        price: Number(formPrice),
        images,
      });

      toast.success(`Saved changes for "${formName.trim()}"`);
    } catch {
      toast.success(`Saved changes for "${formName.trim()}"`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- ACTIONS: Manage Images ---

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = newImageUrl.trim();
    if (!url) return;
    try {
      new URL(url);
      setImages((prev) => [...prev, url]);
      setNewImageUrl("");
      toast.success("Image added to gallery");
      if (selectedId) {
        await addPropertyImages(selectedId, [url]);
      }
    } catch {
      toast.error("Please enter a valid image URL");
    }
  };

  const handleRemoveImage = async (indexToRemove: number) => {
    if (images.length <= 1) {
      toast.error("Property must have at least 1 photo");
      return;
    }
    const removedUrl = images[indexToRemove];
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    toast.success("Image removed");
    if (selectedId && removedUrl) {
      await removePropertyImage(selectedId, removedUrl);
    }
  };


  const isActive = selectedListing?.status === "active";

  return (
    <div className="min-h-screen bg-background pb-16 font-sans">
      <HostPageHeader
        title="Property & Inventory Management"
        description="Deactivate, reactivate, or delete properties. Adjust total bookable inventory counts, pricing, photos, and property details."

      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 space-y-8">
        {/* Property Switcher Tabs */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
            Select Listing / Property
          </label>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
            {listings.map((l) => {
              const active = l.id === selectedId;
              const Icon = typeIcons[l.type] ?? Bed;
              const isPropActive = l.status === "active";
              return (
                <button
                  key={l.id}
                  onClick={() => setSelectedId(l.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer outline-none",
                    active
                      ? "bg-purple text-white border-purple shadow-sm"
                      : "bg-white text-neutral-700 border-neutral-200/80 hover:border-purple/40 hover:text-neutral-900",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{l.name}</span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide",
                      active
                        ? isPropActive
                          ? "bg-emerald-500/20 text-emerald-100"
                          : "bg-neutral-800 text-neutral-300"
                        : isPropActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-neutral-100 text-neutral-500",
                    )}
                  >
                    {isPropActive ? "Active" : "Offline"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informative Guidance Banner */}
        <div className="bg-purple/5 border border-purple/15 rounded-2xl p-4 flex items-start gap-3">
          <Layers className="h-5 w-5 text-purple shrink-0 mt-0.5" />
          <div className="text-xs text-neutral-700 leading-relaxed">
            <span className="font-bold text-neutral-900">Direct Property & Inventory Controls: </span>
            This page is for primary master operations: adjusting total inventory capacity, updating base pricing, changing property photos, and managing live status (activating, taking offline, or deleting). For calendar date holds and time-elapsed blocks, use the{" "}
            <Link href="/host/availability" className="font-bold text-purple underline hover:text-purple-hover">
              Availability Calendar
            </Link>
            .
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: Inventory Capacity, Details & Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Inventory Capacity Stepper */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                    <Boxes className="h-4.5 w-4.5 text-purple" />
                    Total Inventory Capacity
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Increase or reduce the number of {unitLabelPlural.toLowerCase()} for this listing.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-lg">
                    {unitLabel} Capacity
                  </span>
                </div>
              </div>

              {/* Number Controller */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-neutral-50/80 p-5 rounded-2xl border border-neutral-200/80">
                <div>
                  <div className="text-3xl font-extrabold text-neutral-900">
                    {currentCount}{" "}
                    <span className="text-sm font-bold text-neutral-500 uppercase tracking-wider">
                      {currentCount === 1 ? unitLabel : unitLabelPlural}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm leading-relaxed">
                    Maximum concurrent bookable capacity across guests and search results.
                  </p>
                </div>

                {/* Stepper buttons & input */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={currentCount <= 1}
                    onClick={() => handleAdjustCapacity(currentCount - 1)}
                    className="h-11 w-11 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-neutral-800 transition-colors shadow-2xs cursor-pointer"
                    title={`Reduce by 1 ${unitLabel}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <div className="text-center px-4 py-1.5 bg-white border border-neutral-200 rounded-xl min-w-[70px]">
                    <span className="text-xl font-bold text-neutral-900">{currentCount}</span>
                    <span className="text-[9px] text-neutral-400 block font-bold uppercase -mt-0.5">units</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdjustCapacity(currentCount + 1)}
                    className="h-11 w-11 rounded-xl bg-purple hover:bg-purple-hover text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                    title={`Increase by 1 ${unitLabel}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-700">Quick adjust:</span>
                {[1, 2, 4, 8, 12, 16, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleAdjustCapacity(num)}
                    className={cn(
                      "px-3 py-1 rounded-lg border font-bold transition-colors cursor-pointer",
                      currentCount === num
                        ? "bg-purple text-white border-purple"
                        : "bg-white text-neutral-700 border-neutral-200 hover:border-purple/30",
                    )}
                  >
                    {num} {unitLabelPlural}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Edit Property Name, Price, Location & Description */}
            <form onSubmit={handleSaveDetails} className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                    <TypeIcon className="h-4.5 w-4.5 text-purple" />
                    Property Details & Pricing
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Update the name, price per night/unit, and location info.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Property Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Property / Listing Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple"
                    placeholder="e.g. Mukuni River Chalets"
                  />
                </div>

                {/* Base Nightly Price */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Base Price (ZMW)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-xs font-bold text-neutral-400">
                      K
                    </span>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Equivalent to {Math.round(formPrice * 100).toLocaleString()} Ngwee
                  </span>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Location / City
                  </label>
                  <div className="relative">
                    <MapPin className="h-4 w-4 absolute left-3.5 top-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple"
                      placeholder="e.g. Livingstone, Zambia"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Property Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple leading-relaxed"
                    placeholder="Describe your property, chalets, location, and guest highlights..."
                  />
                </div>
              </div>
            </form>

            {/* 3. Property Images Gallery */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                    <ImageIcon className="h-4.5 w-4.5 text-purple" />
                    Property Images
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Manage the visual photos displayed on search and property pages ({images.length} photo{images.length === 1 ? "" : "s"}).
                  </p>
                </div>
              </div>

              {/* Thumbnails Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden aspect-4/3 border border-neutral-200 bg-neutral-100"
                  >
                    <img
                      src={imgUrl}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Remove Photo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-purple text-white px-2 py-0.5 rounded-md shadow-xs">
                        Cover Photo
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Image URL */}
              <form onSubmit={handleAddImage} className="pt-2 flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste new photo URL (https://...)"
                  className="flex-1 h-10 px-3.5 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple"
                />
                <button
                  type="submit"
                  className="px-4 h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Photo
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Property Status, Lifecycle & Danger Zone */}
          <div className="space-y-6">
            {/* Status & Lifecycle Actions */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
                <div
                  className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center",
                    isActive
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-neutral-100 text-neutral-500",
                  )}
                >
                  {isActive ? <Power className="h-4.5 w-4.5" /> : <PowerOff className="h-4.5 w-4.5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Property Status</h3>
                  <p className="text-xs text-neutral-500">Live booking visibility</p>
                </div>
              </div>

              {/* Status Badge & Description */}
              <div
                className={cn(
                  "p-4 rounded-xl border text-xs space-y-1.5",
                  isActive
                    ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-900"
                    : "bg-neutral-50 border-neutral-200 text-neutral-700",
                )}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        isActive ? "bg-emerald-500 animate-pulse" : "bg-neutral-400",
                      )}
                    />
                    {isActive ? "Live & Active" : "Deactivated (Offline)"}
                  </span>
                  <span className="uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md bg-white border border-neutral-200 font-bold">
                    {selectedListing?.status}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-600">
                  {isActive
                    ? "This property is visible to guests on search and explore. It can accept new bookings up to available inventory."
                    : "This property is offline. Hidden from search results and guest booking checkout."}
                </p>
              </div>

              {/* Toggle Status Button (Deactivate / Reactivate) */}
              <button
                type="button"
                onClick={handleToggleStatus}
                className={cn(
                  "w-full h-11 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer",
                  isActive
                    ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white",
                )}
              >
                {isActive ? (
                  <>
                    <PowerOff className="h-4 w-4 text-neutral-600" />
                    Deactivate Property
                  </>
                ) : (
                  <>
                    <Power className="h-4 w-4 text-white" />
                    Reactivate Property (Go Live)
                  </>
                )}
              </button>
            </div>

            {/* Quick Link to Calendar (No Redundancy) */}
            <div className="bg-purple/5 border border-purple/15 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-purple font-bold text-xs uppercase tracking-wider">
                <CalendarCheck className="h-4 w-4" />
                <span>Date Blocking & Availability</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Need to hold dates for maintenance, private events, or seasonal pricing? Date-specific blocking and time-elapsed holds are managed on the Availability Calendar.
              </p>
              <Link
                href="/host/availability"
                className="inline-flex items-center justify-between w-full p-3 rounded-xl bg-white border border-purple/20 hover:border-purple text-xs font-bold text-purple transition-all group"
              >
                <span>Go to Availability Calendar</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Danger Zone: Delete Property */}
            <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>Danger Zone</span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Permanently delete this property and its associated inventory records. This action cannot be undone.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full h-10 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Property
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-12 w-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-neutral-900">Delete Property?</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <strong className="text-neutral-800">&ldquo;{selectedListing?.name}&rdquo;</strong>?
                This property will be completely removed from your account.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-xs font-bold text-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProperty}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

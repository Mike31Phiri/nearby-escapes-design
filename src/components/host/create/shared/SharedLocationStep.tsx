"use client";

import React from "react";
import { ZAMBIA_PROVINCES } from "./sharedConstants";
import { LocationState } from "./sharedTypes";
import { GoogleMapsLocationPicker } from "@/components/host/GoogleMapsLocationPicker";
import { cn } from "@/lib/utils";

interface SharedLocationStepProps {
  location?: LocationState;
  onLocationChange?: (location: LocationState) => void;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  title?: string;
  subtitle?: string;
  submitting?: boolean;
  onProvinceChange?: (provinceName: string) => void;
  onCityChange?: (city: string) => void;
  onDistrictChange?: (district: string) => void;
  onAddressChange?: (address: string) => void;
  onCoordinatesChange?: (coords: { lat: number; lng: number }) => void;
  onBack: () => void;
  onNext: () => void;
}

export function SharedLocationStep({
  location,
  onLocationChange,
  province,
  city,
  district,
  address,
  coordinates,
  title = "Location details",
  subtitle = "Specify the town and pinpoint the map coordinates.",
  submitting = false,
  onProvinceChange,
  onCityChange,
  onDistrictChange,
  onAddressChange,
  onCoordinatesChange,
  onBack,
  onNext,
}: SharedLocationStepProps) {
  const effectiveProvince = location ? location.province : (province || "Lusaka");
  const effectiveCity = location ? location.city : (city || "Lusaka City");
  const effectiveDistrict = location ? location.district : (district || "");
  const effectiveAddress = location ? location.address : (address || "");
  const effectiveCoordinates = location ? location.coordinates : (coordinates || { lat: -15.3875, lng: 28.3228 });

  const currentProvinceData =
    ZAMBIA_PROVINCES.find((p) => p.name === effectiveProvince) || ZAMBIA_PROVINCES[0];

  const handleProvinceChangeInternal = (newProvinceName: string) => {
    if (onProvinceChange) {
      onProvinceChange(newProvinceName);
    } else if (location && onLocationChange) {
      const pData = ZAMBIA_PROVINCES.find((p) => p.name === newProvinceName);
      onLocationChange({
        ...location,
        province: newProvinceName,
        city: pData?.popularCities[0] || location.city,
        coordinates: pData?.defaultCoords || location.coordinates,
      });
    }
  };

  const handleCityChangeInternal = (newCity: string) => {
    if (onCityChange) {
      onCityChange(newCity);
    } else if (location && onLocationChange) {
      onLocationChange({ ...location, city: newCity });
    }
  };

  const handleDistrictChangeInternal = (newDistrict: string) => {
    if (onDistrictChange) {
      onDistrictChange(newDistrict);
    } else if (location && onLocationChange) {
      onLocationChange({ ...location, district: newDistrict });
    }
  };

  const handleAddressChangeInternal = (newAddress: string) => {
    if (onAddressChange) {
      onAddressChange(newAddress);
    } else if (location && onLocationChange) {
      onLocationChange({ ...location, address: newAddress });
    }
  };

  const handleCoordinatesChangeInternal = (newCoords: { lat: number; lng: number }) => {
    if (onCoordinatesChange) {
      onCoordinatesChange(newCoords);
    } else if (location && onLocationChange) {
      onLocationChange({ ...location, coordinates: newCoords });
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800">
          <span>🇿🇲</span> Zambia
        </span>
      </div>

      <div className="space-y-4">
        {/* Province, City, Town/District, Address in a compact responsive row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Province */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-800">
              Province <span className="text-rose-500">*</span>
            </label>
            <select
              value={effectiveProvince}
              onChange={(e) => handleProvinceChangeInternal(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all cursor-pointer"
            >
              {ZAMBIA_PROVINCES.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} Province
                </option>
              ))}
            </select>
          </div>

          {/* City / Town */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-800">
              City / Town <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={effectiveCity}
              onChange={(e) => handleCityChangeInternal(e.target.value)}
              placeholder={`e.g. ${currentProvinceData.popularCities[0] || "Lusaka"}`}
              list="popular-cities-list"
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
            />
            <datalist id="popular-cities-list">
              {currentProvinceData.popularCities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          {/* Area / District */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-800">
              Area / Suburb
            </label>
            <input
              type="text"
              value={effectiveDistrict}
              onChange={(e) => handleDistrictChangeInternal(e.target.value)}
              placeholder="e.g. Woodlands, Avondale, Mfuwe"
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
            />
          </div>

          {/* Street Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-800">
              Street / Plot No.
            </label>
            <input
              type="text"
              value={effectiveAddress}
              onChange={(e) => handleAddressChangeInternal(e.target.value)}
              placeholder="e.g. Plot 1452, Leopards Hill Rd"
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
            />
          </div>
        </div>

        {/* Interactive Google Map Marker Picker */}
        <div className="pt-1">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-800">
              Pinpoint Exact Location on Map
            </label>
            <span className="text-[11px] text-neutral-500 font-mono">
              {effectiveCoordinates.lat.toFixed(4)}, {effectiveCoordinates.lng.toFixed(4)}
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <GoogleMapsLocationPicker
              latitude={effectiveCoordinates.lat}
              longitude={effectiveCoordinates.lng}
              province={effectiveProvince}
              city={effectiveCity}
              address={effectiveAddress}
              onChange={({ latitude, longitude, address: newAddr }) => {
                handleCoordinatesChangeInternal({ lat: latitude, lng: longitude });
                if (newAddr && !effectiveAddress) {
                  handleAddressChangeInternal(newAddr);
                }
              }}
            />
          </div>
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
          disabled={!effectiveCity.trim() || submitting}
          onClick={onNext}
          className={cn(
            "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
            effectiveCity.trim() && !submitting
              ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
          )}
        >
          <span>{submitting ? "Saving location..." : "Next"}</span>
        </button>
      </div>
    </div>
  );
}

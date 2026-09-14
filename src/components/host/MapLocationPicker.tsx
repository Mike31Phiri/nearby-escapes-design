"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Compass,
  Check,
  Search,
  Layers,
  Map as MapIcon,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MapLocationPickerProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  onChange: (coords: { latitude: number; longitude: number; city?: string }) => void;
}

// Prominent Zambian destinations with exact coordinates and city/province data
const ZAMBIA_PRESETS = [
  { name: "Lusaka", lat: -15.3875, lng: 28.3228, province: "Lusaka" },
  { name: "Livingstone (Vic Falls)", lat: -17.8419, lng: 25.8543, province: "Southern" },
  { name: "Kafue National Park", lat: -14.95, lng: 25.9, province: "Central" },
  { name: "South Luangwa", lat: -13.1333, lng: 31.7833, province: "Eastern" },
  { name: "Lower Zambezi", lat: -15.65, lng: 29.35, province: "Lusaka" },
  { name: "Siavonga / Kariba", lat: -16.5333, lng: 28.7167, province: "Southern" },
  { name: "Ndola / Copperbelt", lat: -12.9906, lng: 28.6366, province: "Copperbelt" },
  { name: "Kitwe", lat: -12.8024, lng: 28.2132, province: "Copperbelt" },
  { name: "Samfya / Bangweulu", lat: -11.3649, lng: 29.5564, province: "Luapula" },
];

export function MapLocationPicker({
  latitude = -15.3875,
  longitude = 28.3228,
  address = "",
  city = "",
  onChange,
}: MapLocationPickerProps) {
  const [lat, setLat] = useState<number>(latitude || -15.3875);
  const [lng, setLng] = useState<number>(longitude || 28.3228);
  const [mapType, setMapType] = useState<"google-roadmap" | "google-satellite" | "osm">("google-roadmap");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (latitude && !isNaN(latitude)) setLat(latitude);
    if (longitude && !isNaN(longitude)) setLng(longitude);
  }, [latitude, longitude]);

  const handleCoordinateChange = (newLat: number, newLng: number, newCity?: string) => {
    setLat(newLat);
    setLng(newLng);
    onChange({ latitude: newLat, longitude: newLng, city: newCity });
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const curLat = parseFloat(pos.coords.latitude.toFixed(5));
        const curLng = parseFloat(pos.coords.longitude.toFixed(5));
        handleCoordinateChange(curLat, curLng);
        toast.success("Location acquired from device GPS");
      },
      (err) => {
        setIsLocating(false);
        toast.error("Could not retrieve GPS location", {
          description: err.message,
        });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSearch = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const query = searchQuery.trim();
    if (!query) return;

    // Check if query matches any of our presets
    const matched = ZAMBIA_PRESETS.find(
      (p) => p.name.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(p.name.toLowerCase()),
    );

    if (matched) {
      handleCoordinateChange(matched.lat, matched.lng, matched.name);
      toast.success(`Centered map on ${matched.name}`);
      return;
    }

    // Attempt to search via Nominatim free geocoding for Zambia
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Zambia")}&limit=1`,
      { headers: { "Accept-Language": "en" } },
    )
      .then((res) => res.json())
      .then((results) => {
        if (results && results.length > 0) {
          const resultLat = parseFloat(parseFloat(results[0].lat).toFixed(5));
          const resultLng = parseFloat(parseFloat(results[0].lon).toFixed(5));
          const resultCity = results[0].display_name.split(",")[0]?.trim();
          handleCoordinateChange(resultLat, resultLng, resultCity);
          toast.success(`Found "${query}" on map`);
        } else {
          toast.info(`Could not resolve exact coordinates for "${query}". Pin location manually.`);
        }
      })
      .catch(() => {
        toast.info("Search service unreachable. You can select a preset or type coordinates.");
      });
  };

  // Google Maps standard embedded iframe URL (No API key required)
  // t=m: normal roadmap, t=k: satellite
  const googleMapsRoadmapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=m&z=15&ie=UTF8&iwloc=&output=embed`;
  const googleMapsSatelliteEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=15&ie=UTF8&iwloc=&output=embed`;

  // Free OpenStreetMap embed URL fallback
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.04}%2C${lat - 0.04}%2C${lng + 0.04}%2C${lat + 0.04}&layer=mapnik&marker=${lat}%2C${lng}`;

  // Direct Google Maps full link
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const currentEmbedUrl = useMemo(() => {
    if (mapType === "google-satellite") return googleMapsSatelliteEmbedUrl;
    if (mapType === "osm") return osmEmbedUrl;
    return googleMapsRoadmapEmbedUrl;
  }, [mapType, googleMapsRoadmapEmbedUrl, googleMapsSatelliteEmbedUrl, osmEmbedUrl]);

  return (
    <div className="space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple/10 flex items-center justify-center text-purple shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-bold text-neutral-900 block">Listing Location on Google Maps</span>
            <span className="text-sm text-neutral-500">Pick a destination preset, search an address, or fine-tune coordinates</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-xl border border-purple/20 bg-purple/5 text-sm font-semibold text-purple hover:bg-purple/10 transition-colors cursor-pointer"
          >
            <Navigation className={cn("h-4 w-4", isLocating && "animate-spin")} />
            <span>{isLocating ? "Locating…" : "Use My GPS"}</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:text-purple hover:border-purple/30 transition-colors"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="h-4 w-4 text-neutral-400" />
          </a>
        </div>
      </div>

      <div className="flex gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                handleSearch(e);
              }
            }}
            placeholder="Search address, landmark or town (e.g. Mosi-oa-Tunya, Livingstone)..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 bg-white text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/30 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="h-11 px-5 rounded-xl bg-purple text-white text-sm font-semibold hover:bg-purple-hover transition-colors shadow-2xs cursor-pointer shrink-0"
        >
          Find on Map
        </button>
      </div>




      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex rounded-xl border border-neutral-200/80 bg-neutral-100/80 p-1 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setMapType("google-roadmap")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer",
                mapType === "google-roadmap"
                  ? "bg-white text-purple shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              <MapIcon className="h-4 w-4" />
              <span>Google Maps</span>
            </button>
            <button
              type="button"
              onClick={() => setMapType("google-satellite")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer",
                mapType === "google-satellite"
                  ? "bg-white text-purple shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              <Layers className="h-4 w-4" />
              <span>Satellite</span>
            </button>
            <button
              type="button"
              onClick={() => setMapType("osm")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer",
                mapType === "osm"
                  ? "bg-white text-purple shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              <Globe className="h-4 w-4" />
              <span>Terrain</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm text-neutral-500 font-mono">
            <Compass className="h-4 w-4 text-purple" />
            <span>{lat.toFixed(4)}, {lng.toFixed(4)}</span>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-neutral-200/80 shadow-2xs bg-neutral-100 h-72 sm:h-84 w-full">
          <iframe
            key={currentEmbedUrl}
            title="Location Map"
            src={currentEmbedUrl}
            className="w-full h-full border-0 pointer-events-auto"
            loading="lazy"
          />

          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-neutral-200/80 rounded-xl px-3.5 py-2 shadow-2xs text-xs sm:text-sm font-medium text-neutral-800 flex items-center gap-2 pointer-events-none">
            <MapPin className="h-4 w-4 text-purple fill-purple/20" />
            <span className="font-semibold text-neutral-900">
              {city ? `${city} • ` : ""}{lat.toFixed(4)}, {lng.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
            Latitude (°N/S)
          </label>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => handleCoordinateChange(parseFloat(e.target.value) || 0, lng)}
            className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-white text-base font-mono text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/30 transition-all"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
            Longitude (°E/W)
          </label>
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => handleCoordinateChange(lat, parseFloat(e.target.value) || 0)}
            className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-white text-base font-mono text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/30 transition-all"
          />
        </div>
      </div>
      <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
        Google Maps is embedded live to display the location pin that guests will see. You can toggle between Roadmap and Satellite views, search landmarks, or verify on Google Maps anytime.
      </p>
    </div>
  );
}

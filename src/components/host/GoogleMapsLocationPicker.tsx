"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Search,
  Compass,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GoogleMapsLocationPickerProps {
  latitude: number;
  longitude: number;
  province?: string;
  city?: string;
  address?: string;
  onChange: (coords: { latitude: number; longitude: number; address?: string }) => void;
}

interface GoogleMapEvent {
  latLng: {
    lat: () => number;
    lng: () => number;
  };
}

interface GoogleMapsInstance {
  setCenter: (coords: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setMapTypeId: (mapTypeId: string) => void;
}

interface GoogleMarkerInstance {
  setPosition: (coords: { lat: number; lng: number }) => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
    initGoogleMapsCallback?: () => void;
  }
}

export function GoogleMapsLocationPicker({
  latitude,
  longitude,
  province = "",
  city = "",
  address = "",
  onChange,
}: GoogleMapsLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const googleMapInstanceRef = useRef<GoogleMapsInstance | null>(null);
  const markerInstanceRef = useRef<GoogleMarkerInstance | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const [apiKey] = useState<string>(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapViewType, setMapViewType] = useState<"roadmap" | "satellite">("roadmap");

  const [lat, setLat] = useState<number>(latitude || -15.3875);
  const [lng, setLng] = useState<number>(longitude || 28.3228);

  // Keep local state in sync when parent props update
  useEffect(() => {
    if (latitude && !isNaN(latitude)) setLat(latitude);
    if (longitude && !isNaN(longitude)) setLng(longitude);
  }, [latitude, longitude]);

  // Load Google Maps API script if API key is provided
  useEffect(() => {
    if (!apiKey) return;

    if (window.google?.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const scriptId = "google-maps-js-sdk";
    if (document.getElementById(scriptId)) return;

    window.initGoogleMapsCallback = () => {
      setIsScriptLoaded(true);
    };

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      delete window.initGoogleMapsCallback;
    };
  }, [apiKey]);

  // Initialize Real Google Map once script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !window.google?.maps || !mapContainerRef.current) return;

    const initialCenter = { lat, lng };

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 15,
      mapTypeId: mapViewType === "satellite" ? "satellite" : "roadmap",
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
      ],
    });

    const marker = new window.google.maps.Marker({
      position: initialCenter,
      map,
      draggable: true,
      title: "Listing Pin Location",
      animation: window.google.maps.Animation.DROP,
    });

    // Drag pin updates coordinates
    marker.addListener("dragend", (event: GoogleMapEvent) => {
      const newLat = parseFloat(event.latLng.lat().toFixed(6));
      const newLng = parseFloat(event.latLng.lng().toFixed(6));
      setLat(newLat);
      setLng(newLng);
      onChangeRef.current({ latitude: newLat, longitude: newLng });
      toast.success("Pin position updated");
    });

    // Click anywhere on map moves pin
    map.addListener("click", (event: GoogleMapEvent) => {
      const newLat = parseFloat(event.latLng.lat().toFixed(6));
      const newLng = parseFloat(event.latLng.lng().toFixed(6));
      marker.setPosition({ lat: newLat, lng: newLng });
      setLat(newLat);
      setLng(newLng);
      onChangeRef.current({ latitude: newLat, longitude: newLng });
    });

    // Places autocomplete on search input if available
    if (searchInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        componentRestrictions: { country: "zm" }, // Restrict search to Zambia!
        fields: ["geometry", "formatted_address", "name"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const newLat = parseFloat(place.geometry.location.lat().toFixed(6));
          const newLng = parseFloat(place.geometry.location.lng().toFixed(6));
          map.setCenter({ lat: newLat, lng: newLng });
          map.setZoom(16);
          marker.setPosition({ lat: newLat, lng: newLng });
          setLat(newLat);
          setLng(newLng);
          onChangeRef.current({
            latitude: newLat,
            longitude: newLng,
            address: place.formatted_address || place.name,
          });
          toast.success(`Found: ${place.name || place.formatted_address}`);
        }
      });
    }

    googleMapInstanceRef.current = map;
    markerInstanceRef.current = marker;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScriptLoaded, apiKey]);

  // Update map type (roadmap / satellite)
  const handleToggleMapType = (type: "roadmap" | "satellite") => {
    setMapViewType(type);
    if (googleMapInstanceRef.current && window.google?.maps) {
      googleMapInstanceRef.current.setMapTypeId(type);
    }
  };

  // Device GPS Locator
  const handleGetDeviceLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const curLat = parseFloat(pos.coords.latitude.toFixed(6));
        const curLng = parseFloat(pos.coords.longitude.toFixed(6));
        setLat(curLat);
        setLng(curLng);

        if (googleMapInstanceRef.current && markerInstanceRef.current) {
          const newPos = { lat: curLat, lng: curLng };
          googleMapInstanceRef.current.setCenter(newPos);
          googleMapInstanceRef.current.setZoom(16);
          markerInstanceRef.current.setPosition(newPos);
        }

        onChange({ latitude: curLat, longitude: curLng });
        toast.success("Coordinates acquired from device GPS");
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

  // Manual fallback search if API key is not active
  const handleFallbackSearch = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const query = searchQuery.trim();
    if (!query) return;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query + ", Zambia",
      )}&limit=1`,
      { headers: { "Accept-Language": "en" } },
    )
      .then((res) => res.json())
      .then((results) => {
        if (results && results.length > 0) {
          const resLat = parseFloat(parseFloat(results[0].lat).toFixed(6));
          const resLng = parseFloat(parseFloat(results[0].lon).toFixed(6));
          setLat(resLat);
          setLng(resLng);
          onChange({ latitude: resLat, longitude: resLng, address: results[0].display_name });
          toast.success(`Found "${query}" in Zambia`);
        } else {
          toast.info(`Could not find "${query}". You can adjust coordinates manually.`);
        }
      })
      .catch(() => {
        toast.info("Search service unreachable. Adjust coordinates manually.");
      });
  };

  // Google Maps standard embedded iframe URL fallback
  const googleMapsEmbedUrl = useMemo(() => {
    const tParam = mapViewType === "satellite" ? "k" : "m";
    return `https://maps.google.com/maps?q=${lat},${lng}&t=${tParam}&z=15&ie=UTF8&iwloc=&output=embed`;
  }, [lat, lng, mapViewType]);

  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="space-y-4 font-sans">
      {/* Search Bar & Map Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !apiKey) {
                e.preventDefault();
                handleFallbackSearch(e);
              }
            }}
            placeholder="Search neighborhood, district or landmark in Zambia..."
            className="w-full h-11 pl-10 pr-24 rounded-xl border border-neutral-200/90 bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
          />
          {!apiKey && (
            <button
              type="button"
              onClick={handleFallbackSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Search
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Map Layer Switcher */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200/60">
            <button
              type="button"
              onClick={() => handleToggleMapType("roadmap")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                mapViewType === "roadmap"
                  ? "bg-white text-purple shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => handleToggleMapType("satellite")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                mapViewType === "satellite"
                  ? "bg-white text-purple shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              Satellite
            </button>
          </div>

          {/* GPS Button */}
          <button
            type="button"
            onClick={handleGetDeviceLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-purple/20 bg-purple/5 text-xs font-semibold text-purple hover:bg-purple/10 transition-colors cursor-pointer"
          >
            <Navigation className={cn("h-3.5 w-3.5", isLocating && "animate-spin")} />
            <span>{isLocating ? "Locating…" : "My GPS"}</span>
          </button>

          {/* Direct Open in Google Maps */}
          <a
            href={externalGoogleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-neutral-200/80 bg-white text-xs font-semibold text-neutral-700 hover:text-purple hover:border-purple/40 transition-colors"
          >
            <span>Google Maps</span>
            <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
          </a>
        </div>
      </div>

      {/* Map Viewport */}
      <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-neutral-200 shadow-2xs bg-neutral-100">
        {apiKey ? (
          <div ref={mapContainerRef} className="w-full h-full" />
        ) : (
          <div className="relative w-full h-full">
            <iframe
              title="Google Maps Location Picker"
              src={googleMapsEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />
            {/* Center pin indicator badge */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-neutral-200/80 rounded-xl px-3 py-1.5 shadow-2xs flex items-center gap-2 pointer-events-none">
              <MapPin className="h-4 w-4 text-purple shrink-0" />
              <span className="text-xs font-medium text-neutral-800">
                Centered at {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Coordinate & Precision Controls */}
      <div className="bg-neutral-50 border border-neutral-200/70 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-purple/10 text-purple border border-purple/20 flex items-center justify-center shrink-0">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-neutral-900 block">Exact Coordinates</span>
            <span className="text-[11px] text-neutral-500">
              {apiKey
                ? "Click or drag the pin on Google Maps to adjust pinpoint accuracy"
                : "Used by Google Maps navigation and guest directions in Zambia"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-neutral-200 text-xs">
            <span className="text-neutral-400 font-medium">Lat:</span>
            <span className="font-mono font-semibold text-neutral-800">{lat}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-neutral-200 text-xs">
            <span className="text-neutral-400 font-medium">Lng:</span>
            <span className="font-mono font-semibold text-neutral-800">{lng}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

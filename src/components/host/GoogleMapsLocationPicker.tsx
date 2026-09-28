"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Search, Navigation } from "lucide-react";
import { toast } from "sonner";

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
  }, [apiKey]);

  // Initialize interactive Google Map
  useEffect(() => {
    if (!isScriptLoaded || !mapContainerRef.current || !window.google?.maps) return;

    const initialCenter = { lat, lng };

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 15,
      mapTypeId: "roadmap",
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
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

    // Places autocomplete on search input restricted to Zambia
    if (searchInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        componentRestrictions: { country: "zm" },
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

  // Center on province or city changes if Google Maps is active
  useEffect(() => {
    if (!googleMapInstanceRef.current || !markerInstanceRef.current) return;
    const newPos = { lat, lng };
    googleMapInstanceRef.current.setCenter(newPos);
    markerInstanceRef.current.setPosition(newPos);
  }, [lat, lng, province, city, address]);

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
        toast.success("Coordinates updated from GPS");
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

  // Fallback search using Zambia geocoding
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
          toast.success(`Found "${query}"`);
        } else {
          toast.info(`Could not locate "${query}". Adjust coordinates directly.`);
        }
      })
      .catch(() => {
        toast.info("Search service unreachable.");
      });
  };

  // Google Maps standard embedded iframe URL fallback
  const googleMapsEmbedUrl = useMemo(() => {
    return `https://maps.google.com/maps?q=${lat},${lng}&t=m&z=15&ie=UTF8&iwloc=&output=embed`;
  }, [lat, lng]);

  return (
    <div className="space-y-3 font-sans">
      {/* Search Input & GPS */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
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
            placeholder="Search town, landmark or street in Zambia..."
            className="w-full h-9 pl-9 pr-20 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
          />
          {!apiKey && (
            <button
              type="button"
              onClick={handleFallbackSearch}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 px-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Search
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleGetDeviceLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-purple/20 bg-purple/5 text-xs font-semibold text-purple hover:bg-purple/10 transition-colors shrink-0 cursor-pointer"
          title="Use current GPS location"
        >
          <Navigation className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{isLocating ? "Locating..." : "Use GPS"}</span>
        </button>
      </div>

      {/* Map Viewport - Compact & Focused */}
      <div className="relative w-full h-[220px] sm:h-[260px] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
        {apiKey ? (
          <div ref={mapContainerRef} className="w-full h-full" />
        ) : (
          <iframe
            title="Location Map"
            src={googleMapsEmbedUrl}
            className="w-full h-full border-0"
            loading="lazy"
          />
        )}
      </div>

      {/* Compact Coordinates Bar */}
      <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5 px-0.5">
        <span>Click map or drag pin to adjust coordinates</span>
        <div className="flex items-center gap-2 font-mono">
          <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-700">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}

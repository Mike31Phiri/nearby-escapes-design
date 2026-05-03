import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Wifi, Zap, Armchair, Utensils, Check, ChevronRight } from "lucide-react";
import type { BusSearchResult } from "./BusSearchForm";

interface BusResultsListProps {
  results: BusSearchResult[];
  onSelectBus: (bus: BusSearchResult) => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  AC: <Zap className="h-4 w-4" />,
  "USB Charging": <Zap className="h-4 w-4" />,
  "Reclining Seats": <Armchair className="h-4 w-4" />,
  Snacks: <Utensils className="h-4 w-4" />,
  "Extra Legroom": <Armchair className="h-4 w-4" />,
  Storage: <Armchair className="h-4 w-4" />,
};

export function BusResultsList({ results, onSelectBus }: BusResultsListProps) {
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  const handleSelect = (bus: BusSearchResult) => {
    setSelectedBusId(bus.id);
    onSelectBus(bus);
  };

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <p className="text-muted-foreground">No buses found for your search criteria.</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your dates or route.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((bus) => (
        <Card
          key={bus.id}
          className={`transition-all cursor-pointer hover:shadow-md ${
            selectedBusId === bus.id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => handleSelect(bus)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleSelect(bus)}
          aria-pressed={selectedBusId === bus.id}
        >
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Route Info */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {bus.departureTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">{bus.from}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="w-full h-[2px] bg-border relative">
                      <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{bus.duration}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {bus.arrivalTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">{bus.to}</p>
                  </div>
                </div>
              </div>

              {/* Bus Details */}
              <div className="md:col-span-1">
                <p className="font-semibold">{bus.operator}</p>
                <p className="text-sm text-muted-foreground">{bus.busType}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {bus.availableSeats} seats left
                  </Badge>
                </div>
              </div>

              {/* Amenities */}
              <div className="md:col-span-1">
                <div className="flex flex-wrap gap-2">
                  {bus.amenities.slice(0, 4).map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                      title={amenity}
                    >
                      {amenityIcons[amenity] || <Check className="h-3 w-3" />}
                      <span className="hidden lg:inline">{amenity}</span>
                    </div>
                  ))}
                  {bus.amenities.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{bus.amenities.length - 4}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Price and Action */}
              <div className="md:col-span-1 flex flex-col justify-between items-end">
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">${bus.price}</p>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>
                <Button
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(bus);
                  }}
                >
                  Select Bus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

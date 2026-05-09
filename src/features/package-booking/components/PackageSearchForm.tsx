import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Users, Clock, MapPin, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackageSearchProps {
  onSearchResults: (results: PackageSearchResult[]) => void;
}

export interface PackageSearchResult {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  rating: number;
  reviewCount: number;
  location: string;
  imageUrl: string;
  highlights: string[];
  included: string[];
  category: string;
}

import { mockPackages as rawPackages } from "@/lib/mock-data";

const mockPackages: PackageSearchResult[] = rawPackages.map((p) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  duration: p.duration,
  price: p.price,
  rating: p.rating,
  reviewCount: p.reviews,
  location: p.location,
  imageUrl: p.image,
  highlights: p.highlights,
  included: p.included,
  category: p.category,
}));

export function PackageSearchForm({ onSearchResults }: PackageSearchProps) {
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(2);
  const [category, setCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSearching(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Filter mock results
    let results = mockPackages;

    if (destination) {
      results = results.filter((pkg) =>
        pkg.location.toLowerCase().includes(destination.toLowerCase()),
      );
    }

    if (category) {
      results = results.filter((pkg) => pkg.category === category);
    }

    onSearchResults(results);
    setIsSearching(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Search Vacation Packages</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10"
                placeholder="Where do you want to go?"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkIn">Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkInDate && "text-muted-foreground",
                  )}
                  id="checkIn"
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? format(checkInDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Guests</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="guests"
                type="number"
                min={1}
                max={10}
                value={guests}
                onChange={(e) =>
                  setGuests(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))
                }
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Package Type</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Types</option>
              <option value="All-Inclusive">All-Inclusive</option>
              <option value="Adventure">Adventure</option>
              <option value="Romance">Romance</option>
              <option value="Family">Family</option>
              <option value="Cultural">Cultural</option>
            </select>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSearching}
            aria-busy={isSearching}
          >
            {isSearching ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Packages
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

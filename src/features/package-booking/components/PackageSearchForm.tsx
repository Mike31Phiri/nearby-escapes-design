import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Users, Clock, MapPin, Search, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const mockPackages: PackageSearchResult[] = [
  {
    id: '1',
    name: 'Complete Jamaica Experience',
    description: '7-day all-inclusive package covering the best of Jamaica including beaches, mountains, and cultural experiences.',
    duration: '7 days / 6 nights',
    price: 1299,
    rating: 4.9,
    reviewCount: 342,
    location: 'Montego Bay & Ocho Rios',
    imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800',
    highlights: [
      'Luxury resort accommodation',
      'Guided tours to Dunn\\'s River Falls',
      'Sunset catamaran cruise',
      'Blue Mountain coffee tour',
      'All meals and drinks included',
    ],
    included: [
      '6 nights accommodation',
      'Daily breakfast, lunch, and dinner',
      'Airport transfers',
      'All guided tours',
      'Entrance fees',
      'Professional tour guide',
    ],
    category: 'All-Inclusive',
  },
  {
    id: '2',
    name: 'Adventure Seeker Package',
    description: '5-day action-packed adventure featuring zip-lining, river tubing, hiking, and water sports.',
    duration: '5 days / 4 nights',
    price: 899,
    rating: 4.8,
    reviewCount: 218,
    location: 'Ocho Rios & Port Antonio',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
    highlights: [
      'Zip-lining through rainforest canopy',
      'River tubing adventure',
      'Blue Lagoon exploration',
      'Horseback riding on the beach',
      'Small group experience',
    ],
    included: [
      '4 nights hotel accommodation',
      'Daily breakfast',
      'All adventure activities',
      'Equipment and safety gear',
      'Transportation between activities',
    ],
    category: 'Adventure',
  },
  {
    id: '3',
    name: 'Romantic Getaway',
    description: 'Perfect for couples! 4-day romantic escape with private dinners, spa treatments, and sunset cruises.',
    duration: '4 days / 3 nights',
    price: 1599,
    rating: 5.0,
    reviewCount: 156,
    location: 'Negril',
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    highlights: [
      'Beachfront suite with ocean view',
      'Private candlelit dinner on the beach',
      'Couples spa treatment',
      'Sunset sailing excursion',
      'Champagne and chocolates on arrival',
    ],
    included: [
      '3 nights luxury suite',
      'Daily gourmet breakfast',
      'One romantic dinner',
      'Couples massage (60 min)',
      'Private airport transfers',
    ],
    category: 'Romance',
  },
];

export function PackageSearchForm({ onSearchResults }: PackageSearchProps) {
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(2);
  const [category, setCategory] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter mock results
    let results = mockPackages;
    
    if (destination) {
      results = results.filter(pkg => 
        pkg.location.toLowerCase().includes(destination.toLowerCase())
      );
    }
    
    if (category) {
      results = results.filter(pkg => pkg.category === category);
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
                    'w-full justify-start text-left font-normal',
                    !checkInDate && 'text-muted-foreground'
                  )}
                  id="checkIn"
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? format(checkInDate, 'PPP') : 'Pick a date'}
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
                onChange={(e) => setGuests(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
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

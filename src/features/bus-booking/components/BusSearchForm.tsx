import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, Clock, Users, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusSearchProps {
  onSearchResults: (results: BusSearchResult[]) => void;
}

export interface BusSearchResult {
  id: string;
  operator: string;
  departureTime: Date;
  arrivalTime: Date;
  duration: string;
  price: number;
  availableSeats: number;
  busType: string;
  amenities: string[];
  from: string;
  to: string;
}

const mockBusRoutes: BusSearchResult[] = [
  {
    id: '1',
    operator: 'Jamaica Express',
    departureTime: new Date(new Date().setHours(8, 0, 0, 0)),
    arrivalTime: new Date(new Date().setHours(12, 30, 0, 0)),
    duration: '4h 30m',
    price: 45,
    availableSeats: 23,
    busType: 'Luxury Coach',
    amenities: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'],
    from: 'Kingston',
    to: 'Montego Bay',
  },
  {
    id: '2',
    operator: 'Island Shuttle',
    departureTime: new Date(new Date().setHours(10, 0, 0, 0)),
    arrivalTime: new Date(new Date().setHours(15, 0, 0, 0)),
    duration: '5h 0m',
    price: 35,
    availableSeats: 15,
    busType: 'Standard',
    amenities: ['AC', 'Storage'],
    from: 'Kingston',
    to: 'Montego Bay',
  },
  {
    id: '3',
    operator: 'Caribbean Routes',
    departureTime: new Date(new Date().setHours(14, 0, 0, 0)),
    arrivalTime: new Date(new Date().setHours(18, 15, 0, 0)),
    duration: '4h 15m',
    price: 50,
    availableSeats: 8,
    busType: 'Premium',
    amenities: ['WiFi', 'AC', 'USB Charging', 'Snacks', 'Extra Legroom'],
    from: 'Kingston',
    to: 'Montego Bay',
  },
];

export function BusSearchForm({ onSearchResults }: BusSearchProps) {
  const [from, setFrom] = useState('Kingston');
  const [to, setTo] = useState('Montego Bay');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date());
  const [passengers, setPassengers] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departureDate) return;

    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter mock results based on search criteria
    const results = mockBusRoutes.filter(bus => 
      bus.from.toLowerCase().includes(from.toLowerCase()) &&
      bus.to.toLowerCase().includes(to.toLowerCase())
    );
    
    onSearchResults(results.length > 0 ? results : mockBusRoutes);
    setIsSearching(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Search Buses</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="pl-10"
                  placeholder="Departure city"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="pl-10"
                  placeholder="Destination city"
                  required
                  aria-required="true"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureDate">Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !departureDate && 'text-muted-foreground'
                    )}
                    id="departureDate"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengers">Passengers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="passengers"
                  type="number"
                  min={1}
                  max={10}
                  value={passengers}
                  onChange={(e) => setPassengers(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="pl-10"
                  aria-describedby="passengers-description"
                />
              </div>
              <p id="passengers-description" className="text-xs text-muted-foreground">
                Maximum 10 passengers
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSearching || !departureDate}
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
                Search Buses
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

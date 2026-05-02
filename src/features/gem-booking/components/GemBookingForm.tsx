import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Users, Clock, MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GemBookingProps {
  gemId: string;
  gemName: string;
  price: number;
  duration: string;
  location: string;
  rating: number;
  maxGroupSize: number;
  imageUrl: string;
  onBookingComplete: (bookingData: GemBookingData) => void;
}

export interface GemBookingData {
  gemId: string;
  date: Date;
  numberOfGuests: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  totalPrice: number;
}

export function GemBookingForm({
  gemId,
  gemName,
  price,
  duration,
  location,
  rating,
  maxGroupSize,
  imageUrl,
  onBookingComplete,
}: GemBookingProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = price * numberOfGuests;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const bookingData: GemBookingData = {
      gemId,
      date,
      numberOfGuests,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests: specialRequests || undefined,
      totalPrice,
    };

    onBookingComplete(bookingData);
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Book {gemName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex gap-4">
          <img
            src={imageUrl}
            alt={gemName}
            className="h-32 w-48 rounded-lg object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Max {maxGroupSize} guests</span>
            </div>
            <div className="text-xl font-bold text-primary">
              ${price} per person
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                    id="date"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                id="guests"
                type="number"
                min={1}
                max={maxGroupSize}
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(Math.min(maxGroupSize, Math.max(1, parseInt(e.target.value) || 1)))}
                aria-describedby="guests-description"
              />
              <p id="guests-description" className="text-xs text-muted-foreground">
                Maximum {maxGroupSize} guests
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Full Name</Label>
            <Input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <textarea
              id="specialRequests"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requirements or questions..."
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">Total Price</span>
              <span className="text-2xl font-bold text-primary">${totalPrice}</span>
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!date || isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Book Now - $${totalPrice}`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

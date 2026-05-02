import { useParams, useRouter } from "next/navigation";
import { useState } from 'react';
import { GemBookingForm, type GemBookingData } from '../components/GemBookingForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock, MapPin, Users, Shield, CheckCircle } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

// Mock data - would come from API in production
const mockGems = {
  '1': {
    id: '1',
    name: 'Hidden Waterfall Adventure',
    description: 'Discover a breathtaking hidden waterfall tucked away in the lush mountains. This exclusive experience includes a guided hike, swimming opportunity, and a traditional lunch prepared by local villagers.',
    price: 85,
    duration: '6 hours',
    location: 'Blue Mountains, Jamaica',
    rating: 4.9,
    reviewCount: 234,
    maxGroupSize: 12,
    imageUrl: 'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?w=800',
    images: [
      'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
    ],
    highlights: [
      'Private guided hike to secluded waterfall',
      'Swimming in crystal-clear natural pools',
      'Traditional Jamaican lunch included',
      'Small group experience (max 12 people)',
      'Hotel pickup and drop-off',
    ],
    included: [
      'Professional tour guide',
      'Transportation',
      'Lunch and refreshments',
      'Entrance fees',
      'Safety equipment',
    ],
    whatToBring: [
      'Swimsuit',
      'Comfortable walking shoes',
      'Sunscreen',
      'Camera',
      'Change of clothes',
    ],
  },
  '2': {
    id: '2',
    name: 'Sunset Catamaran Cruise',
    description: 'Sail into the Caribbean sunset aboard a luxury catamaran. Enjoy unlimited drinks, snorkeling at coral reefs, and live music as you cruise along the stunning coastline.',
    price: 120,
    duration: '4 hours',
    location: 'Montego Bay, Jamaica',
    rating: 4.8,
    reviewCount: 567,
    maxGroupSize: 20,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a8723ba3f9?w=800',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a8723ba3f9?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1566373767786-7a75c8d6aa4e?w=800',
    ],
    highlights: [
      'Luxury catamaran sailing',
      'Unlimited premium drinks',
      'Snorkeling at coral reefs',
      'Live DJ and music',
      'Stunning sunset views',
    ],
    included: [
      'Catamaran cruise',
      'Open bar (premium drinks)',
      'Snorkeling equipment',
      'Light appetizers',
      'Live entertainment',
    ],
    whatToBring: [
      'Swimsuit',
      'Towel',
      'Sunscreen',
      'Sunglasses',
      'Camera',
    ],
  },
};

export function GemDetailPage() {
  const { gemId } = useParams({ from: '/gems/$gemId' });
  const navigate = useRouter();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState<GemBookingData | null>(null);

  const gem = mockGems[gemId as keyof typeof mockGems];

  if (!gem) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Gem Not Found</h1>
        <p className="text-muted-foreground mb-6">This experience is no longer available.</p>
        <Button onClick={() => navigate({ to: '/gems' })}>Browse Other Gems</Button>
      </div>
    );
  }

  const handleBookingComplete = (data: GemBookingData) => {
    setBookingData(data);
    setBookingConfirmed(true);
  };

  if (bookingConfirmed && bookingData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Your booking for {gem.name} has been confirmed.
            </p>
            <div className="bg-muted rounded-lg p-6 mb-6 text-left">
              <h2 className="font-semibold mb-4">Booking Details</h2>
              <div className="space-y-2">
                <p><strong>Experience:</strong> {gem.name}</p>
                <p><strong>Date:</strong> {bookingData.date.toLocaleDateString()}</p>
                <p><strong>Guests:</strong> {bookingData.numberOfGuests}</p>
                <p><strong>Total Paid:</strong> ${bookingData.totalPrice}</p>
                <p><strong>Confirmation Email:</strong> {bookingData.contactEmail}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              A confirmation email has been sent to {bookingData.contactEmail} with all the details and meeting point information.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate({ to: '/gems' })}>
                Browse More Experiences
              </Button>
              <Button onClick={() => navigate({ to: '/bookings' })}>
                View My Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Image */}
      <div className="relative h-[400px] md:h-[500px]">
        <img
          src={gem.imageUrl}
          alt={gem.name}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={() => navigate({ to: '/gems' })}
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{gem.rating}</span>
              <span className="text-white/80">({gem.reviewCount} reviews)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{gem.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {gem.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {gem.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Max {gem.maxGroupSize} guests
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About This Experience</h2>
              <p className="text-muted-foreground leading-relaxed">{gem.description}</p>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Highlights</h2>
              <ul className="space-y-2">
                {gem.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* What's Included */}
            <section>
              <h2 className="text-2xl font-bold mb-4">What's Included</h2>
              <ul className="space-y-2">
                {gem.included.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* What to Bring */}
            <section>
              <h2 className="text-2xl font-bold mb-4">What to Bring</h2>
              <ul className="space-y-2">
                {gem.whatToBring.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="h-5 w-5 text-primary mt-0.5 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Image Gallery */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gem.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${gem.name} - Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {!showBookingForm ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-primary mb-2">${gem.price}</div>
                      <p className="text-muted-foreground">per person</p>
                    </div>
                    <Button
                      className="w-full mb-4"
                      size="lg"
                      onClick={() => setShowBookingForm(true)}
                    >
                      Book Now
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Free cancellation up to 24 hours before</span>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <GemBookingForm
                  gemId={gem.id}
                  gemName={gem.name}
                  price={gem.price}
                  duration={gem.duration}
                  location={gem.location}
                  rating={gem.rating}
                  maxGroupSize={gem.maxGroupSize}
                  imageUrl={gem.imageUrl}
                  onBookingComplete={handleBookingComplete}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

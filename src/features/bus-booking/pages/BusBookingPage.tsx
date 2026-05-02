import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { BusSearchForm, type BusSearchResult } from '../components/BusSearchForm';
import { BusResultsList } from '../components/BusResultsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CreditCard } from 'lucide-react';

export function BusBookingPage() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<BusSearchResult[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusSearchResult | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleSelectBus = (bus: BusSearchResult) => {
    setSelectedBus(bus);
  };

  const handleBookNow = async () => {
    if (!selectedBus) return;

    setIsBooking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBookingConfirmed(true);
    setIsBooking(false);
  };

  if (bookingConfirmed && selectedBus) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Bus Ticket Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Your bus ticket has been booked successfully.
            </p>
            
            <div className="bg-muted rounded-lg p-6 mb-6 text-left">
              <h2 className="font-semibold mb-4">Ticket Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Operator:</span>
                  <span className="font-medium">{selectedBus.operator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Route:</span>
                  <span className="font-medium">{selectedBus.from} → {selectedBus.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Departure:</span>
                  <span className="font-medium">
                    {selectedBus.departureTime.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Arrival:</span>
                  <span className="font-medium">
                    {selectedBus.arrivalTime.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bus Type:</span>
                  <span className="font-medium">{selectedBus.busType}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-semibold">Total Paid:</span>
                  <span className="font-bold text-primary">${selectedBus.price}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              A confirmation email with your e-ticket has been sent to your registered email address.
              Please present this ticket (printed or on your phone) when boarding.
            </p>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate({ to: '/transport' })}>
                Book Another Trip
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
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Book Bus Tickets</h1>
          <p className="text-muted-foreground text-lg">
            Travel comfortably across Jamaica with our trusted bus partners.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BusSearchForm onSearchResults={setSearchResults} />
            </div>
          </div>

          {/* Results and Booking */}
          <div className="lg:col-span-2 space-y-6">
            {searchResults.length > 0 && (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Available Buses</h2>
                  <BusResultsList results={searchResults} onSelectBus={handleSelectBus} />
                </div>

                {selectedBus && (
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>Selected Bus</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-semibold mb-2">{selectedBus.operator}</h3>
                          <p className="text-sm text-muted-foreground">{selectedBus.busType}</p>
                          <div className="mt-4 space-y-2">
                            <p className="flex items-center gap-2">
                              <span className="text-muted-foreground">From:</span>
                              <span className="font-medium">{selectedBus.from}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-muted-foreground">To:</span>
                              <span className="font-medium">{selectedBus.to}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-muted-foreground">Duration:</span>
                              <span className="font-medium">{selectedBus.duration}</span>
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="text-right mb-4">
                            <p className="text-4xl font-bold text-primary">${selectedBus.price}</p>
                            <p className="text-sm text-muted-foreground">per person</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground">Amenities:</p>
                            <div className="flex flex-wrap gap-2 justify-end">
                              {selectedBus.amenities.map((amenity) => (
                                <span key={amenity} className="bg-muted px-2 py-1 rounded text-xs">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleBookNow}
                        disabled={isBooking}
                        aria-busy={isBooking}
                      >
                        {isBooking ? (
                          <>
                            <CreditCard className="mr-2 h-4 w-4 animate-pulse" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Book Now - ${selectedBus.price}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {searchResults.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted-foreground">
                    Search for buses to see available options.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

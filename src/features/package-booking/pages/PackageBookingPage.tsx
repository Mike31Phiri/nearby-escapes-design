'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PackageSearchForm, type PackageSearchResult } from '../components/PackageSearchForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, CheckCircle, CreditCard } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

export function PackageBookingPage() {
  const router = useRouter();
  const { setPackageDetails } = useBookingStore();
  const [searchResults, setSearchResults] = useState<PackageSearchResult[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageSearchResult | null>(null);
  
  const handleSelectPackage = (pkg: PackageSearchResult) => {
    setSelectedPackage(pkg);
  };
  
  const handleBookNow = () => {
    if (!selectedPackage) return;
    
    // Calculate pricing
    const subtotal = selectedPackage.price * 2; // Default 2 guests
    const serviceFee = subtotal * 0.1; // 10% service fee
    const taxes = subtotal * 0.08; // 8% taxes
    const total = subtotal + serviceFee + taxes;
    
    // Store booking details
    setPackageDetails({
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      packageImage: selectedPackage.imageUrl,
      guests: 2,
      pricePerPerson: selectedPackage.price,
      duration: selectedPackage.duration,
      location: selectedPackage.location,
      subtotal,
      serviceFee,
      taxes,
      total,
    });
    
    // Navigate to checkout
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Vacation Packages</h1>
          <p className="text-muted-foreground text-lg">
            All-inclusive packages designed for unforgettable Jamaican experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PackageSearchForm onSearchResults={setSearchResults} />
            </div>
          </div>

          {/* Results and Booking */}
          <div className="lg:col-span-2 space-y-6">
            {searchResults.length > 0 && (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Available Packages</h2>
                  <div className="space-y-4">
                    {searchResults.map((pkg) => (
                      <Card
                        key={pkg.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedPackage?.id === pkg.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleSelectPackage(pkg)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleSelectPackage(pkg)}
                        aria-pressed={selectedPackage?.id === pkg.id}
                      >
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <img
                              src={pkg.imageUrl}
                              alt={pkg.name}
                              className="w-full h-48 md:h-full object-cover rounded-lg"
                              loading="lazy"
                              decoding="async"
                            />
                            
                            <div className="md:col-span-2">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <Badge className="mb-2">{pkg.category}</Badge>
                                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{pkg.rating}</span>
                                  <span className="text-sm text-muted-foreground">
                                    ({pkg.reviewCount})
                                  </span>
                                </div>
                              </div>

                              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                {pkg.description}
                              </p>

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {pkg.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {pkg.location}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-3xl font-bold text-primary">${pkg.price}</p>
                                  <p className="text-sm text-muted-foreground">per person</p>
                                </div>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectPackage(pkg);
                                  }}
                                >
                                  Select Package
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {selectedPackage && (
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>Selected Package</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-semibold mb-2">{selectedPackage.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {selectedPackage.description}
                          </p>
                          
                          <h4 className="font-semibold mb-2">Highlights</h4>
                          <ul className="space-y-1 mb-4">
                            {selectedPackage.highlights.slice(0, 4).map((highlight, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>

                          <h4 className="font-semibold mb-2">What's Included</h4>
                          <ul className="space-y-1">
                            {selectedPackage.included.slice(0, 4).map((item, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="text-right mb-6">
                            <p className="text-4xl font-bold text-primary">${selectedPackage.price}</p>
                            <p className="text-sm text-muted-foreground">per person</p>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Duration:</span>
                              <span className="font-medium">{selectedPackage.duration}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Location:</span>
                              <span className="font-medium">{selectedPackage.location}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Category:</span>
                              <span className="font-medium">{selectedPackage.category}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Rating:</span>
                              <span className="font-medium flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {selectedPackage.rating} ({selectedPackage.reviewCount} reviews)
                              </span>
                            </div>
                          </div>

                          <Button
                            className="w-full"
                            size="lg"
                            onClick={handleBookNow}
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Book Now - Proceed to Checkout
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {searchResults.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted-foreground">
                    Search for packages to see available options.
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

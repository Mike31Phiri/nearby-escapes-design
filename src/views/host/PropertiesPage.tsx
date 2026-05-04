"use client";

import { useRouter } from "next/navigation";
import { Plus, Eye, Pencil, Power, PowerOff, MoveHorizontal as MoreHorizontal, Star, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HostSidebar, HostMobileNav } from "./HostDashboardPage";
import { cn } from "@/lib/utils";

const mockProperties = [
  {
    id: "mosi-oa-tunya-lodge",
    name: "Mosi-oa-Tunya Lodge",
    location: "Livingstone, Southern Province",
    price: 220,
    status: "published" as const,
    image: "https://images.pexels.com/photos/2132180/pexels-photo-2132180?auto=compress&fit=crop&w=600&h=400",
    bookings: 12,
    rating: 4.9,
  },
  {
    id: "kafue-eco-lodge",
    name: "Kafue Eco Lodge",
    location: "Kafue, Central Province",
    price: 195,
    status: "published" as const,
    image: "https://images.pexels.com/photos/2595880/pexels-photo-2595880?auto=compress&fit=crop&w=600&h=400",
    bookings: 8,
    rating: 4.85,
  },
  {
    id: "draft-lodge",
    name: "Lower Zambezi Retreat",
    location: "Lower Zambezi, Southern Province",
    price: 175,
    status: "draft" as const,
    image: "https://images.pexels.com/photos/3225528/pexels-photo-3225528?auto=compress&fit=crop&w=600&h=400",
    bookings: 0,
    rating: 0,
  },
];

const statusConfig = {
  published: { label: "Live", className: "bg-primary-soft text-primary border-transparent" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border-transparent" },
  paused: { label: "Paused", className: "bg-accent/20 text-accent-foreground border-transparent" },
};

export function PropertiesPage() {
  const router = useRouter();
  const published = mockProperties.filter(p => p.status === "published").length;
  const drafts = mockProperties.filter(p => p.status === "draft").length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="border-b border-border/50 bg-primary-soft/30">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-8 md:py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Host</p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Properties</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Manage listings, pricing and availability.</p>
            </div>
            <Button onClick={() => router.push("/host/new-listing")} className="bg-[image:var(--gradient-hero)] hover:opacity-95 shrink-0">
              <Plus className="h-4 w-4 mr-2" /> Create listing
            </Button>
          </div>
          <div className="mt-6"><HostMobileNav /></div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 md:px-6 py-10">
        <div className="flex gap-10">
          <HostSidebar />

          <div className="flex-1 min-w-0 space-y-10">
            {/* Stats */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Summary</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Published", value: published },
                  { label: "Drafts", value: drafts },
                  { label: "Total", value: mockProperties.length },
                ].map(({ label, value }) => (
                  <Card key={label} className="border-border/60">
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl font-bold tracking-tight">{value}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Property grid */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Your listings</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mockProperties.map(property => {
                  const config = statusConfig[property.status];
                  return (
                    <Card key={property.id} className="border-border/60 overflow-hidden group">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="outline" className={cn("text-xs font-semibold backdrop-blur-sm", config.className)}>
                            {config.label}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Eye className="h-4 w-4 mr-2" /> Preview</DropdownMenuItem>
                              <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                              {property.status === "published"
                                ? <DropdownMenuItem><PowerOff className="h-4 w-4 mr-2" /> Pause</DropdownMenuItem>
                                : <DropdownMenuItem><Power className="h-4 w-4 mr-2" /> Publish</DropdownMenuItem>
                              }
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold truncate">{property.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {property.location}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="font-bold">${property.price}<span className="text-muted-foreground font-normal text-xs"> /night</span></span>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {property.rating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-accent text-accent" /> {property.rating}
                              </span>
                            )}
                            <span>{property.bookings} bookings</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

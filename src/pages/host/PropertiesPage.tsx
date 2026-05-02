import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, MoveHorizontal as MoreHorizontal, Eye, Pencil, Power, PowerOff } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockProperties = [
  {
    id: "mosi-oa-tunya-lodge",
    name: "Mosi-oa-Tunya Lodge",
    location: "Livingstone, Southern Province",
    price: 220,
    status: "published" as const,
    image: "https://images.pexels.com/photos/2132180/pexels-photo-2132180?auto=compress&fit=crop&w=400&h=300",
    bookings: 12,
    rating: 4.9,
  },
  {
    id: "kafue-eco-lodge",
    name: "Kafue Eco Lodge",
    location: "Kafue, Central Province",
    price: 195,
    status: "published" as const,
    image: "https://images.pexels.com/photos/2595880/pexels-photo-2595880?auto=compress&fit=crop&w=400&h=300",
    bookings: 8,
    rating: 4.85,
  },
  {
    id: "draft-lodge",
    name: "Lower Zambezi Retreat",
    location: "Lower Zambezi, Southern Province",
    price: 175,
    status: "draft" as const,
    image: "https://images.pexels.com/photos/3225528/pexels-photo-3225528?auto=compress&fit=crop&w=400&h=300",
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
  const published = mockProperties.filter((p) => p.status === "published").length;
  const drafts = mockProperties.filter((p) => p.status === "draft").length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-display">Your properties</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage listings, pricing and availability.
            </p>
          </div>
          <Button
            onClick={() => router.push("/host/new-listing")}
            className="bg-[image:var(--gradient-hero)] hover:opacity-95 shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" /> Create listing
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-3 grid-cols-3">
          <Card className="border-border/60">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{published}</div>
              <div className="text-xs text-muted-foreground">Published</div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{drafts}</div>
              <div className="text-xs text-muted-foreground">Drafts</div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{mockProperties.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Property list */}
        <div className="mt-6 space-y-3">
          {mockProperties.map((property) => {
            const config = statusConfig[property.status];
            return (
              <Card key={property.id} className="border-border/60 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="h-20 w-20 rounded-xl object-cover shrink-0 sm:h-24 sm:w-24"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm truncate">{property.name}</h3>
                            <Badge variant="outline" className={config.className}>
                              {config.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{property.location}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            {property.status === "published" ? (
                              <DropdownMenuItem>
                                <PowerOff className="h-4 w-4 mr-2" /> Pause
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <Power className="h-4 w-4 mr-2" /> Publish
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>${property.price}/night</span>
                        {property.rating > 0 && <span>{property.rating} rating</span>}
                        <span>{property.bookings} bookings</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty state for no properties */}
        {mockProperties.length === 0 && (
          <div className="mt-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Plus className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold">No properties yet</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first listing and start welcoming guests.
            </p>
            <Button
              className="mt-4 bg-[image:var(--gradient-hero)] hover:opacity-95"
              onClick={() => router.push("/host/new-listing")}
            >
              <Plus className="h-4 w-4 mr-2" /> Create your first listing
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

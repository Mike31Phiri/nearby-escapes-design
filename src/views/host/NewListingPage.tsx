"use client";

import { useRouter } from "next/navigation";
import { Bed, Bus, MapPin, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const listingTypes = [
  {
    id: "stay",
    label: "Stay",
    desc: "Lodges, hotels, camps, guesthouses and boutique stays",
    icon: Bed,
    path: "/host/new-property/step-1",
    color: "bg-primary-soft text-primary",
  },
  {
    id: "ride",
    label: "Ride / Transport",
    desc: "Bus routes, shuttles, airport transfers and private charters",
    icon: Bus,
    path: "/host/new-ride",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    id: "gem",
    label: "Hidden gem",
    desc: "Tours, attractions, activities and local experiences",
    icon: MapPin,
    path: "/host/new-gem",
    color: "bg-primary-soft text-primary",
  },
];

export function NewListingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Create new listing
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl font-display">
            What are you listing?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose the type of listing you want to create. Each has its own setup flow.
          </p>
        </header>

        <div className="space-y-3">
          {listingTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                className="border-border/60 cursor-pointer transition-[var(--transition-smooth)] hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
                onClick={() => router.push(type.path)}
              >
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      type.color,
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{type.label}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{type.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

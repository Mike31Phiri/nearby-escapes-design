import { Link } from "@tanstack/react-router";
import { Bus, ArrowLeft, Clock, MapPin, DollarSign, Route } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function NewRidePage() {
  const [routeName, setRouteName] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [operator, setOperator] = useState("");

  const cities = [
    "Lusaka", "Livingstone", "Kitwe", "Ndola", "Chipata",
    "Kasama", "Mongu", "Solwezi", "Mansa", "Sesheke",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link
          to="/host/new-listing"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
              <Bus className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">New ride listing</p>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-display">
            List a transport route
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a bus route, shuttle service or private transfer for travelers.
          </p>
        </header>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="route-name">Route name</Label>
            <Input
              id="route-name"
              placeholder="e.g. Lusaka to Livingstone Express"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>From</Label>
              <Select value={fromCity} onValueChange={setFromCity}>
                <SelectTrigger><SelectValue placeholder="Departure city" /></SelectTrigger>
                <SelectContent>
                  {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>To</Label>
              <Select value={toCity} onValueChange={setToCity}>
                <SelectTrigger><SelectValue placeholder="Arrival city" /></SelectTrigger>
                <SelectContent>
                  {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="operator">Operator name</Label>
            <Input
              id="operator"
              placeholder="e.g. Mazhandu Family Bus"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="duration">Estimated duration</Label>
              <Input id="duration" placeholder="e.g. 6h 30m" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (ZMW)</Label>
              <Input id="price" type="number" placeholder="0" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="departures">Departure schedule</Label>
            <Input id="departures" placeholder="e.g. 4 daily, 06:00 / 10:00 / 14:00 / 20:00" />
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Coming soon
            </p>
            <p className="text-sm text-muted-foreground">
              After this initial form, you'll be able to add vehicle details, seat maps,
              amenities and photos for your transport listing.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Button className="bg-[image:var(--gradient-hero)] hover:opacity-95">
            Save as draft
          </Button>
          <Button variant="outline" onClick={() => {}}>
            Preview
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

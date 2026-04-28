import { Link } from "@tanstack/react-router";
import { MapPin, ArrowLeft, Clock, DollarSign, Camera } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const categories = [
  "Safari & wildlife",
  "Cultural tour",
  "Adventure activity",
  "Water experience",
  "City walking tour",
  "Food & market tour",
  "Photography experience",
  "Community visit",
];

export function NewGemPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">New gem listing</p>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-display">
            List a hidden gem
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Share a tour, activity or local experience that travelers will love.
          </p>
        </header>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="gem-name">Experience name</Label>
            <Input
              id="gem-name"
              placeholder="e.g. Sunset cruise on the Zambezi"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Livingstone, Southern Province"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the experience, what guests will see and do..."
              rows={4}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" placeholder="e.g. 3 hours" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Price per person (USD)</Label>
              <Input id="price" type="number" placeholder="0" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="schedule">Schedule</Label>
            <Input id="schedule" placeholder="e.g. Daily at 08:00 and 15:00" />
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Coming soon
            </p>
            <p className="text-sm text-muted-foreground">
              After this initial form, you'll be able to add photos, itinerary details,
              inclusions/exclusions and availability calendar for your gem listing.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Button className="bg-[image:var(--gradient-hero)] hover:opacity-95">
            Save as draft
          </Button>
          <Button variant="outline">
            Preview
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

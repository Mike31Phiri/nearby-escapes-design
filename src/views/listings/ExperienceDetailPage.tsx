"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Clock,
  Compass,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Info,
  Calendar,
  Phone,
  User,
  Coffee,
  CheckCircle2,
  CalendarDays,
  Gem,
  Camera,
  Heart,
  Share2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { AuthGuardDialog } from "@/components/auth/AuthGuardDialog";
import { cn } from "@/lib/utils";
import type { Experience, Package } from "@/lib/mock-data";

// Custom premium descriptions for experiences, hidden gems, and packages
const richDescriptions: Record<string, string> = {
  e1: "Witness the sheer scale and raw power of the Victoria Falls from above in a thrilling helicopter flight! Known locally as 'Mosi-oa-Tunya' (The Smoke That Thunders), you will soar directly over the falls, the Zambezi River, and the surrounding national park. Marvel at the dramatic, deep basalt gorges and capture once-in-a-lifetime aerial photographs from custom panoramic view windows. A professional pilot provides complete narration throughout the flight.",
  e2: "Step off the safari vehicle and immerse yourself directly in the African wilderness. South Luangwa is widely celebrated as the birthplace of the walking safari. Accompanied by a highly trained, armed wildlife scout and an expert naturalist guide, you will track animal footprints, learn about medicinal bush plants, and experience direct, thrilling close encounters with giraffes, elephants, and abundant birdlife in their natural habitat.",
  e3: "Plunge into the pristine, crystal-clear turquoise waters of Lake Tanganyika—the longest freshwater lake in the world! Home to over 250 species of vibrant cichlid fish found nowhere else on earth, this snorkeling safari offers unmatched aquatic viewing. Relax on secluded sandy beaches, swim alongside colorful schools of fish, and enjoy a freshly prepared lakeside lunch on the shore.",
  e4: "Embark on an unforgettable game drive through Kafue National Park, Zambia's oldest and largest national park. Traverse diverse habitats, from riverine forests and marshlands to open dambos. Our professional tracking guide will lead you in search of lions, leopards, wild dogs, cheetahs, and massive herds of buffalo. Enjoy a classic African sundowner cocktail drink as the sun sets over the Kafue River.",
  g1: "Discover the breathtaking beauty and rich history of Shiwa Ngandu, an grand English-style manor estate nestled deep in the northern hills of Mpika. Built in the early 20th century, explore the spectacular stone mansion, historical library, and tranquil manicured gardens. The estate features a private lake, horseback trail rides, and a natural volcanic hot spring (Kapishya Hot Springs) just minutes away.",
  g2: "Trek through lush woodlands to the spectacular Kundalila Falls in Serenje. Here, the Kaombe River falls over 70 meters down a rugged cliff into a deep, scenic basalt pool. Enjoy a guided hike down the steep gorge to the base of the waterfall, swim in the cold, crystal-clear waters, and marvel at the panoramic views of the Luangwa Valley from the cliff edge.",
  g3: "Experience one of Africa's most raw, remote wildlife spectacles: the spectacular Liuwa Plain wildebeest migration. Witness thousands of wildebeests migrating across vast golden grasslands, tracked closely by hyenas, cheetahs, and lions. Ideal for serious wildlife enthusiasts, photographers, and travelers looking for an off-the-beaten-path safari adventure.",
  g4: "Set sail on a peaceful sunset cruise to the historic Chapel Island on Lake Kariba. As the sky turns to shades of vibrant orange and purple, learn about the construction of the Kariba Dam and the folklore of the local Nyami Nyami river god. Enjoy fresh drinks, tasty local snacks, and witness spectacular birdlife nesting along the island shore.",
  p1: "Escape to Livingstone for an action-packed 3-day weekend! This premium, all-inclusive package covers stay at a luxury riverfront lodge, a guided walking tour of the Victoria Falls, a scenic sunset river cruise on the Zambezi with complimentary drinks, and private airport transfers. Perfectly suited for couples or families looking to experience the adventure capital of Zambia.",
  p2: "Embark on the ultimate 5-day luxury safari in South Luangwa National Park. This all-inclusive package includes stay in a top-rated luxury safari tent, daily morning and night game drives in custom open-sided vehicles, gourmet meals prepared by a dedicated camp chef, and round-trip transfers from Mfuwe Airport. Uncover the magic of the wild in total comfort.",
  p3: "Relax and rejuvenate on the tranquil shores of Lake Kariba. This peaceful 2-day getaway features stay in a private lakefront chalet, a guided morning boat safari to spot hippos and crocodiles, fresh tiger fish lunch, and relaxing sun deck access. Unwind away from the city noise under a canopy of stars.",
};

// Premium itinerary days for packages
const packageItineraries: Record<string, { title: string; desc: string }[]> = {
  p1: [
    {
      title: "Day 1: Arrival & Sunset River Cruise",
      desc: "Arrive at Livingstone Airport and take a private luxury transfer to your riverfront lodge. In the late afternoon, board a classic wooden riverboat for a scenic sunset cruise along the Zambezi River. Enjoy premium local drinks and gourmet appetizers while watching hippos, elephants, and crocodiles.",
    },
    {
      title: "Day 2: Guided Falls Walk & Helicopter Tour",
      desc: "After breakfast, enjoy a private guided walking tour of the majestic Victoria Falls, exploring key viewpoints including the Knife Edge Bridge and Eastern Cataract. In the afternoon, experience the ultimate thrill with a 15-minute 'Flight of Angels' helicopter tour over the falls.",
    },
    {
      title: "Day 3: Cultural Tour & Departure",
      desc: "Visit a local Zambian historic village to experience local traditions, crafts, and music. Enjoy a final brunch overlooking the river before your private transfer back to Livingstone Airport for your departure.",
    },
  ],
  p2: [
    {
      title: "Day 1: South Luangwa Welcome & Night Safari",
      desc: "Fly into Mfuwe Airport and transfer to your luxury safari camp. Settled along the Luangwa River, enjoy a hot lunch and embark on your first late-afternoon game drive, transitioning into a night safari using high-powered spotlights to track leopards and lions.",
    },
    {
      title: "Day 2: Morning Walking Safari & River Cruise",
      desc: "Awake at dawn for coffee and venture out on an exciting walking safari to track tracks and wildlife up close. Return to the lodge for a midday swim, followed by an afternoon safari drive exploring river bends and lagoons.",
    },
    {
      title: "Day 3: Deep Bush Exploration",
      desc: "Spend the full day exploring the remote northern sectors of the park, stopping for a private bush picnic lunch under a canopy of giant mahogany trees. Spot rare Thornicroft's giraffes and large elephant herds.",
    },
    {
      title: "Day 4: Luxury Lodge Relaxation & Spa",
      desc: "Enjoy a leisurely morning, followed by a complimentary bush spa massage. In the late afternoon, enjoy a final game drive ending with sundowner drinks overlooking a scenic hippopotamus pool.",
    },
    {
      title: "Day 5: Farewell South Luangwa",
      desc: "Enjoy a final morning bird-watching walk and a hearty breakfast. Say goodbye to the camp staff as you transfer back to Mfuwe Airport for your flight home.",
    },
  ],
  p3: [
    {
      title: "Day 1: Kariba Welcome & Sunset Sailing",
      desc: "Arrive at your Kariba lakeside chalet. Spend the afternoon swimming in the infinity pool overlooking the lake. In the evening, set sail on a peaceful sunset cruise, enjoying local Zambian drinks as the sun dips below the horizon.",
    },
    {
      title: "Day 2: Morning Boat Safari & Farewell",
      desc: "Set out on a morning boat safari along the shores of Lake Kariba, spotting crocodiles, elephants, and beautiful fish eagles. Feast on a fresh tiger fish lunch before checking out and departing back to Lusaka.",
    },
  ],
};

interface ExperienceDetailPageProps {
  item: Experience | Package;
  backHref?: string;
}

export function ExperienceDetailPage({
  item,
  backHref = "/search?category=attractions",
}: ExperienceDetailPageProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { isAuthenticated } = useAuth();

  const isPackage = item.id.startsWith("p");
  const isGem = item.id.startsWith("g");

  // Category Label mapping
  let categoryLabel = "Attraction";
  if (isPackage) categoryLabel = "Curated Package";
  else if (isGem) categoryLabel = "Hidden Gem";

  const description =
    richDescriptions[item.id] ||
    "Discover the wonders of Zambia with our curated local tours and packages. Expert guides, premium travel setups, and verified safety ensure an unforgettable journey.";

  // Form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    timeSlot: "morning",
    adults: "1",
    children: "0",
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success(
      `Booking request submitted for "${item.name}"! Our local travel advisor will contact you within 2 hours.`,
      {
        duration: 5000,
      },
    );
  };

  const adultCount = parseInt(form.adults) || 1;
  const childCount = parseInt(form.children) || 0;

  const baseCost = item.price * adultCount;
  const childCost = Math.round(item.price * 0.5 * childCount);
  const tax = Math.round((baseCost + childCost) * 0.05);
  const total = baseCost + childCost + tax;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Back breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            href={backHref}
            className="hover:text-primary transition-colors font-medium flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back to results
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold truncate">{item.name}</span>
        </div>

        {/* Title Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border",
                  isPackage
                    ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                    : isGem
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-primary/10 text-primary border-primary/20",
                )}
              >
                {categoryLabel}
              </span>
              {"rating" in item && item.rating >= 4.8 && (
                <span className="text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Top Rated
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-2">
              {item.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {"rating" in item && (
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <strong className="text-foreground">{item.rating.toFixed(1)}</strong>
                  {"reviews" in item && <span>({item.reviews} reviews)</span>}
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" />
                {item.location}, Zambia
              </span>
            </div>
          </div>
        </div>

        {/* Banner Image */}
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] mb-8 bg-muted shadow-sm max-h-[380px]">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>

        {/* Content and Booking Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Left: details */}
          <div className="space-y-10">
            {/* Quick stats */}
            <div className="flex flex-wrap gap-5 py-5 border-y border-border/40">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4.5 w-4.5 text-primary/70" />
                <span>
                  Duration: <strong>{"duration" in item ? item.duration : "Approx 4 Hours"}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4.5 w-4.5 text-primary/70" />
                <span>
                  Group Size: <strong>Small groups (1-10 people)</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ShieldCheck className="h-4.5 w-4.5 text-primary/70" />
                <span>Verified Local Guide Included</span>
              </div>
            </div>

            {/* Overview */}
            <section>
              <h2 className="text-xl font-black tracking-tight text-foreground mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed text-[15px]">{description}</p>
            </section>

            {/* If Package: show multi-day timeline */}
            {isPackage && packageItineraries[item.id] && (
              <section>
                <h2 className="text-xl font-black tracking-tight text-foreground mb-6">
                  Holiday Itinerary
                </h2>
                <div className="space-y-6">
                  {packageItineraries[item.id].map((day, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-5 rounded-2xl bg-muted/30 border border-border/40"
                    >
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0 border border-primary/20">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-base text-foreground">{day.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{day.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Highlights / What is Included */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-black tracking-tight text-foreground mb-4">
                  Highlights
                </h2>
                <ul className="space-y-2.5">
                  {[
                    "Stunning scenery and camera spots",
                    "Fully guided by professional scouts",
                    "Off-the-beaten-track routes",
                    "Safe and secure setups",
                  ].map((hi, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{hi}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-black tracking-tight text-foreground mb-4">
                  What&apos;s Included
                </h2>
                <ul className="space-y-2.5">
                  {[
                    "Professional guide fee",
                    "Water & refreshments",
                    "All local taxes and charges",
                    "First-aid safety setup",
                  ].map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Right: Booking Form Card */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-card border border-border/40 rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Header Price */}
              <div className="bg-primary px-6 py-5 text-white">
                <p className="text-primary-foreground/80 text-xs font-bold uppercase tracking-widest mb-1">
                  {isPackage ? "All-Inclusive Rate" : "Rate starting at"}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-primary-foreground">K{item.price}</span>
                  <span className="text-primary-foreground/75 text-sm">
                    {isPackage ? "/package" : "/person"}
                  </span>
                </div>
                {"rating" in item && (
                  <div className="flex items-center gap-1 mt-1 text-primary-foreground/90 text-xs">
                    <Star className="h-3.5 w-3.5 fill-primary-foreground text-primary-foreground" />
                    <span>{item.rating.toFixed(1)} rating</span>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleBook} className="p-6 space-y-4">
                <h3 className="font-black text-lg text-foreground tracking-tight">
                  Request Booking
                </h3>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="tour-name"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      id="tour-name"
                      placeholder="Ex. John Phiri"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="pl-9 h-11 rounded-xl border-border/60"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="tour-phone"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      id="tour-phone"
                      type="tel"
                      placeholder="+260 97 XXX XXXX"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="pl-9 h-11 rounded-xl border-border/60"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="tour-date"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Date <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="tour-date"
                      type="date"
                      value={form.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      className="h-11 rounded-xl border-border/60 text-sm"
                      required
                    />
                  </div>
                </div>

                {!isPackage && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Preferred Time Slot <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.timeSlot}
                      onValueChange={(v) => setForm((f) => ({ ...f, timeSlot: v }))}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning Tour (08:30)</SelectItem>
                        <SelectItem value="afternoon">Afternoon Tour (13:30)</SelectItem>
                        <SelectItem value="evening">Sunset Tour (16:30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Adults <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.adults}
                      onValueChange={(v) => setForm((f) => ({ ...f, adults: v }))}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} Adult{n > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Children
                    </Label>
                    <Select
                      value={form.children}
                      onValueChange={(v) => setForm((f) => ({ ...f, children: v }))}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n === 0 ? "None" : `${n} Child${n > 1 ? "ren" : ""}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price Summary */}
                {form.date && (
                  <div className="rounded-xl bg-muted/50 border border-border/40 p-4 space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        Adults (K{item.price} × {adultCount})
                      </span>
                      <span className="font-semibold text-foreground">K{baseCost}</span>
                    </div>
                    {childCount > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          Children (K{Math.round(item.price * 0.5)} × {childCount})
                        </span>
                        <span className="font-semibold text-foreground">K{childCost}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>Local Tourism Levy (5%)</span>
                      <span className="font-semibold text-foreground">K{tax}</span>
                    </div>
                    <div className="flex justify-between font-black text-foreground border-t border-border/60 pt-2 mt-1">
                      <span>Total Invoice</span>
                      <span>K{total}</span>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-sm shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01]"
                >
                  Book Activity
                </Button>

                <p className="text-center text-[10px] text-muted-foreground">
                  Free cancellation up to 48 hours in advance. No initial charge.
                </p>
              </form>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from"next/link";
import { Package, MapPin, Star, Clock, ArrowRight, Sparkles } from"lucide-react";
import { Button } from"@/components/ui/button";
import { Badge } from"@/components/ui/badge";
import { mockPackages } from"@/lib/mock-data";

export function PackagesPage() {
 return (
 <div className="min-h-screen flex flex-col bg-muted font-sans">
 <main className="flex-1">
 {/* Header */}
 <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-10">
 <div className="mx-auto max-w-6xl px-4 md:px-6 pt-8 md:pt-12">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
 <Package className="h-5 w-5"/>
 </div>
 <div>
 <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
 Travel Packages
 </h1>
 <p className="text-base text-muted-foreground">
 Curated multi-day packages combining stays, transport, and experiences
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Content */}
 <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-6 pb-16">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
 {mockPackages.map((pkg) => (
 <div
 key={pkg.id}
 className="group relative rounded-2xl border border-border/50 bg-card shadow-sm card-shadow transition-all hover:shadow-lg"
 >
 {/* Image */}
 <div className="relative h-56 overflow-hidden bg-muted">
 <img
 src={pkg.image}
 alt={pkg.name}
 className="h-full w-full object-cover"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"/>
 <div className="absolute top-3 left-3">
 <Badge className="rounded-full bg-white/90 text-foreground hover:bg-white/80 text-[10px] font-bold uppercase tracking-wider shadow-sm border-0">
 <Sparkles className="h-3 w-3 mr-1 text-primary"/>
 Package
 </Badge>
 </div>
 <div className="absolute bottom-3 left-3 right-3">
 <h3 className="text-xl font-bold text-white drop-shadow-sm">{pkg.name}</h3>
 <p className="text-sm text-white/80 flex items-center gap-1 mt-0.5">
 <MapPin className="h-3 w-3"/>
 {pkg.location}
 </p>
 </div>
 </div>

 {/* Info */}
 <div className="p-4 space-y-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1">
 <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400"/>
 <span className="text-sm font-bold text-foreground">{pkg.rating}</span>
 </div>
 <div className="flex items-center gap-1 text-sm text-muted-foreground">
 <Clock className="h-3 w-3"/>
 {pkg.duration}
 </div>
 </div>
 <div className="flex items-center justify-between pt-1 border-t border-border/40">
 <div>
 <span className="text-xl font-bold text-foreground">K{pkg.price}</span>
 <span className="text-sm text-muted-foreground"> / person</span>
 </div>
 <Button size="sm"className="rounded-full text-sm font-bold h-8"asChild>
 <Link href={`/checkout/book?type=experience&id=${pkg.id}`}>
 View Details
 <ArrowRight className="h-3 w-3 ml-1"/>
 </Link>
 </Button>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </main>
 </div>
 );
}

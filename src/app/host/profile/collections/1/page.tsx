"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { ArrowLeft, LayoutGrid, Star, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HostCollectionPage() {
  const params = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10 md:py-16">
        <Link 
          href="/host/profile/1" 
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to host profile
        </Link>

        <div className="bg-muted/30 rounded-[40px] p-8 md:p-16 border border-border/40 mb-16 overflow-hidden relative">
          <div className="relative z-10 space-y-6 max-w-2xl">
             <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest">
                <LayoutGrid className="h-5 w-5" /> Curated Collection
             </div>
             <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Riverside Retreats</h1>
             <p className="text-muted-foreground text-xl leading-relaxed">
               A hand-picked selection of our most serene properties located along the banks of the Zambezi river. Perfect for those looking for peace and tranquility.
             </p>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 flex items-center justify-center">
             <LayoutGrid className="h-64 w-64 rotate-12" />
          </div>
        </div>

        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">8 Properties in this Collection</h2>
            <div className="flex items-center gap-2">
               <span className="text-sm font-bold text-muted-foreground">Sort by:</span>
               <select className="bg-transparent text-sm font-bold focus:outline-none">
                 <option>Recommended</option>
                 <option>Price: Low to High</option>
               </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {listings.slice(0, 8).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>

        <div className="mt-20 pt-20 border-t border-border/50 text-center">
           <h3 className="text-2xl font-bold mb-4">Interested in multiple properties?</h3>
           <p className="text-muted-foreground mb-8">Contact the host for special group rates or extended stay packages.</p>
           <Button className="h-14 rounded-2xl px-12 bg-primary font-extrabold text-lg shadow-xl">
             Inquire about Group Rates
           </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

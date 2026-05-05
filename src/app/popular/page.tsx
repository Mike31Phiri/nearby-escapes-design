"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { TrendingUp, Award, Flame, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PopularPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary font-extrabold text-sm uppercase tracking-widest mb-2">
              <Flame className="h-5 w-5" /> Trending Now
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Most Popular Escapes</h1>
            <p className="text-muted-foreground text-lg mt-2">Discover what other travelers are booking right now.</p>
          </div>
        </div>

        <Tabs defaultValue="stays" className="space-y-10">
          <TabsList className="bg-muted/50 p-1.5 rounded-2xl h-auto flex-wrap md:flex-nowrap">
            <TabsTrigger value="stays" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-base">
              Stays
            </TabsTrigger>
            <TabsTrigger value="transport" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-base">
              Transport
            </TabsTrigger>
            <TabsTrigger value="gems" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-base">
              Gems
            </TabsTrigger>
            <TabsTrigger value="packages" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-base">
              Packages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stays" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {listings.slice(0, 8).map((listing, index) => (
                <div key={listing.id} className="relative">
                  <div className="absolute -top-4 -left-4 z-10 h-10 w-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-black text-lg shadow-xl rotate-[-12deg]">
                    #{index + 1}
                  </div>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transport" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="col-span-full py-20 text-center bg-muted/20 rounded-[40px] border border-dashed border-border">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold">No trending transport yet</h3>
                <p className="text-muted-foreground">Check back later for popular bus routes.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gems" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {listings.slice(2, 6).map((listing, index) => (
                <div key={listing.id} className="relative">
                  <div className="absolute -top-4 -left-4 z-10 h-10 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-xl rotate-[-12deg]">
                    #{index + 1}
                  </div>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="packages" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="col-span-full py-20 text-center bg-muted/20 rounded-[40px] border border-dashed border-border">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold">Popular packages arriving soon</h3>
                <p className="text-muted-foreground">We&apos;re finalizing our most popular bundled trips.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

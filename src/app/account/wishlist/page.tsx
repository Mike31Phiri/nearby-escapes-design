"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { Heart, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function WishlistPage() {
  const [items, setItems] = useState(listings.slice(0, 4));

  const clearAll = () => {
    if (confirm("Are you sure you want to clear your wishlist?")) {
      setItems([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary font-extrabold text-sm uppercase tracking-widest mb-2">
              <Heart className="h-5 w-5 fill-primary" /> Your favorites
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Saved Wishlist</h1>
            <p className="text-muted-foreground text-lg mt-2">All the places you&apos;re dreaming about in one place.</p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={clearAll}
              className="text-sm font-bold text-muted-foreground hover:text-red-500 underline transition-colors"
            >
              Clear all items
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 animate-in fade-in duration-500">
            {items.map((listing) => (
              <div key={listing.id} className="relative group">
                <ListingCard listing={listing} />
                <button 
                  className="absolute top-4 right-4 z-20 h-10 w-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  onClick={() => setItems(items.filter(i => i.id !== listing.id))}
                >
                  <Heart className="h-5 w-5 fill-red-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in zoom-in fade-in duration-700">
            <div className="w-24 h-24 bg-muted rounded-[40px] flex items-center justify-center mb-8 rotate-12">
              <Heart className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <h2 className="text-3xl font-extrabold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10">
              When you find a place you love, click the heart icon to save it here for later.
            </p>
            <Link href="/search">
              <Button className="h-14 rounded-2xl px-12 bg-primary font-extrabold text-lg shadow-xl flex items-center gap-2">
                <Search className="h-5 w-5" /> Start exploring
              </Button>
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-24 p-12 bg-muted/30 rounded-[40px] border border-border/40 text-center">
            <h3 className="text-2xl font-bold mb-4">Need help deciding?</h3>
            <p className="text-muted-foreground mb-8">Share your wishlist with friends or family to get their opinion.</p>
            <Button variant="outline" className="h-12 rounded-xl px-8 border-2 font-bold gap-2">
              Share Wishlist <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

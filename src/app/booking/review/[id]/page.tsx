"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, Camera, Upload, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function LeaveReviewPage() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 md:px-6 py-12 md:py-20">
        {!submitted ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <Link 
              href="/account/bookings" 
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to bookings
            </Link>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Leave a Review</h1>
            <p className="text-muted-foreground text-lg mb-10">How was your stay at Victoria Falls Waterfront Lodge?</p>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Star Rating */}
              <section className="text-center p-10 bg-muted/30 rounded-[40px] border border-border/40">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Overall Rating</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        className={`h-12 w-12 transition-all ${
                          (hoveredRating || rating) >= star 
                            ? "fill-accent text-accent scale-110" 
                            : "text-muted-foreground/30"
                        }`} 
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
                <p className="mt-6 font-bold text-lg">
                  {rating === 5 && "Excellent! ❤️"}
                  {rating === 4 && "Great! 😊"}
                  {rating === 3 && "Good 🙂"}
                  {rating === 2 && "Could be better 😕"}
                  {rating === 1 && "Poor 😞"}
                  {!rating && "Select a rating"}
                </p>
              </section>

              {/* Written Review */}
              <section className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Your experience</h3>
                <Textarea 
                  placeholder="What did you love? How was the host? Anything other guests should know?" 
                  className="rounded-3xl min-h-[200px] p-6 text-lg border-border/60 focus:ring-primary/20"
                  required
                />
              </section>

              {/* Photos */}
              <section className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Add photos (optional)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/30 transition-all text-muted-foreground hover:text-primary hover:border-primary/50">
                    <Camera className="h-6 w-6" />
                    <span className="text-[10px] font-bold uppercase">Upload</span>
                  </div>
                </div>
              </section>

              <Button 
                type="submit" 
                disabled={!rating}
                className="w-full h-16 rounded-2xl bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-xl font-extrabold text-xl transition-all"
              >
                Submit Review
              </Button>
            </form>
          </div>
        ) : (
          <div className="text-center py-20 animate-in zoom-in fade-in duration-700">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Thank you!</h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto">
              Your review has been submitted. We appreciate you taking the time to share your feedback with the Nearby Escapes community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/account/bookings">
                <Button variant="outline" className="h-14 rounded-2xl px-10 border-2 font-extrabold text-lg">
                  Back to bookings
                </Button>
              </Link>
              <Link href="/">
                <Button className="h-14 rounded-2xl px-10 bg-primary font-extrabold text-lg shadow-xl">
                  Browse more
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

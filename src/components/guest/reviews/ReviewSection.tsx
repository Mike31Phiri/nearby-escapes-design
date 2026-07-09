"use client";

import { Star, ChevronLeft, ChevronRight, MessageSquare } from"lucide-react";

interface Review {
 id: string;
 author: string;
 rating: number;
 content: string;
 date: string;
}

interface ReviewSectionProps {
 listingId: string;
 listingName?: string;
 listingType?: string;
 reviews?: Review[];
}

export function ReviewSection({
 listingId,
 listingName,
 listingType,
 reviews = [],
}: ReviewSectionProps) {
 return (
 <section className="space-y-5">
 <div className="flex items-center gap-2">
 <MessageSquare className="h-4 w-4 text-primary"/>
 <h2 className="text-xl font-bold tracking-tight text-foreground">Reviews</h2>
 {reviews.length > 0 && (
 <span className="text-sm text-muted-foreground font-medium">({reviews.length})</span>
 )}
 </div>

 {reviews.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border/50 bg-card/30 card-shadow">
 <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
 <MessageSquare className="h-6 w-6 text-muted-foreground/40"/>
 </div>
 <h4 className="text-base font-bold text-foreground">No reviews yet</h4>
 <p className="text-sm text-muted-foreground mt-1 max-w-xs">
 Be the first to leave a review for this listing!
 </p>
 </div>
 ) : (
 <div className="relative flex items-center">
 {/* Left arrow */}
 <button
 onClick={() => {
 const el = document.getElementById("reviews-scroll");
 el?.scrollBy({ left: -350, behavior:"smooth"});
 }}
 className="hidden md:flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-white border border-border/60 shadow-sm hover:bg-muted transition-all -ml-1 mr-2 z-10"
 aria-label="Scroll reviews left"
 >
 <ChevronLeft className="h-4 w-4 text-foreground"/>
 </button>

 {/* Scrollable reviews */}
 <div
 id="reviews-scroll"
 className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth flex-1 py-1"
 >
 {reviews.map((review) => (
 <div
 key={review.id}
 className="min-w-[300px] md:min-w-[360px] shrink-0 group rounded-xl border border-border/50 bg-card p-5 shadow-sm card-shadow transition-all duration-300 hover:shadow-md"
 >
 {/* Author & Date */}
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2.5">
 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base">
 {review.author.charAt(0).toUpperCase()}
 </div>
 <div>
 <p className="text-base font-semibold text-foreground leading-tight">
 {review.author}
 </p>
 <p className="text-[10px] text-muted-foreground font-medium">{review.date}</p>
 </div>
 </div>
 <div className="flex items-center gap-0.5">
 <Star className="h-3.5 w-3.5 fill-accent text-accent"/>
 <span className="text-sm font-bold text-foreground">{review.rating}</span>
 </div>
 </div>

 {/* Star indicators */}
 <div className="flex items-center gap-0.5 mb-2.5">
 {Array.from({ length: 5 }).map((_, i) => (
 <span
 key={i}
 className={`text-sm ${
 i < review.rating ?"text-accent":"text-gray-200 dark:text-gray-700"
 }`}
 >
 ★
 </span>
 ))}
 </div>

 {/* Content */}
 <p className="text-base text-muted-foreground leading-relaxed line-clamp-4">
 {review.content}
 </p>
 </div>
 ))}
 </div>

 {/* Right arrow */}
 <button
 onClick={() => {
 const el = document.getElementById("reviews-scroll");
 el?.scrollBy({ left: 350, behavior:"smooth"});
 }}
 className="hidden md:flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-white border border-border/60 shadow-sm hover:bg-muted transition-all ml-2 -mr-1 z-10"
 aria-label="Scroll reviews right"
 >
 <ChevronRight className="h-4 w-4 text-foreground"/>
 </button>
 </div>
 )}
 </section>
 );
}

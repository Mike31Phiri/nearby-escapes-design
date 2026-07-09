"use client";

import { useState } from"react";
import Link from"next/link";
import { useRouter } from"next/navigation";
import { toast } from"sonner";
import {
 ChevronLeft,
 ChevronRight,
 Clock,
 Compass,
 MapPin,
 ShieldCheck,
 Star,
 Users,
 CheckCircle2,
 XCircle,
 Heart,
 Share2,
 Sparkles,
 MessageCircle,
 Map,
 ImageIcon,
 X,
} from"lucide-react";
import { ReviewSection } from"@/components/guest/reviews/ReviewSection";
import { cn } from"@/lib/utils";
import type { Experience, Package } from"@/lib/mock-data";
import { mockListingReviews } from"@/lib/mock-listing-reviews";
import { useAuth } from"@/lib/store/authStore";
import { useWishlistStore } from"@/store/wishlistStore";
import { AuthGuardDialog } from"@/components/guest/auth/AuthGuardDialog";

// Custom premium descriptions for experiences, hidden gems, and packages
const richDescriptions: Record<string, string> = {
 e1:"Witness the sheer scale and raw power of the Victoria Falls from above in a thrilling helicopter flight! Known locally as 'Mosi-oa-Tunya' (The Smoke That Thunders), you will soar directly over the falls, the Zambezi River, and the surrounding national park. Marvel at the dramatic, deep basalt gorges and capture once-in-a-lifetime aerial photographs from custom panoramic view windows. A professional pilot provides complete narration throughout the flight.",
 e2:"Step off the safari vehicle and immerse yourself directly in the African wilderness. South Luangwa is widely celebrated as the birthplace of the walking safari. Accompanied by a highly trained, armed wildlife scout and an expert naturalist guide, you will track animal footprints, learn about medicinal bush plants, and experience direct, thrilling close encounters with giraffes, elephants, and abundant birdlife in their natural habitat.",
 e3:"Plunge into the pristine, crystal-clear turquoise waters of Lake Tanganyika—the longest freshwater lake in the world! Home to over 250 species of vibrant cichlid fish found nowhere else on earth, this snorkeling safari offers unmatched aquatic viewing. Relax on secluded sandy beaches, swim alongside colorful schools of fish, and enjoy a freshly prepared lakeside lunch on the shore.",
 e4:"Embark on an unforgettable game drive through Kafue National Park, Zambia's oldest and largest national park. Traverse diverse habitats, from riverine forests and marshlands to open dambos. Our professional tracking guide will lead you in search of lions, leopards, wild dogs, cheetahs, and massive herds of buffalo. Enjoy a classic African sundowner cocktail drink as the sun sets over the Kafue River.",
 g1:"Discover the breathtaking beauty and rich history of Shiwa Ngandu, an grand English-style manor estate nestled deep in the northern hills of Mpika. Built in the early 20th century, explore the spectacular stone mansion, historical library, and tranquil manicured gardens. The estate features a private lake, horseback trail rides, and a natural volcanic hot spring (Kapishya Hot Springs) just minutes away.",
 g2:"Trek through lush woodlands to the spectacular Kundalila Falls in Serenje. Here, the Kaombe River falls over 70 meters down a rugged cliff into a deep, scenic basalt pool. Enjoy a guided hike down the steep gorge to the base of the waterfall, swim in the cold, crystal-clear waters, and marvel at the panoramic views of the Luangwa Valley from the cliff edge.",
 g3:"Experience one of Africa's most raw, remote wildlife spectacles: the spectacular Liuwa Plain wildebeest migration. Witness thousands of wildebeests migrating across vast golden grasslands, tracked closely by hyenas, cheetahs, and lions. Ideal for serious wildlife enthusiasts, photographers, and travelers looking for an off-the-beaten-path safari adventure.",
 g4:"Set sail on a peaceful sunset cruise to the historic Chapel Island on Lake Kariba. As the sky turns to shades of vibrant orange and purple, learn about the construction of the Kariba Dam and the folklore of the local Nyami Nyami river god. Enjoy fresh drinks, tasty local snacks, and witness spectacular birdlife nesting along the island shore.",
 p1:"Escape to Livingstone for an action-packed 3-day weekend! This premium, all-inclusive package covers stay at a luxury riverfront lodge, a guided walking tour of the Victoria Falls, a scenic sunset river cruise on the Zambezi with complimentary drinks, and private airport transfers. Perfectly suited for couples or families looking to experience the adventure capital of Zambia.",
 p2:"Embark on the ultimate 5-day luxury safari in South Luangwa National Park. This all-inclusive package includes stay in a top-rated luxury safari tent, daily morning and night game drives in custom open-sided vehicles, gourmet meals prepared by a dedicated camp chef, and round-trip transfers from Mfuwe Airport. Uncover the magic of the wild in total comfort.",
 p3:"Relax and rejuvenate on the tranquil shores of Lake Kariba. This peaceful 2-day getaway features stay in a private lakefront chalet, a guided morning boat safari to spot hippos and crocodiles, fresh tiger fish lunch, and relaxing sun deck access. Unwind away from the city noise under a canopy of stars.",
};

const packageItineraries: Record<string, { title: string; desc: string }[]> = {
 p1: [
 { title:"Day 1: Arrival & Sunset River Cruise", desc:"Arrive at Livingstone Airport and take a private luxury transfer to your riverfront lodge. In the late afternoon, board a classic wooden riverboat for a scenic sunset cruise along the Zambezi River. Enjoy premium local drinks and gourmet appetizers while watching hippos, elephants, and crocodiles."},
 { title:"Day 2: Guided Falls Walk & Helicopter Tour", desc:"After breakfast, enjoy a private guided walking tour of the majestic Victoria Falls, exploring key viewpoints including the Knife Edge Bridge and Eastern Cataract. In the afternoon, experience the ultimate thrill with a 15-minute 'Flight of Angels' helicopter tour over the falls."},
 { title:"Day 3: Cultural Tour & Departure", desc:"Visit a local Zambian historic village to experience local traditions, crafts, and music. Enjoy a final brunch overlooking the river before your private transfer back to Livingstone Airport for your departure."},
 ],
 p2: [
 { title:"Day 1: South Luangwa Welcome & Night Safari", desc:"Fly into Mfuwe Airport and transfer to your luxury safari camp. Settled along the Luangwa River, enjoy a hot lunch and embark on your first late-afternoon game drive, transitioning into a night safari using high-powered spotlights to track leopards and lions."},
 { title:"Day 2: Morning Walking Safari & River Cruise", desc:"Awake at dawn for coffee and venture out on an exciting walking safari to track tracks and wildlife up close. Return to the lodge for a midday swim, followed by an afternoon safari drive exploring river bends and lagoons."},
 { title:"Day 3: Deep Bush Exploration", desc:"Spend the full day exploring the remote northern sectors of the park, stopping for a private bush picnic lunch under a canopy of giant mahogany trees. Spot rare Thornicroft's giraffes and large elephant herds."},
 { title:"Day 4: Luxury Lodge Relaxation & Spa", desc:"Enjoy a leisurely morning, followed by a complimentary bush spa massage. In the late afternoon, enjoy a final game drive ending with sundowner drinks overlooking a scenic hippopotamus pool."},
 { title:"Day 5: Farewell South Luangwa", desc:"Enjoy a final morning bird-watching walk and a hearty breakfast. Say goodbye to the camp staff as you transfer back to Mfuwe Airport for your flight home."},
 ],
 p3: [
 { title:"Day 1: Kariba Welcome & Sunset Sailing", desc:"Arrive at your Kariba lakeside chalet. Spend the afternoon swimming in the infinity pool overlooking the lake. In the evening, set sail on a peaceful sunset cruise, enjoying local Zambian drinks as the sun dips below the horizon."},
 { title:"Day 2: Morning Boat Safari & Farewell", desc:"Set out on a morning boat safari along the shores of Lake Kariba, spotting crocodiles, elephants, and beautiful fish eagles. Feast on a fresh tiger fish lunch before checking out and departing back to Lusaka."},
 ],
};

function getRatingDistribution(reviews: { rating: number }[]) {
 const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
 reviews.forEach((r) => {
 const key = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
 if (key >= 1 && key <= 5) dist[key]++;
 });
 const total = reviews.length || 1;
 return Object.entries(dist).map(([star, count]) => ({
 star: Number(star),
 count,
 percentage: (count / total) * 100,
 }));
}

interface ExperienceDetailPageProps {
 item: Experience | Package | any;
 backHref?: string;
}

export function ExperienceDetailPage({ item, backHref ="/experiences"}: ExperienceDetailPageProps) {
 const router = useRouter();
 const isPackage = item.id.startsWith("p");
 const isGem = item.id.startsWith("g");
 const [showAuthDialog, setShowAuthDialog] = useState(false);
 const { isAuthenticated } = useAuth();
 const { isSaved, addItem, removeItem } = useWishlistStore();
 const isFavorited = isSaved(item.id);

 let categoryLabel ="Attraction";
 if (isPackage) categoryLabel ="Curated Package";
 else if (isGem) categoryLabel ="Hidden Gem";

 const description = richDescriptions[item.id] ||"Join local expert Kapasa on a 4-hour journey along the Zambezi. This isn't just a standard safari—it's an eye-opening dive into the local ecosystem. Spot hippos, crocodiles, and over 30 species of birds while Kapasa shares the cultural significance of the river to the local communities. We end with a breathtaking sunset river cruise.";

 const reviews = mockListingReviews[item.id] || [];
 const avgRating ="rating"in item ? item.rating : 4.9;
 const reviewCount ="reviews"in item ? item.reviews : 78;
 const ratingDist = getRatingDistribution(reviews);

 const handleToggleFavorite = () => {
 if (isFavorited) {
 removeItem(item.id);
 toast.success(`Removed from collections`);
 } else {
 addItem(item);
 toast.success(`Saved to collections`, {
 icon: <Heart className="h-4 w-4 fill-purple text-purple"/>,
 });
 }
 };

 const itineraryToUse = packageItineraries[item.id] || [
 { title:"2:00 PM — Meet at the Marina", desc:"Greet the group and get a quick safety briefing from Kapasa."},
 { title:"2:30 PM — Wildlife Spotting Begins", desc:"Cruise upriver. Spot hippos, crocodiles, and local birdlife. Educational commentary included."},
 { title:"5:15 PM — Sunset on the River", desc:"Anchor at a scenic viewpoint. Enjoy complimentary Zambian snacks and drinks as the sun sets."},
 { title:"6:00 PM — Return to Marina", desc:"Transfer back to the meeting point with memories and new friends."},
 ];

 const [activeImg, setActiveImg] = useState(0);
 const images = [
 item.image ||"https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=1100&q=80",
"https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1100&q=80",
"https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1100&q=80"
 ];
 const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
 const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

 return (
 <div className="bg-white-warm text-black font-sans min-h-screen">
 <main className="max-w-[1100px] mx-auto px-4 pt-4 pb-28 lg:pb-8">
 
 {/* Breadcrumb */}
 <nav className="flex flex-wrap items-center text-xs text-black-faint mb-4">
 <Link href="/"className="hover:text-purple transition-colors">Home</Link> <span className="mx-1.5 text-black-muted/50">›</span>
 <Link href="/explore"className="hover:text-purple transition-colors">Explore</Link> <span className="mx-1.5 text-black-muted/50">›</span>
 <Link href="/zambia"className="hover:text-purple transition-colors">Zambia</Link> <span className="mx-1.5 text-black-muted/50">›</span>
 <Link href={backHref} className="hover:text-purple transition-colors">Experiences</Link> <span className="mx-1.5 text-black-muted/50">›</span>
 <span className="text-black font-medium">{item.name ||"Mosi-oa-Tunya Safari & River Cruise"}</span>
 </nav>

 {/* Full-Width Hero Gallery */}
 <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-6 group">
 <img 
 src={images[activeImg]} 
 className="w-full h-full object-cover"
 alt={item.name} 
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>

 <button
 onClick={(e) => { e.stopPropagation(); prevImg(); }}
 className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/70 backdrop-blur-sm text-black flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
 >
 <ChevronLeft className="h-6 w-6"/>
 </button>
 <button
 onClick={(e) => { e.stopPropagation(); nextImg(); }}
 className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/70 backdrop-blur-sm text-black flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
 >
 <ChevronRight className="h-6 w-6"/>
 </button>
 
 {/* Badges over the image */}
 <div className="absolute top-4 left-4 flex flex-col gap-2">
 <span className="bg-purple/90 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm flex items-center gap-1.5">
 <Compass className="h-3.5 w-3.5"/> Expert local guide
 </span>
 </div>
 
 {/* Action Buttons */}
 <div className="absolute bottom-4 right-4 flex gap-2">
 <button 
 onClick={handleToggleFavorite}
 className="bg-white/90 backdrop-blur-sm h-9 w-9 rounded-lg shadow-lg flex items-center justify-center hover:bg-white transition-colors text-black"
 >
 <Heart className={cn("h-4 w-4", isFavorited ?"fill-purple text-purple":"text-black")} />
 </button>
 <button className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-2 hover:bg-white transition-colors text-black">
 <ImageIcon className="w-4 h-4"/>
 32 photos
 </button>
 </div>
 </div>

 {/* Main Info + Booking Sidebar Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
 
 {/* LEFT COLUMN: Research-backed Trust & Info */}
 <div className="space-y-6 divide-y divide-white-soft">
 
 {/* Title & Host */}
 <div className="pt-2">
 <div className="flex justify-between items-start">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-black">{item.name ||"Mosi-oa-Tunya Safari & River Cruise"}</h1>
 <div className="mt-1 text-sm text-black-soft font-medium flex flex-wrap items-center gap-y-2 gap-x-4">
 <span className="flex items-center gap-1">
 <span className="bg-gold text-white px-2 py-0.5 rounded text-xs font-bold">{avgRating.toFixed(1)}</span>
 ({reviewCount} reviews)
 </span>
 <span className="text-purple font-semibold">Hosted by Guide Kapasa</span>
 <span className="text-[10px] bg-purple-muted text-purple px-2 py-0.5 rounded-full font-bold border border-purple-border/20 flex items-center gap-1">
 <ShieldCheck className="h-3 w-3"/> Trained Local Expert
 </span>
 </div>
 <p className="text-xs text-purple mt-2 font-script text-lg">A premium adventure, accessible to the curious youth explorer.</p>
 </div>
 </div>
 
 {/* Quick Facts */}
 <div className="flex flex-wrap gap-4 mt-4 text-sm text-black-soft bg-white-soft/50 p-3 rounded-xl border border-white-soft">
 <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-purple"/> <span className="font-medium">{"duration"in item ? item.duration :"4 hours"}</span></span>
 <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-purple"/> <span className="font-medium">Max 8 people</span></span>
 <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4 text-purple"/> <span className="font-medium">Live English guide</span></span>
 <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-purple"/> <span className="font-medium">{item.location ||"Livingstone Marina"}</span></span>
 </div>
 </div>

 {/* The Overview */}
 <div className="pt-6">
 <h2 className="font-semibold text-lg text-black">About this {categoryLabel.toLowerCase()}</h2>
 <p className="text-sm text-black-soft leading-relaxed mt-2">{description}</p>
 <p className="text-xs text-black-faint mt-2 italic flex items-center gap-1">
 <Sparkles className="h-3.5 w-3.5 text-gold"/> Educational, immersive, and designed for the next generation of conscious travelers.
 </p>
 </div>

 {/* The Itinerary */}
 <div className="pt-6">
 <h2 className="font-semibold text-lg text-black">{isPackage ?"Holiday Itinerary":"What you'll do (Itinerary)"}</h2>
 <div className="relative mt-4 pl-6 space-y-6 border-l-2 border-purple/30 ml-2">
 {itineraryToUse.map((day, idx) => (
 <div key={idx} className="relative">
 <div className="absolute -left-[31px] top-0 w-3 h-3 bg-purple rounded-full ring-4 ring-purple/10"></div>
 <p className="font-semibold text-sm text-black">{day.title}</p>
 <p className="text-xs text-black-soft mt-1 leading-relaxed">{day.desc}</p>
 </div>
 ))}
 </div>
 </div>

 {/* What's Included */}
 <div className="pt-6">
 <h2 className="font-semibold text-lg text-black">What's included & what to bring</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-3 text-sm">
 <div className="bg-green-50 text-green-800 p-2.5 rounded-lg flex items-center gap-2">
 <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0"/> Bottled water & local snacks
 </div>
 <div className="bg-green-50 text-green-800 p-2.5 rounded-lg flex items-center gap-2">
 <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0"/> Life jacket & binoculars
 </div>
 <div className="bg-red-50 text-red-800 p-2.5 rounded-lg flex items-center gap-2">
 <XCircle className="h-5 w-5 text-red-600 shrink-0"/> Alcohol & glass bottles
 </div>
 <div className="bg-red-50 text-red-800 p-2.5 rounded-lg flex items-center gap-2">
 <XCircle className="h-5 w-5 text-red-600 shrink-0"/> High heels (unsafe for boat)
 </div>
 </div>
 <p className="text-xs text-black-faint mt-3 italic">Bring a camera, sunscreen, and a light jacket for the breeze.</p>
 </div>

 {/* Location & Meeting Point */}
 <div className="pt-6">
 <h2 className="font-semibold text-lg text-black">Meeting point & logistics</h2>
 <p className="text-sm text-black-soft leading-relaxed mt-2">
 <strong>Address:</strong> {item.location ||"Livingstone Marina, right next to the falls viewing point."} <br />
 <span className="text-purple font-medium flex items-center gap-1 mt-1"><Sparkles className="h-3.5 w-3.5"/> Pro-tip for budget travelers:</span> Take the local minibus to the Marina for just K15. The guide will send you exact GPS coordinates upon booking.
 </p>
 <div className="w-full h-40 bg-white-soft rounded-xl mt-3 flex items-center justify-center border border-white-soft relative overflow-hidden">
 <Map className="absolute inset-0 w-full h-full text-black-faint opacity-10 object-cover"/>
 <span className="text-black-soft text-sm flex items-center gap-1 z-10 bg-white/80 px-4 py-2 rounded-lg font-medium shadow-sm backdrop-blur-sm">
 <MapPin className="h-4 w-4 text-purple"/> View on map (Exact pin shared after booking)
 </span>
 </div>
 </div>

 {/* Reviews */}
 <div className="pt-6">
 <div className="flex items-center justify-between">
 <h2 className="font-semibold text-lg flex items-center gap-2 text-black">
 <span className="bg-gold text-white px-2 py-0.5 rounded text-sm">{avgRating.toFixed(1)}</span> · {reviewCount} reviews
 </h2>
 <button className="text-purple text-xs font-semibold hover:underline">Read all reviews</button>
 </div>
 <div className="mt-4 space-y-4">
 {reviews.slice(0, 2).map((rev: any, i: number) => (
 <div key={i} className="bg-white p-4 rounded-xl border border-white-soft">
 <div className="flex items-center justify-between">
 <span className="font-semibold text-sm text-black">{rev.userName}</span>
 <span className="text-xs text-black-faint">{rev.date}</span>
 </div>
 <p className="text-sm text-black-soft mt-1">"{rev.comment}"</p>
 </div>
 ))}
 {reviews.length === 0 && (
 <>
 <div className="bg-white p-4 rounded-xl border border-white-soft">
 <div className="flex items-center justify-between"><span className="font-semibold text-sm text-black">Sipho (Student, 23)</span><span className="text-xs text-black-faint">Jan 2026</span></div>
 <p className="text-sm text-black-soft mt-1">"Kapasa is a legend! He made the history of the Zambezi so interesting. The boat was comfortable, and the price was unbeatable for a full 4-hour safari. Definitely recommend to all my friends."</p>
 </div>
 <div className="bg-white p-4 rounded-xl border border-white-soft">
 <div className="flex items-center justify-between"><span className="font-semibold text-sm text-black">Grace</span><span className="text-xs text-black-faint">Dec 2025</span></div>
 <p className="text-sm text-black-soft mt-1">"Went on this with a group of 6. We had the boat to ourselves! Saw a huge pod of hippos. The sunset was magical. A must-do for any young adventurer."</p>
 </div>
 </>
 )}
 </div>
 </div>

 {/* Meet the Guide */}
 <div className="pt-6">
 <h2 className="font-semibold text-lg text-black">Meet your local guide</h2>
 <div className="flex items-center gap-4 mt-4">
 <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"className="w-14 h-14 rounded-full object-cover border-2 border-gold"alt="Guide"/>
 <div>
 <p className="font-semibold text-sm text-black">Kapasa Mwansa</p>
 <p className="text-xs text-black-muted flex items-center gap-1">
 <span className="bg-green-500 w-2 h-2 rounded-full inline-block"></span> Responds within 30 minutes
 </p>
 <p className="text-xs text-black-muted mt-0.5">Licensed Tour Guide · Speaks English & Nyanja</p>
 <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] bg-purple-muted text-purple px-2 py-0.5 rounded-full font-bold border border-purple-border/20">
 <Compass className="h-3 w-3"/> Community Trained Guide
 </span>
 </div>
 </div>
 <p className="text-sm text-black-soft mt-3 italic">
"I've been guiding on the Zambezi for 5 years. My goal is to show young Zambians the beauty of our own backyard. Every booking directly supports my family and local youth training programs."
 </p>
 </div>
 </div>

 {/* RIGHT COLUMN: The Booking Card */}
 <div className="relative">
 <div className="bg-white border border-white-soft rounded-2xl p-6 shadow-lg sticky top-24">
 
 <div className="flex items-center justify-between border-b border-white-soft pb-4">
 <div>
 <span className="text-2xl font-bold text-black">K{item.price ||"850"}</span> <span className="text-xs text-black-muted font-medium">/ per person</span>
 </div>
 <div className="text-sm text-black-soft font-medium flex items-center gap-1">
 <span className="bg-gold text-white px-1.5 py-0.5 rounded text-xs font-bold">{avgRating.toFixed(1)}</span> Exceptional
 </div>
 </div>
 
 {/* FOMO / Scarcity */}
 <div className="mt-4 p-2 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-800 text-xs font-semibold">
 <span className="w-2 h-2 bg-red-500 rounded-full inline-block animate-pulse shrink-0"></span>
 Only 4 spots left for August 15th!
 </div>
 
 <div className="py-4 space-y-3">
 {/* Date Picker */}
 <div className="bg-white-warm rounded-lg p-3 border border-white-soft flex justify-between items-center cursor-pointer hover:border-purple transition-colors">
 <div>
 <span className="text-[10px] text-black-faint block font-medium">SELECT DATE</span>
 <span className="text-sm font-semibold text-black">Aug 15, 2026</span>
 </div>
 <button className="text-xs border border-white-soft rounded px-2 py-1 bg-white hover:bg-white-warm transition-colors text-black-soft">Change</button>
 </div>
 
 {/* Group Size */}
 <div className="bg-white-warm rounded-lg p-3 border border-white-soft flex justify-between items-center cursor-pointer hover:border-purple transition-colors">
 <div>
 <span className="text-[10px] text-black-faint block font-medium">TRAVELERS</span>
 <span className="text-sm font-semibold text-black">2 adults</span>
 </div>
 <button className="text-xs border border-white-soft rounded px-2 py-1 bg-white hover:bg-white-warm transition-colors text-black-soft">Edit</button>
 </div>

 {/* Price Breakdown */}
 <div className="pt-3 border-t border-white-soft space-y-1.5 text-sm">
 <div className="flex justify-between text-black-soft">
 <span>2 people x K{item.price ||"850"}</span>
 <span>K{((item.price || 850) * 2).toLocaleString()}</span>
 </div>
 <div className="flex justify-between text-black-soft">
 <span>Gear & refreshments</span>
 <span className="text-green-600 font-medium">Included</span>
 </div>
 <div className="flex justify-between text-black font-bold border-t border-white-soft pt-2 mt-1">
 <span>Total (ZMW)</span>
 <span>K{((item.price || 850) * 2).toLocaleString()}</span>
 </div>
 <p className="text-[10px] text-purple font-bold text-center mt-1">Direct booking. No platform service fees!</p>
 </div>
 </div>
 
 {/* Cancellation policy */}
 <div className="mb-4 text-center">
 <span className="text-[10px] text-black-muted bg-white-warm px-2 py-1.5 rounded-full inline-flex items-center gap-1 font-medium">
 <Clock className="w-3 h-3"/> Free cancellation up to 24 hours before
 </span>
 </div>

 <button 
 onClick={() => router.push(`/checkout/book?type=${isPackage ? 'package' : 'experience'}&id=${item.id}`)}
 className="w-full bg-purple text-white rounded-xl py-3.5 font-semibold hover:bg-purple-hover transition-colors text-base shadow-md shadow-purple/20"
 >
 Book your adventure
 </button>
 </div>
 </div>
 </div>

 {/* Similar Experiences Section */}
 <section className="mt-16 pt-8 border-t border-white-soft">
 <h2 className="text-xl font-bold text-black mb-6">More {categoryLabel.toLowerCase()}s you might like</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {[
 { id:"sim-e1", name:"Helicopter Flight of Angels", location:"Livingstone", price:"K3,500", rating: 5.0, img:"https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=600&q=80"},
 { id:"sim-e2", name:"South Luangwa Walking Safari", location:"South Luangwa", price:"K1,200", rating: 4.9, img:"https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80"},
 { id:"sim-e3", name:"Kafue River Canoe Safari", location:"Kafue NP", price:"K750", rating: 4.7, img:"https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=80"},
 ].map((simItem) => (
 <Link href={`/experiences/${simItem.id}`} key={simItem.id} className="group block">
 <div className="w-full h-48 rounded-xl bg-white-soft overflow-hidden mb-3 relative">
 <img src={simItem.img} alt={simItem.name} className="w-full h-full object-cover"/>
 <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
 <Heart className="h-4 w-4 text-black hover:text-purple transition-colors"/>
 </button>
 </div>
 <div className="flex justify-between items-start">
 <div>
 <h3 className="font-semibold text-black group-hover:text-purple transition-colors truncate">{simItem.name}</h3>
 <p className="text-sm text-black-muted">{simItem.location}</p>
 </div>
 <div className="flex items-center gap-1 text-sm font-semibold text-black shrink-0">
 <span className="bg-gold text-white px-1.5 py-0.5 rounded text-[10px]">{simItem.rating}</span>
 </div>
 </div>
 <p className="text-sm text-black font-semibold mt-1">{simItem.price} <span className="font-normal text-black-faint">/ person</span></p>
 </Link>
 ))}
 </div>
 </section>
 </main>

 {/* MOBILE STICKY BOTTOM BAR */}
 <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-white-soft p-4 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
 <div>
 <div className="flex items-center gap-2">
 <span className="text-xl font-bold text-black">K{item.price ||"850"}</span> <span className="text-xs text-black-muted">/ person</span>
 </div>
 <div className="text-xs text-black-muted flex items-center gap-1">
 <span className="text-red-700 font-bold">Only 4 spots left!</span> · <span className="bg-gold text-white px-1 py-0.5 rounded text-[10px] font-bold">{avgRating.toFixed(1)}</span>
 </div>
 </div>
 <button 
 onClick={() => router.push(`/checkout/book?type=${isPackage ? 'package' : 'experience'}&id=${item.id}`)}
 className="bg-purple text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-purple-hover transition-colors text-sm flex-1 ml-4 max-w-[140px]"
 >
 Book now
 </button>
 </div>

 <AuthGuardDialog
 isOpen={showAuthDialog}
 onClose={() => setShowAuthDialog(false)}
 title="Save to your collections"
 description="Sign in to save this experience and access it from any device."
 />
 </div>
 );
}

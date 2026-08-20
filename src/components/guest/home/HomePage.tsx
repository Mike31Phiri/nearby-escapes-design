"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DateRange } from "@/components/ui/DateRangePicker";
import { Home, ArrowRight, Star } from "lucide-react";
import {
    Tent,
    Buildings,
    SealCheck,
    MapPin,
} from "@phosphor-icons/react";
import { SearchBar } from "@/components/shared/SearchBar";
import { ListingCard } from "@/components/guest/ListingCard";
import { mockStays, mockExperiences, mockTransport, mockPackages } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ── Data ──────────────────────────────────────────────────────────────────────

const categories = [
    { id: "explore", label: "Explore" },
    { id: "stays", label: "Stays" },
    { id: "experiences", label: "Experiences" },
    { id: "transport", label: "Transport" },
    { id: "packages", label: "Packages" },
];

const valueProps = [
    { icon: Tent, title: "Hidden Finds", desc: "Escapes you won't find on other platforms. Curated, vetted, and waiting to be discovered." },
    { icon: Buildings, title: "Affordable & Premium", desc: "Budget-friendly stays that don't compromise on quality, character or experience." },
    { icon: SealCheck, title: "Verified Hosts", desc: "Every host is verified by our team before going live. You're always in safe hands." },
    { icon: MapPin, title: "Local Experts", desc: "A Zambia-based team with insider knowledge of the best stays, routes, and tours." },
];

const flashDeals = [
    { id: "deal-1", name: "Kafue River Lodge", location: "Kafue National Park", originalPrice: 380, dealPrice: 266, discount: 30, badge: "Flash Sale", ends: "2 days left", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80" },
    { id: "deal-2", name: "Bush Camp Adventure", location: "South Luangwa", originalPrice: 280, dealPrice: 210, discount: 25, badge: "Weekend Deal", ends: "5 days left", image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80" },
    { id: "deal-3", name: "Lusaka Boutique Stay", location: "Lusaka", originalPrice: 120, dealPrice: 90, discount: 25, badge: "Last Minute", ends: "1 day left", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80" },
    { id: "deal-4", name: "Lake Kariba Retreat", location: "Kariba", originalPrice: 195, dealPrice: 146, discount: 25, badge: "Limited Spots", ends: "3 days left", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80" },
    { id: "deal-5", name: "Victoria Falls Hotel", location: "Livingstone", originalPrice: 320, dealPrice: 256, discount: 20, badge: "Hot Deal", ends: "4 days left", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionHeader({
    title,
    desc,
    href,
    seeAllLabel = "See all",
    as: Heading = "h2",
    hideDescOnMobile = false,
}: {
    title: string;
    desc: string;
    href?: string;
    seeAllLabel?: string;
    as?: "h2" | "h3";
    hideDescOnMobile?: boolean;
}) {
    return (
        <div className="flex items-end justify-between mb-6 md:mb-7">
            <div>
                <Heading className="font-display text-xl md:text-2xl font-bold tracking-tight text-black leading-[1.15]">
                    {title}
                </Heading>
                <p className={cn("text-black-muted mt-1.5 text-base max-w-lg leading-relaxed", hideDescOnMobile && "hidden md:block")}>
                    {desc}
                </p>
            </div>
            {href && (
                <Link
                    href={href}
                    className="hidden md:inline-flex items-center gap-1.5 text-base font-semibold text-purple hover:text-purple-hover transition-all group shrink-0"
                >
                    <span>{seeAllLabel}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
                </Link>
            )}
        </div>
    );
}

function MobileSeeAll({ href, label }: { href: string; label: string }) {
    return (
        <div className="mt-5 text-center md:hidden">
            <Link
                href={href}
                className="inline-flex items-center gap-1.5 text-base font-semibold text-purple hover:text-purple-hover transition-all group"
            >
                <span>{label}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
            </Link>
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function HomePage() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("stays");

    const handleSearch = (term: string, _dates: DateRange, _guests: number) => {
        const targetRoute = activeCategory === "explore" ? "stays" : activeCategory;
        const params = new URLSearchParams();
        if (term) params.set("q", term);
        router.push(`/${targetRoute}?${params.toString()}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white-warm overflow-x-hidden">

            {/* ── HERO ───────────*/}
            <section className="relative pt-10 pb-8 md:pt-20 md:pb-28 overflow-hidden bg-white-warm">
                <div className="relative mx-auto max-w-7xl px-4 md:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="font-display text-[1.75rem] md:text-[2.75rem] lg:text-[3rem] font-bold tracking-tight text-black leading-[1.15]">
                            <span className="md:hidden">
                                Find your next{" "}
                                <span className="font-script text-[1.3em] font-normal text-black lowercase relative -top-0.5">escape</span>{""}
                            </span>
                            <span className="hidden md:inline">
                                Find an{" "}
                                <span className="font-script text-[1.3em] font-normal text-black lowercase relative -top-0.5">escape</span>
                                <br />that suits you
                            </span>
                        </h1>
                    </div>
                </div>
            </section>

            {/* ── CATEGORY TABS & SEARCH BAR ─────*/}
            <div className="relative z-20 mt-2 md:-mt-20 mx-auto max-w-2xl px-3 md:px-4 w-full">
                {/* ── CATEGORY TABS ──*/}
                <div className="flex items-center justify-between sm:justify-center gap-1 sm:gap-4 mb-3 px-1 w-full">
                    {categories.map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveCategory(id)}
                            className={cn(
                                "py-1 text-xs sm:text-base font-bold transition-all border-b-2 cursor-pointer text-center",
                                activeCategory === id
                                    ? "border-purple text-purple scale-105"
                                    : "border-transparent text-black-muted hover:text-purple"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* ── SEARCH BAR CONTAINER (Responsive Scaling for Mobile) ─────*/}
                <div className="relative z-30 mx-auto max-w-md sm:max-w-2xl px-3 md:px-4 w-full">
                    <SearchBar onSearch={handleSearch} activeCategory={activeCategory} />
                </div>
            </div>

            {/* ── MAIN CONTENT ───*/}
            <main className="flex-1">
                <section className="pt-6 md:pt-10 pb-12">
                    <div className="mx-auto w-full max-w-7xl px-4 md:px-8">



                        {/* STAYS */}
                        {activeCategory === "stays" && (
                            <>
                                <SectionHeader
                                    title="Popular Stays"
                                    desc="Explore highly-rated safari lodges, city guesthouses, and farm retreats that our guests love returning to."
                                    href="/stays"
                                    seeAllLabel="See all stays"
                                    as="h3"
                                    hideDescOnMobile
                                />
                                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                                    {mockStays.slice(0, 6).map((listing) => (
                                        <div key={listing.id} className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start">
                                            <ListingCard listing={listing} />
                                        </div>
                                    ))}
                                </div>
                                <MobileSeeAll href="/stays" label="See all stays" />

                                {/* Recommended Stays */}
                                <div className="mt-14 md:mt-16">
                                    <SectionHeader
                                        title="Recommended Stays"
                                        desc="Based on your recent searches and preferences."
                                        href="/stays"
                                        seeAllLabel="See recommendations"
                                        as="h3"
                                        hideDescOnMobile
                                    />
                                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                                        {mockStays.slice(6, 12).map((listing) => (
                                            <div key={listing.id} className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start">
                                                <ListingCard listing={listing} />
                                            </div>
                                        ))}
                                    </div>
                                    <MobileSeeAll href="/stays" label="See recommendations" />
                                </div>

                                {/* Flash Deals */}
                                <div className="mt-14 md:mt-16">
                                    <SectionHeader
                                        title="Flash Deals"
                                        desc="Limited-time discounts on hand-picked stays. Book now before they're gone."
                                        href="/stays"
                                        seeAllLabel="See all deals"
                                    />
                                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                                        {flashDeals.map((deal) => (
                                            <Link
                                                key={deal.id}
                                                href={`/listings/stays/${deal.id.replace("deal-", "")}`}
                                                className="group relative block overflow-hidden rounded-2xl w-[260px] sm:w-[280px] shrink-0 aspect-[4/3] bg-white-bone shadow-[0_2px_12px_rgba(31,20,51,0.10)] transition-all hover:shadow-[0_12px_32px_rgba(31,20,51,0.18)] snap-start"
                                                style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                                            >
                                                <img src={deal.image} alt={deal.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                                                        -{deal.discount}% {deal.badge}
                                                    </span>
                                                </div>
                                                <div className="absolute top-3 right-3">
                                                    <span className="inline-flex items-center bg-black/40 backdrop-blur-sm text-white/90 text-[9px] font-bold px-2 py-1 rounded-md">
                                                        {deal.ends}
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-0 left-0 p-4 w-full">
                                                    <h3 className="font-display text-white font-bold text-base leading-tight mb-1.5">{deal.name}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-bold text-base">ZMW {deal.dealPrice}</span>
                                                        <span className="text-white/70 text-[11px] line-through">ZMW {deal.originalPrice}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <MobileSeeAll href="/stays" label="View all deals" />
                                </div>
                            </>
                        )}

                        {/* EXPERIENCES */}
                        {activeCategory === "experiences" && (
                            <div>
                                <SectionHeader
                                    title="Popular Experiences"
                                    desc="Top-rated safaris, cultural tours, adventures and activities hand-picked for you."
                                    href="/experiences"
                                    seeAllLabel="See all experiences"
                                    as="h3"
                                    hideDescOnMobile
                                />
                                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                                    {mockExperiences.slice(0, 6).map((exp) => (
                                        <Link key={exp.id} href={`/experiences/${exp.id}`} className="group w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start">
                                            <div className="relative aspect-[16/10] bg-white-bone rounded-xl overflow-hidden transition-shadow group-hover:shadow-sm">
                                                <img src={exp.image} alt={exp.name} loading="lazy" className="h-full w-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="pt-2.5 px-0.5">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="text-[14px] font-semibold text-black-soft leading-snug line-clamp-1 flex-1">{exp.name}</h3>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <Star className="h-3 w-3 fill-white text-white" strokeWidth={1.5} />
                                                        <span className="text-[12px] font-semibold text-black-muted">{exp.rating.toFixed(1)}</span>
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-black-muted mt-1">{exp.location}</p>
                                                <div className="flex items-baseline gap-0.5 mt-1.5">
                                                    <span className="text-[14px] font-bold text-white">ZMW {exp.price}</span>
                                                    <span className="text-[11px] text-black-muted">/ person</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <MobileSeeAll href="/experiences" label="See all experiences" />
                            </div>
                        )}

                        {/* TRANSPORT */}
                        {activeCategory === "transport" && (
                            <div>
                                <SectionHeader
                                    title="Popular Transport Routes"
                                    desc="Reliable bus and shuttle connections between Zambia's major hubs and gateway towns."
                                    href="/transport"
                                    seeAllLabel="See all routes"
                                    as="h3"
                                    hideDescOnMobile
                                />
                                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                                    {mockTransport.slice(0, 6).map((t) => (
                                        <Link key={t.id} href="/transport" className="group w-[280px] sm:w-[300px] shrink-0 snap-start bg-white rounded-xl border border-purple-border overflow-hidden transition-all hover:shadow-[0_4px_16px_rgba(31,20,51,0.10)]">
                                            <div className="relative aspect-[16/9] bg-white-bone">
                                                <img src={t.image} alt={`${t.from} to ${t.to}`} loading="lazy" className="h-full w-full object-cover" />
                                            </div>
                                            <div className="p-3.5 flex flex-col gap-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-1.5 text-black font-bold text-sm sm:text-base">
                                                        <span>{t.from}</span>
                                                        <span className="text-white text-xs">→</span>
                                                        <span>{t.to}</span>
                                                    </div>
                                                    <span className="text-[14px] font-bold text-white shrink-0">ZMW {t.price}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <p className="font-semibold text-black-soft">{t.operator}</p>
                                                    <div className="flex items-center gap-1.5 text-black-muted text-[11px]">
                                                        <span>{t.duration}</span>
                                                        <span>·</span>
                                                        <span>{t.departures}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <MobileSeeAll href="/transport" label="See all routes" />
                            </div>
                        )}

                        {/* PACKAGES */}
                        {activeCategory === "packages" && (
                            <div>
                                <SectionHeader
                                    title="Popular Packages"
                                    desc="Curated weekend escapes and multi-day adventures bundled for the best value."
                                    href="/packages"
                                    seeAllLabel="See all packages"
                                    as="h3"
                                    hideDescOnMobile
                                />
                                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                                    {mockPackages.slice(0, 6).map((pkg) => (
                                        <Link key={pkg.id} href="/packages" className="group w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start">
                                            <div className="relative aspect-[16/10] bg-white-bone rounded-xl overflow-hidden transition-shadow group-hover:shadow-sm">
                                                <img src={pkg.image} alt={pkg.name} loading="lazy" className="h-full w-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="pt-2.5 px-0.5">
                                                <h3 className="text-[14px] font-semibold text-black-soft leading-snug line-clamp-1">{pkg.name}</h3>
                                                <p className="text-[11px] text-black-muted mt-0.5">{pkg.location} · {pkg.duration}</p>
                                                <div className="flex items-center justify-between mt-1.5">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-white text-white" strokeWidth={1.5} />
                                                        <span className="text-[12px] font-semibold text-black-muted">{pkg.rating.toFixed(1)}</span>
                                                    </div>
                                                    <span className="text-[14px] font-bold text-white">ZMW {pkg.price}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <MobileSeeAll href="/packages" label="See all packages" />
                            </div>
                        )}
                    </div>
                </section>
            </main>



            {/* ── BECOME A HOST CTA ─────────────────────────────────────────── */}
            <section className="mx-auto w-full max-w-7xl px-4 md:px-8 mb-16">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-white-soft rounded-2xl overflow-hidden border border-purple-border">
                    <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[280px] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80" alt="Cozy safari lodge interior" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                    </div>
                    <div className="px-6 md:px-0 md:pr-10 py-8">
                        <h2 className="font-display text-xl md:text-2xl font-bold text-black leading-snug mb-3">
                            Turn your passion into profit
                        </h2>
                        <p className="text-[13px] text-black-muted leading-relaxed max-w-md mb-6">
                            List your stays, experiences, or transport on Nearby Escapes. Fair commissions, real
                            earnings, and a team that&apos;s got your back.
                        </p>
                        <Link href="/become-host" className="btn-cta px-8 py-3 text-base w-full sm:w-auto">
                            List your escape <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── WHY BOOK WITH US */}
            <section className="pt-14 pb-8 md:pt-[56px] md:pb-8 bg-white">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
                    <h2 className="text-xl md:text-2xl font-bold text-black mb-8 md:mb-[32px] text-center md:text-left">
                        Why book with us
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-[32px]">
                        {valueProps.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex gap-4 items-start">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-purple-muted text-purple">
                                    <Icon className="h-[22px] w-[22px]" weight="regular" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-[15px] font-semibold text-black mb-1">{title}</h3>
                                    <p className="text-[13px] text-black-muted leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
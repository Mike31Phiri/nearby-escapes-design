"use client";

import Link from"next/link";
import {
 ArrowRight,
 Bed,
 Ticket,
 Bus,
 ShieldCheck,
 TrendingUp,
 Users,
 Star,
 Sparkles,
 CheckCircle2,
 ChevronRight,
} from"lucide-react";

const CATEGORIES = [
 {
 id:"stays",
 label:"Stays / Accommodation",
 icon: Bed,
 description:
"List your lodge, guesthouse, camp, or vacation rental and earn income from travellers exploring Zambia.",
 examples:"Lodges · Hotels · Camps · Guesthouses",
 benefits: [
"Set your own nightly rates and availability",
"Fair commission — only pay when you earn",
"24/7 guest support handled by our team",
"Professional photography available on request",
 ],
 href:"/become-host/stays",
 },
 {
 id:"experiences",
 label:"Experiences / Activities",
 icon: Ticket,
 description:
"Lead safaris, cultural tours, hiking adventures, or cooking classes — share your expertise with travellers.",
 examples:"Safaris · Tours · Workshops · Adventures",
 benefits: [
"Set your own pricing per person or group",
"Reach thousands of travellers planning trips",
"Easy scheduling and booking management",
"Build your reputation with guest reviews",
 ],
 href:"/become-host/experiences",
 },
 {
 id:"transport",
 label:"Transport / Routes",
 icon: Bus,
 description:
"Offer shuttle services, bus routes, or private transfers between Zambia's major hubs and attractions.",
 examples:"Shuttles · Bus routes · Transfers",
 benefits: [
"Set your routes, schedule, and pricing",
"Automated booking and payment collection",
"Real-time availability management",
"Grow your transport business with visibility",
 ],
 href:"/become-host/transport",
 },
];

const HOW_IT_WORKS = [
 {
 step: 1,
 title:"Sign up & verify",
 desc:"Create your account, verify your identity, and tell us what you'd like to host.",
 },
 {
 step: 2,
 title:"Create your listing",
 desc:"Add photos, descriptions, pricing, and availability. Our team can help you optimise your listing.",
 },
 {
 step: 3,
 title:"Receive bookings",
 desc:"Guests find and book your listing. We handle payments and send you confirmed reservations.",
 },
 {
 step: 4,
 title:"Get paid",
 desc:"Earnings are transferred to your bank account within 48 hours of a guest's stay or experience.",
 },
];

export function BecomeHostLandingPage() {
 return (
 <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
 {/* Hero */}
 <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden bg-[#1f1433]">
 <div className="relative mx-auto max-w-7xl px-4 md:px-8 text-center">
 <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-white/80 text-xs font-semibold tracking-wider uppercase mb-6">
 <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]"/>
 Become a host on Nearby Escapes
 </div>
 <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-4 max-w-3xl mx-auto">
 Turn your passion into{""}
 <span className="font-script text-[1.3em] font-normal text-gold lowercase">
 profit
 </span>
 </h1>
 <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
 Whether you own a lodge, lead tours, or run transport — Nearby Escapes connects you with
 travellers looking for authentic Zambian experiences.
 </p>
 <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
 <Link
 href="#categories"
 className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#d4b065] text-[#111111] text-base font-bold px-8 py-3.5 rounded-xl transition-all duration-200"
 >
 Explore hosting options <ChevronRight className="h-4 w-4"/>
 </Link>
 <Link
 href="/become-host/onboard"
 className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-base font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 backdrop-blur-sm"
 >
 Already know? Get started
 </Link>
 </div>
 </div>
 </section>

 {/* Stats Bar */}
 <section className="border-b border-[#E0DBD0] bg-white">
 <div className="mx-auto max-w-7xl px-4 md:px-8 py-6">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
 {[
 { value:"500+", label:"Active Listings"},
 { value:"10K+", label:"Travellers Served"},
 { value:"ZMW 1M+", label:"Paid to Hosts"},
 { value:"98%", label:"Satisfaction Rate"},
 ].map((stat) => (
 <div key={stat.label}>
 <p className="text-2xl md:text-3xl font-black text-[#1f1433]">{stat.value}</p>
 <p className="text-xs text-[#64748B] font-medium mt-0.5">{stat.label}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Category Cards */}
 <section id="categories"className="py-16 md:py-20">
 <div className="mx-auto max-w-7xl px-4 md:px-8">
 <div className="text-center mb-12">
 <p className="font-script text-xl md:text-2xl text-gold mb-2">
 Choose your category
 </p>
 <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1f1433]">
 What would you like to host?
 </h2>
 <p className="text-[#64748B] mt-2 text-base max-w-lg mx-auto">
 Select the type of listing that fits what you offer. You can always add more later.
 </p>
 </div>

 <div className="grid md:grid-cols-3 gap-6">
 {CATEGORIES.map((cat) => {
 const Icon = cat.icon;
 return (
 <Link
 key={cat.id}
 href={cat.href}
 className="group relative bg-white rounded-2xl border border-[#E0DBD0] p-6 md:p-8 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(31,20,51,0.10)] hover:border-[#1f1433]/20"
 >
 <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1f1433]/5 text-[#1f1433] mb-5 transition-transform duration-300 group- group-hover:bg-[#1f1433] group-hover:text-white">
 <Icon className="h-7 w-7"/>
 </div>
 <h3 className="text-lg font-bold text-[#1f1433] mb-2">{cat.label}</h3>
 <p className="text-sm text-[#64748B] leading-relaxed mb-3">{cat.description}</p>
 <p className="text-xs font-semibold text-[#1f1433]/60 mb-4">{cat.examples}</p>

 <ul className="space-y-2 mb-6">
 {cat.benefits.map((benefit) => (
 <li key={benefit} className="flex items-start gap-2 text-sm text-[#64748B]">
 <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5"/>
 <span>{benefit}</span>
 </li>
 ))}
 </ul>

 <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1f1433] group-hover:gap-2 transition-all">
 Learn more
 <ArrowRight className="h-4 w-4 transition-transform duration-200"/>
 </span>
 </Link>
 );
 })}
 </div>
 </div>
 </section>

 {/* How It Works */}
 <section className="py-16 md:py-20 bg-[#F9F7F2] border-t border-[#E0DBD0]">
 <div className="mx-auto max-w-7xl px-4 md:px-8">
 <div className="text-center mb-12">
 <p className="font-script text-xl md:text-2xl text-gold mb-2">Simple process</p>
 <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1f1433]">
 How it works
 </h2>
 </div>

 <div className="grid md:grid-cols-4 gap-6">
 {HOW_IT_WORKS.map(({ step, title, desc }) => (
 <div key={step} className="text-center">
 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f1433] text-white text-lg font-black mx-auto mb-4">
 {step}
 </div>
 <h3 className="text-base font-bold text-[#1f1433] mb-1.5">{title}</h3>
 <p className="text-sm text-[#64748B] leading-relaxed max-w-xs mx-auto">{desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Benefits Strip */}
 <section className="py-16 bg-[#1f1433]">
 <div className="mx-auto max-w-7xl px-4 md:px-8">
 <div className="grid md:grid-cols-3 gap-8">
 {[
 {
 icon: TrendingUp,
 title:"Earn on your terms",
 desc:"Set your own prices, availability, and booking rules. No hidden fees, no minimum commitments.",
 },
 {
 icon: Users,
 title:"Reach the right travellers",
 desc:"Thousands of visitors use Nearby Escapes to plan their Zambian adventures every month.",
 },
 {
 icon: Star,
 title:"Grow with confidence",
 desc:"Our team supports you with listing optimisation, guest communication, and 24/7 support.",
 },
 ].map(({ icon: Icon, title, desc }) => (
 <div key={title} className="flex gap-4">
 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/15 text-[#D4AF37]">
 <Icon className="h-6 w-6"/>
 </div>
 <div>
 <h3 className="text-white font-bold text-base mb-1">{title}</h3>
 <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Final CTA */}
 <section className="py-16 bg-[#F9F7F2]">
 <div className="mx-auto max-w-3xl px-4 text-center">
 <ShieldCheck className="h-10 w-10 text-[#D4AF37] mx-auto mb-4"/>
 <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1f1433] mb-3">
 Ready to start hosting?
 </h2>
 <p className="text-[#64748B] text-base max-w-md mx-auto leading-relaxed mb-8">
 Join a growing community of Zambian hosts. Create your listing in minutes and start
 earning.
 </p>
 <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
 <Link
 href="/become-host/onboard"
 className="inline-flex items-center gap-2 bg-[#1f1433] hover:bg-[#2A154A] text-white text-base font-bold px-10 py-3.5 rounded-xl transition-all duration-200"
 >
 Become a host <ArrowRight className="h-4 w-4"/>
 </Link>
 <Link
 href="/"
 className="inline-flex items-center gap-2 text-[#1f1433] text-base font-semibold hover:text-[#2A154A] transition-all"
 >
 Learn more about each category
 </Link>
 </div>
 </div>
 </section>
 </div>
 );
}

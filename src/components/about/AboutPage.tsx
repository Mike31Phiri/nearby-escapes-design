"use client";

import Link from "next/link";
import { Heart, Users, Trees, ArrowRight, Quote, HandHelping, ChevronLeft } from "lucide-react";

const stats = [
  { value: "500+", label: "Listings across Zambia" },
  { value: "10,000+", label: "Happy travellers" },
  { value: "98%", label: "Response rate" },
  { value: "4.8", label: "Average rating", sub: "out of 5" },
];

const values = [
  {
    icon: Heart,
    title: "Authenticity First",
    desc: "We only list places and experiences we believe in. Every escape on our platform is vetted for quality, character, and genuine Zambian hospitality.",
  },
  {
    icon: Users,
    title: "Community Powered",
    desc: "We're built for local hosts — from family-run lodges to village guides. When you book with us, you're supporting Zambian entrepreneurs directly.",
  },
  {
    icon: Trees,
    title: "Responsible Travel",
    desc: "We promote low-impact tourism that celebrates Zambia's natural heritage. Many of our partners contribute to conservation and community development.",
  },
  {
    icon: HandHelping,
    title: "Fair For Everyone",
    desc: "Transparent pricing, fair commissions, and clear policies. Guests know what they're paying, and hosts keep more of what they earn.",
  },
];

const timeline = [
  {
    year: "2022",
    title: "The idea takes root",
    desc: "Founded in Lusaka with a simple vision: make it easy for Zambians to discover authentic local escapes without relying on international booking platforms.",
  },
  {
    year: "2023",
    title: "First 50 listings",
    desc: "Reached 50 properties across 6 provinces. Launched experiences and transport booking. Welcomed our 1,000th traveller.",
  },
  {
    year: "2024",
    title: "Growing the community",
    desc: "Expanded to 200+ listings. Introduced packages, hidden gems, and bus booking. Partnered with local conservation programmes.",
  },
  {
    year: "2025",
    title: "The platform matures",
    desc: "500+ listings covering all provinces. Full marketplace with stays, experiences, transport, and curated packages. Serving thousands of travellers monthly.",
  },
];

const team = [
  { name: "Mulenga Banda", role: "Founder & CEO", initials: "MB" },
  { name: "Chanda Mwila", role: "Head of Operations", initials: "CM" },
  { name: "Thandiwe Phiri", role: "Community Manager", initials: "TP" },
  { name: "James Kasonde", role: "Head of Partnerships", initials: "JK" },
];

export function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
      {/*  Hero  */}
      <section className="relative overflow-hidden bg-[#2A1B3D] pt-16 pb-24 md:pt-20 md:pb-28">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1B3D]/80 via-[#2A1B3D]/60 to-[#2A1B3D]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white/80 transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="max-w-3xl">
            <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.12em] mb-4">
              Our story
            </p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-[3.25rem] font-black text-white leading-[1.1] mb-5">
              Connecting travellers with the{" "}
              <span className="font-script text-[1.2em] font-normal text-[#C5A059] lowercase">
                real
              </span>{" "}
              Zambia
            </h1>
            <p className="text-white/60 text-[15px] leading-relaxed max-w-xl">
              Nearby Escapes is a Zambian-built marketplace that helps you discover stays,
              experiences, and transport — all curated by locals who know Zambia best.
            </p>
          </div>
        </div>
      </section>

      {/*  Stats Strip  */}
      <div className="relative z-20 -mt-10 mx-auto max-w-5xl px-4 md:px-8">
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(42,27,61,0.10)] border border-[#E0DBD0] divide-y md:divide-y-0 md:divide-x divide-[#E0DBD0] grid grid-cols-2 md:grid-cols-4 overflow-hidden">
          {stats.map(({ value, label, sub }) => (
            <div key={label} className="py-5 text-center">
              <p className="font-display text-2xl md:text-3xl font-black text-[#2A1B3D]">{value}</p>
              <p className="text-xs text-[#8A8480] mt-0.5 font-medium">{label}</p>
              {sub && <p className="text-[10px] text-[#8A8480]/60">{sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/*  Mission Statement  */}
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Quote className="h-5 w-5 text-[#C5A059]" />
                <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.12em]">
                  Our mission
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#334155] leading-[1.2] mb-5">
                Zambia is full of hidden escapes.{" "}
                <span className="text-[#2A1B3D]">We make them easy to find.</span>
              </h2>
              <div className="space-y-4 text-[15px] text-[#8A8480] leading-relaxed">
                <p>
                  Nearby Escapes was born from a simple observation: Zambia has some of the most
                  incredible places to stay and things to do in Africa, yet finding and booking them
                  was surprisingly difficult. International platforms dominated, local gems were
                  overlooked, and hosts struggled to reach travellers.
                </p>
                <p>
                  We built Nearby Escapes to change that. Our platform connects you with verified
                  local hosts — lodge owners, safari guides, farmstead families, and transport
                  operators — who make Zambia extraordinary. Every booking supports a local
                  entrepreneur and helps grow Zambia&apos;s travel economy.
                </p>
                <p>
                  Whether you&apos;re after a luxury safari lodge, a working farm stay, or a guided
                  tour through the Copperbelt&apos;s industrial heritage, we&apos;ve got you
                  covered. And because we&apos;re Zambian-built, we know the places that matter.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#2A1B3D] shadow-[0_8px_32px_rgba(42,27,61,0.15)]">
              <img
                src="https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?w=800&q=80"
                alt="Zambian landscape"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white/80 text-xs font-semibold">
                  &ldquo;Zambia is Africa&rsquo;s best-kept secret — and we&rsquo;re here to share
                  it with the world.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/*  Values  */}
        <section className="bg-[#2A1B3D]">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-16">
            <div className="text-center mb-10 md:mb-12">
              <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.12em] mb-3">
                What we stand for
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Our values</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {values.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C5A059]/15 text-[#C5A059] mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
                  <p className="text-[#9B95A8] text-[13px] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*  Timeline  */}
        <section className="mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-16">
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.12em] mb-3">
              Our journey
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#334155]">
              How we got here
            </h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[#E0DBD0] -translate-x-1/2" />
            <div className="space-y-10 md:space-y-12">
              {timeline.map(({ year, title, desc }, i) => (
                <div
                  key={year}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-8 items-start ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 pl-12 md:pl-0 ${
                      i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <span className="inline-block text-[#C5A059] text-xs font-black tracking-widest mb-1">
                      {year}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#334155] mb-1">{title}</h3>
                    <p className="text-sm text-[#8A8480] leading-relaxed">{desc}</p>
                  </div>
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 top-1 w-3 h-3 rounded-full bg-[#C5A059] border-2 border-white -translate-x-1/2 z-10" />
                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*  Team  */}
        <section className="bg-white border-y border-[#E0DBD0]">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-16">
            <div className="text-center mb-10">
              <p className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.12em] mb-3">
                The people behind it
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#334155]">
                Meet the team
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {team.map(({ name, role, initials }) => (
                <div key={name} className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-[#2A1B3D] flex items-center justify-center text-white font-bold text-lg mb-3">
                    {initials}
                  </div>
                  <h3 className="font-bold text-sm text-[#334155]">{name}</h3>
                  <p className="text-xs text-[#8A8480]">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*  CTA  */}
        <section className="mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-16">
          <div className="bg-gradient-to-br from-[#2A1B3D] to-[#1A0B2D] rounded-3xl overflow-hidden">
            <div className="relative px-6 md:px-12 py-12 md:py-16 text-center">
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                  Ready to explore Zambia?
                </h2>
                <p className="text-[#9B95A8] text-sm md:text-[15px] leading-relaxed mb-8">
                  Whether you&apos;re planning a weekend escape or a once-in-a-lifetime safari,
                  Nearby Escapes makes it easy to discover, book, and enjoy the best of Zambia.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-[#C5A059] text-[#334155] font-bold text-sm hover:bg-[#B48E3E] transition-colors"
                  >
                    Start exploring <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/become-host"
                    className="inline-flex items-center gap-2 h-12 px-7 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white/5 transition-colors"
                  >
                    Become a host
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

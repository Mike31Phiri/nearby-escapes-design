"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heart, Compass, Shield, Users, MapPin, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Story Section */}
        <section className="py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest">
                  <Heart className="h-5 w-5" /> Our Story
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
                  Redefining <span className="text-primary">Zambian travel</span> through connection
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                  Founded in Lusaka, Nearby Escapes started with a simple belief: that the most extraordinary experiences aren&apos;t halfway around the world, but often just a short drive away.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our platform was built to bridge the gap between local travelers seeking authentic getaways and Zambian entrepreneurs sharing their unique spaces and stories.
                </p>
              </div>
              <div className="relative animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="aspect-square rounded-[48px] overflow-hidden shadow-2xl relative">
                  <img src="https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg?auto=compress&fit=crop&w=1000&h=1000" alt="Beautiful Landscape" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[32px] shadow-2xl border border-border/40 hidden md:block">
                   <h3 className="text-5xl font-black text-primary mb-1">10k+</h3>
                   <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Happy Travelers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Values */}
        <section className="py-24 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
             <div className="text-center mb-20 space-y-4">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Built on trust and passion</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { icon: Compass, title: "Discovery", desc: "We believe in uncovering the hidden gems of Zambia, from Samfya to South Luangwa." },
                  { icon: Shield, title: "Trust", desc: "Safety and security are at the heart of every booking on Nearby Escapes." },
                  { icon: Users, title: "Community", desc: "We empower local hosts and guides to build sustainable businesses." },
                ].map((item) => (
                  <div key={item.title} className="text-center space-y-6">
                    <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                      <item.icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-extrabold">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Impact */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 md:px-6 text-center space-y-12">
            <h2 className="text-3xl font-bold tracking-tight">Our impact across Zambia</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { label: "Listings", val: "2,400+" },
                 { label: "Cities", val: "12" },
                 { label: "Host Earnings", val: "ZMW 4M+" },
                 { label: "Reviews", val: "15k+" },
               ].map(stat => (
                 <div key={stat.label}>
                    <p className="text-3xl font-black text-primary mb-1">{stat.val}</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

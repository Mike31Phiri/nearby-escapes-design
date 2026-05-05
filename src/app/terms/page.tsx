"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, FileText, Scale, Gavel } from "lucide-react";

export default function TermsPage() {
  const sections = [
    { title: "Introduction", content: "Welcome to Nearby Escapes. These terms and conditions outline the rules and regulations for the use of our website and services in Zambia." },
    { title: "User Obligations", content: "By accessing this website, we assume you accept these terms and conditions. Do not continue to use Nearby Escapes if you do not agree to all of the terms and conditions stated on this page." },
    { title: "Booking Policies", content: "All bookings made through Nearby Escapes are subject to host availability and confirmation. Payments are processed through our secure DPO payment gateway." },
    { title: "Cancellation & Refunds", content: "Cancellation policies are set by individual hosts. Nearby Escapes facilitates refunds based on the specific policy selected at the time of booking." },
    { title: "Liability", content: "Nearby Escapes is a marketplace platform. While we verify hosts, we are not responsible for the physical condition of properties or the conduct of guests/hosts during stays." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-16 space-y-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Terms & Conditions</h1>
          <p className="text-muted-foreground text-lg">Last updated: May 1, 2024</p>
        </div>

        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
           {sections.map((section, index) => (
             <section key={index} className="space-y-4">
               <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                 <span className="text-primary/20 font-black text-3xl">0{index + 1}</span>
                 {section.title}
               </h2>
               <p className="text-muted-foreground leading-relaxed text-lg">
                 {section.content}
               </p>
               {index < sections.length - 1 && <div className="h-px bg-border/40 mt-12" />}
             </section>
           ))}
        </div>

        <div className="mt-24 p-12 bg-muted/30 rounded-[40px] border border-border/40 text-center">
           <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
             <Gavel className="h-6 w-6 text-primary" /> Governing Law
           </h3>
           <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
             These terms shall be governed by and construed in accordance with the laws of the Republic of Zambia. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the Zambian courts.
           </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

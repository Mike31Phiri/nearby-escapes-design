"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, HelpCircle, User, CreditCard, Shield } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqCategories = [
  { id: "general", title: "General", icon: HelpCircle },
  { id: "booking", title: "Booking", icon: CreditCard },
  { id: "hosting", title: "Hosting", icon: User },
  { id: "safety", title: "Safety", icon: Shield },
];

const faqs = [
  { 
    cat: "general", 
    q: "What is Nearby Escapes?", 
    a: "Nearby Escapes is a Zambian-focused marketplace that connects travelers with unique local stays, transport options, and experiences. Our mission is to promote local tourism and empower Zambian entrepreneurs." 
  },
  { 
    cat: "booking", 
    q: "How do I pay for a booking?", 
    a: "We accept all major credit/debit cards (Visa, Mastercard) and mobile money (Airtel, MTN, Zamtel) through our secure DPO payment gateway. Your payment is held securely and only released to the host 24 hours after check-in." 
  },
  { 
    cat: "hosting", 
    q: "What are the fees for hosting?", 
    a: "It is completely free to list your space on Nearby Escapes. We only charge a small 5% service fee on successful bookings to cover platform maintenance and support." 
  },
  { 
    cat: "safety", 
    q: "Are the hosts verified?", 
    a: "Yes! Every host on Nearby Escapes undergoes a strict verification process, including identity checks and property validation, to ensure the safety and security of our guests." 
  },
  { 
    cat: "booking", 
    q: "Can I cancel my reservation?", 
    a: "Yes, you can cancel your reservation through your account dashboard. The refund amount depends on the specific cancellation policy set by the host for that listing." 
  },
];

export default function FAQPage() {
  const [activeCat, setActiveCat] = useState("general");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(f => f.cat === activeCat);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-16 space-y-8 animate-in fade-in slide-in-from-top-8 duration-700">
           <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Help Centre</h1>
           <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
              <Input placeholder="Search for questions (e.g. 'how to pay', 'verification')" className="rounded-[24px] h-14 pl-14 text-lg border-border/60 shadow-xl focus:ring-primary/20" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
           {faqCategories.map((cat) => (
             <button
               key={cat.id}
               onClick={() => setActiveCat(cat.id)}
               className={cn(
                 "p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 text-center",
                 activeCat === cat.id 
                  ? "bg-primary/5 border-primary shadow-lg scale-105" 
                  : "bg-muted/30 border-transparent hover:bg-muted/50"
               )}
             >
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center",
                  activeCat === cat.id ? "bg-primary text-white" : "bg-white text-muted-foreground"
                )}>
                   <cat.icon className="h-6 w-6" />
                </div>
                <span className="font-bold">{cat.title}</span>
             </button>
           ))}
        </div>

        <div className="space-y-4 animate-in fade-in duration-500">
           {filteredFaqs.map((faq, index) => (
             <Card key={index} className="border-border/60 shadow-sm rounded-3xl overflow-hidden">
                <button 
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left hover:bg-muted/10 transition-colors"
                >
                   <h3 className="font-bold text-lg md:text-xl pr-8">{faq.q}</h3>
                   <ChevronDown className={cn(
                     "h-5 w-5 text-muted-foreground transition-transform duration-300",
                     openIndex === index && "rotate-180"
                   )} />
                </button>
                <div className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                )}>
                   <div className="p-6 md:p-8 pt-0 text-muted-foreground leading-relaxed text-lg border-t border-border/40 bg-muted/5">
                      {faq.a}
                   </div>
                </div>
             </Card>
           ))}
        </div>

        <div className="mt-24 p-12 bg-muted/30 rounded-[40px] border border-border/40 text-center">
           <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
           <p className="text-muted-foreground mb-8">If you couldn&apos;t find what you were looking for, our team is always ready to assist.</p>
           <Link href="/contact">
             <Button className="h-14 rounded-2xl px-12 bg-primary font-extrabold text-lg shadow-xl">
               Contact Support
             </Button>
           </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
      {children}
    </div>
  );
}

"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Eye, Lock, Database } from "lucide-react";

export default function PrivacyPage() {
  const points = [
    { icon: Database, title: "Data Collection", desc: "We collect personal information like your name, email, and phone number only to facilitate your bookings and provide support." },
    { icon: Eye, title: "Data Usage", desc: "Your data is used to verify your identity, process payments, and improve our services. We never sell your data to third parties." },
    { icon: Lock, title: "Data Protection", desc: "We use industry-standard SSL encryption and secure servers to protect your sensitive information from unauthorized access." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-16 space-y-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">Your trust is our most important asset.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
           {points.map((point) => (
             <div key={point.title} className="text-center space-y-4 p-8 bg-muted/20 rounded-[32px] border border-border/40">
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                   <point.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
             </div>
           ))}
        </div>

        <article className="prose prose-slate max-w-none text-muted-foreground space-y-12">
           <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">How we protect your payments</h2>
              <p className="leading-relaxed text-lg">
                We partner with DPO Group, the leading payment service provider in Africa, to handle all credit card and mobile money transactions. Nearby Escapes never stores your full card details on our servers. All sensitive data is transmitted via encrypted channels directly to the payment gateway.
              </p>
           </section>

           <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Cookies and Tracking</h2>
              <p className="leading-relaxed text-lg">
                We use cookies to improve your browsing experience and remember your preferences. These cookies help us understand how you use our site so we can provide a more personalized experience. You can manage your cookie preferences in your browser settings.
              </p>
           </section>

           <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
              <p className="leading-relaxed text-lg">
                You have the right to access, update, or delete your personal information at any time. If you wish to close your account and remove your data from our systems, please contact our support team.
              </p>
           </section>
        </article>

        <div className="mt-24 p-12 bg-primary/5 rounded-[40px] border border-primary/10 text-center">
           <h3 className="text-xl font-bold mb-4">Questions about your privacy?</h3>
           <p className="text-muted-foreground mb-8">We&apos;re here to clarify anything you&apos;re unsure about regarding your data.</p>
           <a href="mailto:privacy@nearbyescapes.com" className="text-primary font-black text-lg underline hover:no-underline">
             privacy@nearbyescapes.com
           </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

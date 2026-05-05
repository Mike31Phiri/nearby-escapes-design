"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MessageCircle, MapPin, Send, Headset, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 font-bold">24/7 Support</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">We&apos;re here to help</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a question about a booking? Need help listing your space? Reach out to our Zambian team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
             <Card className="border-border/60 shadow-xl rounded-[32px] p-8 hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Headset className="h-6 w-6" />
                   </div>
                   <div>
                      <h3 className="font-bold">Call Us</h3>
                      <p className="text-sm text-muted-foreground">+260 97 123 4567</p>
                   </div>
                </div>
             </Card>
             <Card className="border-border/60 shadow-xl rounded-[32px] p-8 hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-6 w-6 fill-[#25D366]/10" />
                   </div>
                   <div>
                      <h3 className="font-bold">WhatsApp</h3>
                      <p className="text-sm text-muted-foreground">Chat with us instantly</p>
                   </div>
                </div>
             </Card>
             <Card className="border-border/60 shadow-xl rounded-[32px] p-8 hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6" />
                   </div>
                   <div>
                      <h3 className="font-bold">Email</h3>
                      <p className="text-sm text-muted-foreground">hello@nearbyescapes.com</p>
                   </div>
                </div>
             </Card>
             
             <div className="p-8 bg-muted/30 rounded-[32px] border border-border/40 space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                   <Clock className="h-4 w-4" /> Support Hours
                </div>
                <p className="text-sm leading-relaxed">
                   <strong>Online Support:</strong> 24/7<br />
                   <strong>Office Support:</strong> Mon - Fri, 8:00 AM - 5:00 PM
                </p>
             </div>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-border/60 shadow-2xl rounded-[40px] overflow-hidden">
               <CardContent className="p-8 md:p-12">
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Mwine" className="rounded-xl h-12" required />
                         </div>
                         <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="john@example.com" className="rounded-xl h-12" required />
                         </div>
                      </div>
                      <div className="grid gap-2">
                         <Label htmlFor="subject">Subject</Label>
                         <Input id="subject" placeholder="How can we help?" className="rounded-xl h-12" required />
                      </div>
                      <div className="grid gap-2">
                         <Label htmlFor="message">Your Message</Label>
                         <Textarea id="message" placeholder="Provide as much detail as possible..." className="rounded-xl min-h-[150px] p-4" required />
                      </div>
                      <Button type="submit" className="w-full h-14 rounded-2xl bg-primary font-extrabold text-lg shadow-xl flex items-center gap-2">
                         <Send className="h-5 w-5" /> Send Message
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-12 animate-in zoom-in duration-500">
                       <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Send className="h-10 w-10 text-emerald-600" />
                       </div>
                       <h2 className="text-3xl font-extrabold mb-4">Message Sent!</h2>
                       <p className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto">
                          We&apos;ve received your message and our team will get back to you within 2-4 hours.
                       </p>
                       <Button variant="outline" onClick={() => setSubmitted(false)} className="rounded-xl font-bold border-2">Send another message</Button>
                    </div>
                  )}
               </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}

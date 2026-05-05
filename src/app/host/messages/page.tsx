"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, MessageCircle, MoreVertical, 
  Send, Phone, Info, Star, Calendar, 
  ChevronLeft, Paperclip, Smile
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const contacts = [
  { id: 1, name: "Mwila K.", lastMsg: "Looking forward to staying at your...", time: "10:24 AM", unread: true, active: true },
  { id: 2, name: "Chileshe M.", lastMsg: "Is there space for a 3rd person?", time: "Yesterday", unread: false, active: false },
  { id: 3, name: "Mutinta S.", lastMsg: "Thank you for the directions!", time: "Monday", unread: false, active: false },
  { id: 4, name: "John D.", lastMsg: "Booking cancelled", time: "May 02", unread: false, active: false },
];

export default function HostInboxPage() {
  const [activeContact, setActiveContact] = useState(contacts[0]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full border-x border-border/40">
        {/* Contact List */}
        <aside className="w-full md:w-80 lg:w-96 border-r border-border/40 bg-muted/10 flex flex-col">
           <div className="p-6 space-y-6">
              <h1 className="text-2xl font-black tracking-tight">Messages</h1>
              <div className="relative">
                 <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search messages..." className="pl-10 rounded-xl h-10 border-border/60 bg-white" />
              </div>
           </div>
           <div className="flex-1 overflow-y-auto">
              {contacts.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setActiveContact(c)}
                  className={cn(
                    "p-6 cursor-pointer border-l-4 transition-all hover:bg-white",
                    activeContact.id === c.id ? "bg-white border-primary" : "border-transparent opacity-70"
                  )}
                >
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted overflow-hidden flex-shrink-0 border border-border/40">
                         <img src={`https://i.pravatar.cc/100?u=${c.id}`} alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold truncate">{c.name}</h4>
                            <span className="text-[10px] font-bold text-muted-foreground">{c.time}</span>
                         </div>
                         <p className={cn(
                           "text-xs truncate",
                           c.unread ? "font-bold text-foreground" : "text-muted-foreground"
                         )}>
                            {c.lastMsg}
                         </p>
                      </div>
                      {c.unread && <div className="h-2 w-2 rounded-full bg-primary" />}
                   </div>
                </div>
              ))}
           </div>
        </aside>

        {/* Chat Window */}
        <section className="flex-1 flex flex-col bg-white">
           {/* Chat Header */}
           <header className="p-4 md:p-6 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <Button variant="ghost" size="icon" className="md:hidden"><ChevronLeft className="h-5 w-5" /></Button>
                 <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-muted overflow-hidden border border-border/40">
                    <img src={`https://i.pravatar.cc/100?u=${activeContact.id}`} alt="" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg">{activeContact.name}</h3>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1.5">
                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2"><Phone className="h-4 w-4" /></Button>
                 <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2"><MoreVertical className="h-4 w-4" /></Button>
              </div>
           </header>

           {/* Messages Area */}
           <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-muted/5">
              <div className="flex justify-center">
                 <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest border border-border/40 shadow-sm">Today</span>
              </div>
              
              <div className="flex items-end gap-3 max-w-[80%]">
                 <div className="h-8 w-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
                    <img src={`https://i.pravatar.cc/100?u=${activeContact.id}`} alt="" />
                 </div>
                 <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-border/40">
                    <p className="text-sm leading-relaxed">Hello Bwalya! Looking forward to staying at your Modern Riverside Villa next week. Could you let me know if there&apos;s a safe parking spot for my car?</p>
                    <span className="text-[8px] font-bold text-muted-foreground mt-2 block text-right">10:24 AM</span>
                 </div>
              </div>

              <div className="flex items-end justify-end gap-3 ml-auto max-w-[80%]">
                 <div className="bg-primary text-white p-4 rounded-2xl rounded-br-none shadow-lg">
                    <p className="text-sm leading-relaxed">Hi Mwila! Yes, we have 24/7 secure gated parking right on the property. You won&apos;t have any issues. See you soon!</p>
                    <span className="text-[8px] font-bold text-white/60 mt-2 block text-right">10:28 AM</span>
                 </div>
              </div>
           </div>

           {/* Chat Input */}
           <div className="p-4 md:p-8 bg-white border-t border-border/40">
              <div className="max-w-4xl mx-auto relative flex items-center gap-4">
                 <div className="flex-1 relative">
                    <Textarea 
                      placeholder="Write your message..." 
                      className="w-full rounded-2xl md:rounded-[24px] pr-20 py-4 md:py-6 pl-14 border-border/60 bg-muted/20 focus:bg-white transition-all resize-none min-h-[60px] md:min-h-[80px]"
                    />
                    <Button variant="ghost" size="icon" className="absolute left-3 top-4 md:top-6 h-8 w-8 text-muted-foreground"><Paperclip className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="absolute right-3 top-4 md:top-6 h-8 w-8 text-muted-foreground"><Smile className="h-4 w-4" /></Button>
                 </div>
                 <Button className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary shadow-xl flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform">
                    <Send className="h-5 w-5 md:h-6 md:w-6 text-white" />
                 </Button>
              </div>
           </div>
        </section>

        {/* Sidebar Info */}
        <aside className="hidden lg:flex w-80 border-l border-border/40 bg-muted/10 flex-col p-8 space-y-10 overflow-y-auto">
           <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                 <img src={`https://i.pravatar.cc/100?u=${activeContact.id}`} alt="" />
              </div>
              <h4 className="font-bold text-xl">{activeContact.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">Guest from Lusaka, Zambia</p>
           </div>

           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Reservation</h5>
                 <Button variant="ghost" size="icon" className="h-6 w-6"><Info className="h-3 w-3" /></Button>
              </div>
              <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
                 <div className="h-32 bg-muted relative">
                    <img src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&fit=crop&w=400&h=200" alt="" className="h-full w-full object-cover" />
                 </div>
                 <div className="p-4 space-y-3">
                    <h6 className="font-bold text-sm">Modern Riverside Villa</h6>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                       <Calendar className="h-3 w-3" /> May 15 - 20
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                       <span className="text-[10px] font-black uppercase text-primary">Confirmed</span>
                       <span className="font-bold text-sm">ZMW 4,200</span>
                    </div>
                 </div>
              </Card>
           </div>

           <div className="pt-6 border-t border-border/40 space-y-4">
              <Button variant="outline" className="w-full h-11 rounded-xl border-2 font-bold text-sm">View Profile</Button>
              <Button variant="ghost" className="w-full h-11 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50">Report Guest</Button>
           </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}

function Textarea({ className, placeholder }: { className?: string, placeholder?: string }) {
  return (
    <textarea 
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      placeholder={placeholder}
    />
  );
}

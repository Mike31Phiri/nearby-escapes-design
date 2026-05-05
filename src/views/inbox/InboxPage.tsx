"use client";

import { useState } from "react";
import { Search, Send, Paperclip, MapPin, Calendar, ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const threads = [
  {
    id: "t1",
    name: "Mosi-oa-Tunya Lodge",
    role: "Host · Chanda",
    snippet: "Sure, I'll have warm towels ready. Safe travels!",
    time: "2m",
    unread: 2,
    listing: "Mosi-oa-Tunya Lodge",
    dates: "Apr 18 – Apr 21",
    messages: [
      { from: "host", text: "Hi Mike! Thanks for booking with us 🙂", time: "Yesterday" },
      { from: "me", text: "Excited! Any tips for the falls hike?", time: "Yesterday" },
      {
        from: "host",
        text: "Go early — gates open at 6 AM and you'll beat the crowds.",
        time: "Yesterday",
      },
      { from: "me", text: "Perfect. Could we get extra towels for the spray?", time: "Today" },
      { from: "host", text: "Sure, I'll have warm towels ready. Safe travels!", time: "2m ago" },
    ],
  },
  {
    id: "t2",
    name: "Luangwa Tented Camp",
    role: "Host · Mulenga",
    snippet: "Sundowner is at 6:15. We'll wait for you at reception.",
    time: "1h",
    unread: 0,
    listing: "Luangwa Tented Camp",
    dates: "May 02 – May 04",
    messages: [
      {
        from: "host",
        text: "Sundowner is at 6:15. We'll wait for you at reception.",
        time: "1h ago",
      },
    ],
  },
  {
    id: "t3",
    name: "Support · Nearby Escapes",
    role: "Support team",
    snippet: "Your refund of $45 has been processed.",
    time: "Yesterday",
    unread: 0,
    listing: "Refund #RE-208",
    dates: "Closed",
    messages: [{ from: "host", text: "Your refund of $45 has been processed.", time: "Yesterday" }],
  },
];

export function InboxPage() {
  const [activeId, setActiveId] = useState(threads[0].id);
  const [draft, setDraft] = useState("");
  const [showList, setShowList] = useState(true);
  const active = threads.find((t) => t.id === activeId)!;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-0 md:px-6 py-12">
        <div className="grid h-[calc(100vh-180px)] md:rounded-[40px] md:border md:border-border/60 md:overflow-hidden md:grid-cols-[380px_1fr] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <aside
            className={`${showList ? "block" : "hidden"} md:block border-r border-border/40 bg-white`}
          >
            <div className="p-8 space-y-6 border-b border-border/40">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black tracking-tight font-display">Inbox</h1>
                <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                  {threads.reduce((s, t) => s + t.unread, 0)} unread
                </Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input className="pl-10 h-12 rounded-2xl border-muted/30 bg-muted/20 font-medium text-sm" placeholder="Search conversations…" />
              </div>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full bg-muted/30 p-1 rounded-xl h-11">
                  <TabsTrigger value="all" className="flex-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="trips" className="flex-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                    Trips
                  </TabsTrigger>
                  <TabsTrigger value="support" className="flex-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                    Support
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ScrollArea className="h-full">
              <div className="divide-y divide-border/40">
                {threads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveId(t.id);
                      setShowList(false);
                    }}
                    className={`w-full text-left p-6 flex gap-4 transition-all hover:bg-muted/30 ${
                      activeId === t.id ? "bg-primary/5 border-r-4 border-r-primary" : ""
                    }`}
                  >
                    <Avatar className="h-12 w-12 shrink-0 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-black">
                        {t.name
                          .split(" ")
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-bold text-base truncate">{t.name}</p>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 shrink-0">{t.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium truncate leading-relaxed">{t.snippet}</p>
                      {t.unread > 0 && (
                        <div className="mt-2 flex">
                          <span className="bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full">{t.unread} new messages</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>

          <section className={`${showList ? "hidden md:flex" : "flex"} flex-col bg-white`}>
            <div className="p-6 border-b border-border/40 flex items-center justify-between bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="md:hidden rounded-full h-10 w-10"
                  onClick={() => setShowList(true)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-black">
                    {active.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-black text-lg tracking-tight truncate leading-none mb-1">{active.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{active.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest px-4 border-border/60">Details</Button>
              </div>
            </div>

            <div className="px-6 py-4 border-b border-border/40 flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 bg-[#FAFBFC]">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" strokeWidth={3} /> {active.listing}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" strokeWidth={3} /> {active.dates}
              </span>
            </div>

            <ScrollArea className="flex-1 p-8">
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="flex justify-center my-8">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 bg-muted/20 px-4 py-1.5 rounded-full">Conversation Started</span>
                </div>
                {active.messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div
                      className={`max-w-[70%] rounded-[24px] px-6 py-4 text-sm font-medium leading-relaxed shadow-sm ${
                        m.from === "me"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted/20 border border-border/40 text-foreground rounded-tl-none"
                      }`}
                    >
                      <p>{m.text}</p>
                      <p
                        className={`mt-2 text-[9px] font-black uppercase tracking-widest ${m.from === "me" ? "text-primary-foreground/60 text-right" : "text-muted-foreground/60"}`}
                      >
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-6 bg-white border-t border-border/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!draft.trim()) return;
                  setDraft("");
                }}
                className="bg-muted/20 border border-border/40 rounded-[28px] p-2 flex items-center gap-3 focus-within:ring-2 ring-primary/20 transition-all"
              >
                <Button type="button" size="icon" variant="ghost" className="rounded-full h-10 w-10 text-muted-foreground hover:text-primary transition-colors">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 border-none bg-transparent focus-visible:ring-0 shadow-none font-medium placeholder:text-muted-foreground/40"
                />
                <Button type="submit" size="icon" disabled={!draft.trim()} className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 text-white shadow-lg transition-transform active:scale-90">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

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
      { from: "host", text: "Go early — gates open at 6 AM and you'll beat the crowds.", time: "Yesterday" },
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
    messages: [{ from: "host", text: "Sundowner is at 6:15. We'll wait for you at reception.", time: "1h ago" }],
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-0 md:px-6 md:py-8">
        <div className="grid h-[calc(100vh-160px)] md:rounded-2xl md:border md:border-border md:overflow-hidden md:grid-cols-[320px_1fr]">
          <aside className={`${showList ? "block" : "hidden"} md:block border-r border-border bg-card`}>
            <div className="p-4 space-y-3 border-b border-border">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold tracking-tight">Inbox</h1>
                <Badge variant="secondary" className="text-[11px]">{threads.reduce((s, t) => s + t.unread, 0)} unread</Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9 h-9" placeholder="Search messages" />
              </div>
              <Tabs defaultValue="all">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="trips" className="flex-1">Trips</TabsTrigger>
                  <TabsTrigger value="support" className="flex-1">Support</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ScrollArea className="h-full">
              {threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setActiveId(t.id); setShowList(false); }}
                  className={`w-full text-left p-4 border-b border-border flex gap-3 transition hover:bg-muted/50 ${
                    activeId === t.id ? "bg-muted/50" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {t.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">{t.name}</p>
                      <span className="text-[11px] text-muted-foreground shrink-0">{t.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{t.snippet}</p>
                    {t.unread > 0 && (
                      <Badge className="mt-1 text-[10px] h-4 px-1.5">{t.unread} new</Badge>
                    )}
                  </div>
                </button>
              ))}
            </ScrollArea>
          </aside>

          <section className={`${showList ? "hidden md:flex" : "flex"} flex-col bg-background`}>
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Button size="icon" variant="ghost" className="md:hidden" onClick={() => setShowList(true)}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  {active.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{active.name}</p>
                <p className="text-xs text-muted-foreground">{active.role}</p>
              </div>
            </div>

            <div className="px-4 py-3 border-b border-border flex flex-wrap gap-3 text-xs text-muted-foreground bg-muted/30">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {active.listing}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {active.dates}</span>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3 max-w-2xl mx-auto">
                {active.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.from === "me" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                    }`}>
                      <p>{m.text}</p>
                      <p className={`mt-1 text-[10px] ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <form
              onSubmit={(e) => { e.preventDefault(); if (!draft.trim()) return; setDraft(""); }}
              className="border-t border-border p-3 flex items-center gap-2"
            >
              <Button type="button" size="icon" variant="ghost"><Paperclip className="h-4 w-4" /></Button>
              <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" className="flex-1" />
              <Button type="submit" size="icon" disabled={!draft.trim()}><Send className="h-4 w-4" /></Button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

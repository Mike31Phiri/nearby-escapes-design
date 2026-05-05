"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Mail, Phone, ExternalLink, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";

export default function HostProfileSettingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Host Profile</h1>
            <p className="text-muted-foreground text-lg mt-2">Manage how you appear to guests on Nearby Escapes.</p>
          </div>
          <Link href="/host/profile/1">
            <Button variant="outline" className="rounded-2xl h-12 px-6 border-2 font-bold flex items-center gap-2">
               View Public Profile <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-500">
            <Card className="border-border/60 shadow-xl rounded-[32px] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold">Public Bio</CardTitle>
                <CardDescription>Tell potential guests about yourself and your hospitality.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8 py-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-muted border-4 border-white shadow-lg">
                      <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&fit=crop&w=100&h=100" alt="Avatar" />
                    </div>
                    <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Host Photo</h4>
                    <p className="text-xs text-muted-foreground mb-4">A friendly photo helps build trust with guests.</p>
                    <Button variant="outline" className="rounded-xl h-10 px-6 font-bold border-2">Change Photo</Button>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="about">About Me</Label>
                    <Textarea 
                      id="about" 
                      defaultValue="I'm a native of Livingstone with a passion for Zambian wildlife and culture. I started hosting in 2021 to share the beauty of our riverside with travelers from around the world."
                      className="rounded-xl min-h-[200px] p-4 border-border/60" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Based In</Label>
                    <Input id="location" defaultValue="Livingstone, Zambia" className="rounded-xl h-12" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-xl rounded-[32px] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold">Contact Details</CardTitle>
                <CardDescription>This information is only shared with guests after a confirmed booking.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="grid gap-2">
                  <Label htmlFor="email">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground/50" />
                    <Input id="email" defaultValue="bwalya@nearbyescapes.com" className="rounded-xl h-12 pl-12" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">WhatsApp / Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground/50" />
                    <Input id="phone" defaultValue="+260 97 123 4567" className="rounded-xl h-12 pl-12" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
               <Button className="rounded-xl h-14 px-12 bg-primary font-extrabold text-lg shadow-xl">
                  Save Changes
               </Button>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="border-border/60 shadow-lg rounded-[32px] p-8 bg-primary/5 border-primary/10">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" /> Verified Host
              </h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium">Email Verified</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium">ID Verified</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium">Superhost Status Active</span>
                 </div>
              </div>
              <div className="mt-10 p-6 bg-white rounded-2xl shadow-sm border border-border/40">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-extrabold">4.9</span>
                  <span className="text-xs text-muted-foreground">(240 reviews)</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Global Rating</p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

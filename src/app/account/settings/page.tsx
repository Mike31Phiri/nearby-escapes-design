"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, CreditCard, Trash2, Camera, Mail, Phone, Lock } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 md:px-6 py-10 md:py-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-10">Account Settings</h1>

        <Tabs defaultValue="profile" className="space-y-10">
          <TabsList className="bg-muted/50 p-1.5 rounded-2xl h-auto overflow-x-auto justify-start md:justify-center no-scrollbar">
            <TabsTrigger value="profile" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm md:text-base flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm md:text-base flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm md:text-base flex items-center gap-2">
              <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="payment" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm md:text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-border/60 shadow-xl rounded-[32px] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
                <CardDescription>Update your personal details and how others see you.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8 py-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-muted border-4 border-white shadow-lg">
                      <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&fit=crop&w=100&h=100" alt="Avatar" />
                    </div>
                    <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Profile Photo</h4>
                    <p className="text-xs text-muted-foreground mb-4">Min 400x400px, PNG or JPG</p>
                    <div className="flex gap-3">
                      <Button variant="outline" className="rounded-xl h-10 px-6 font-bold border-2">Change</Button>
                      <Button variant="ghost" className="rounded-xl h-10 px-6 font-bold text-red-500 hover:bg-red-50">Remove</Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" defaultValue="Mwine" className="rounded-xl h-12" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" defaultValue="Phiri" className="rounded-xl h-12" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground/50" />
                      <Input id="email" defaultValue="mwine@example.com" className="rounded-xl h-12 pl-12" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground/50" />
                      <Input id="phone" defaultValue="+260 97 123 4567" className="rounded-xl h-12 pl-12" />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border/40">
                  <Button className="rounded-xl h-12 px-10 bg-primary font-bold shadow-lg">Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-xl rounded-[32px] overflow-hidden border-red-100 bg-red-50/20">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold text-red-900">Danger Zone</CardTitle>
                <CardDescription className="text-red-800/60">Manage your account deletion and data.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h4 className="font-bold text-red-900">Delete Account</h4>
                  <p className="text-sm text-red-800/70 mt-1">Permanently remove your account and all associated data. This action is irreversible.</p>
                </div>
                <Button variant="destructive" className="rounded-xl h-12 px-8 font-bold flex items-center gap-2 bg-red-600 shadow-lg">
                  <Trash2 className="h-4 w-4" /> Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-border/60 shadow-xl rounded-[32px]">
              <CardHeader className="p-8">
                <CardTitle className="text-2xl font-bold">Notification Preferences</CardTitle>
                <CardDescription>Control how you receive updates and alerts.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                {[
                  { title: "Booking Updates", desc: "Get notified about your reservation status and host messages.", default: true },
                  { title: "Promotions & Offers", desc: "Receive special deals and seasonal discounts from Nearby Escapes.", default: false },
                  { title: "Account Security", desc: "Alerts about new sign-ins or password changes.", default: true },
                  { title: "Review Prompts", desc: "Get reminded to leave feedback after your stays.", default: true },
                ].map((item) => (
                  <div key={item.title} className="flex items-start justify-between gap-6 py-4 border-b border-border/40 last:border-0">
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

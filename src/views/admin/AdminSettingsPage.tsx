"use client";

import { useState } from "react";
import { Settings, Globe, Shield, Bell, Database, Mail, Save, Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const sections = [
  { id: "general", label: "General", icon: Globe, description: "Basic platform identity and configuration" },
  { id: "security", label: "Security", icon: Shield, description: "Authentication and access control" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Email and push alert preferences" },
  { id: "database", label: "Database", icon: Database, description: "Data retention and backup settings" },
  { id: "smtp", label: "SMTP / Email", icon: Mail, description: "Email server and delivery settings" },
];

export function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <AdminLayout title="Platform Settings" description="Configure global variables and system-wide behavior">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-72 shrink-0 space-y-1">
           {sections.map((section) => (
             <button
               key={section.id}
               onClick={() => setActiveSection(section.id)}
               className={cn(
                 "w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all text-left group",
                 activeSection === section.id
                   ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                   : "text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm"
               )}
             >
               <section.icon className={cn("h-4.5 w-4.5", activeSection === section.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
               {section.label}
             </button>
           ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 w-full max-w-4xl space-y-8">
           {activeSection === "general" && (
              <div className="space-y-6">
                 <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl bg-white overflow-hidden">
                    <CardHeader className="px-8 pt-8">
                       <CardTitle className="text-xl font-black">Platform Identity</CardTitle>
                       <CardDescription className="text-sm font-semibold">Customize how your platform appears to guests and hosts.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-6">
                       <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                             <Label htmlFor="siteName" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Site Name</Label>
                             <Input id="siteName" defaultValue="Nearby Escapes" className="h-11 rounded-xl bg-muted/30 border-none font-bold focus-visible:ring-primary/20" />
                          </div>
                          <div className="space-y-2">
                             <Label htmlFor="supportEmail" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Support Email</Label>
                             <Input id="supportEmail" defaultValue="support@nearby.com" className="h-11 rounded-xl bg-muted/30 border-none font-bold focus-visible:ring-primary/20" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <Label htmlFor="tagline" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Marketing Tagline</Label>
                          <Input id="tagline" defaultValue="Discover Hidden Gems in Zambia" className="h-11 rounded-xl bg-muted/30 border-none font-bold focus-visible:ring-primary/20" />
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl bg-white overflow-hidden">
                    <CardHeader className="px-8 pt-8">
                       <CardTitle className="text-xl font-black">Regional Settings</CardTitle>
                       <CardDescription className="text-sm font-semibold">Manage currency and localization options.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-6">
                       <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/40">
                          <div className="space-y-0.5">
                             <p className="text-sm font-black">Enable Multi-Currency</p>
                             <p className="text-xs text-muted-foreground font-semibold">Allow users to view prices in their local currency.</p>
                          </div>
                          <Switch defaultChecked />
                       </div>
                       <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                             <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Default Currency</Label>
                             <Input defaultValue="ZMW (Zambian Kwacha)" disabled className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Primary Language</Label>
                             <Input defaultValue="English (US)" disabled className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           )}

           {activeSection === "security" && (
              <div className="space-y-6">
                 <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl bg-white">
                    <CardHeader className="px-8 pt-8">
                       <CardTitle className="text-xl font-black">Authentication</CardTitle>
                       <CardDescription className="text-sm font-semibold">Secure your platform with advanced login requirements.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-6">
                        <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                                 <Lock className="h-5 w-5" />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-emerald-900">Two-Factor Authentication</p>
                                 <p className="text-xs text-emerald-700/80 font-bold">Mandatory for all administrator accounts.</p>
                              </div>
                           </div>
                           <Switch defaultChecked />
                        </div>
                        
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                 <p className="text-sm font-black text-foreground">Social Login</p>
                                 <p className="text-xs text-muted-foreground font-semibold">Allow users to sign in with Google or Facebook.</p>
                              </div>
                              <Switch />
                           </div>
                           <Separator className="opacity-50" />
                           <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                 <p className="text-sm font-black text-foreground">Strict Passwords</p>
                                 <p className="text-xs text-muted-foreground font-semibold">Require symbols, numbers, and uppercase letters.</p>
                              </div>
                              <Switch defaultChecked />
                           </div>
                        </div>
                    </CardContent>
                 </Card>
              </div>
           )}

           {activeSection === "notifications" && (
              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl bg-white">
                 <CardHeader className="px-8 pt-8">
                    <CardTitle className="text-xl font-black">Email Alerts</CardTitle>
                    <CardDescription className="text-sm font-semibold">Define which system events trigger email notifications.</CardDescription>
                 </CardHeader>
                 <CardContent className="px-8 pb-8 space-y-6">
                    {[
                       { title: "New Bookings", desc: "Notify admins when a new booking is confirmed." },
                       { title: "Host Registration", desc: "Notify admins for new host applications." },
                       { title: "Listing Reports", desc: "Notify when a listing is flagged by a user." },
                       { title: "System Alerts", desc: "Low disk space, high CPU, or backup failures." },
                    ].map((item) => (
                       <div key={item.title} className="flex items-center justify-between group">
                          <div>
                             <p className="text-sm font-black group-hover:text-primary transition-colors">{item.title}</p>
                             <p className="text-xs text-muted-foreground font-semibold">{item.desc}</p>
                          </div>
                          <Switch defaultChecked />
                       </div>
                    ))}
                 </CardContent>
              </Card>
           )}

           <div className="flex items-center justify-end gap-3 pt-6">
              <Button variant="ghost" className="font-bold rounded-xl h-11 px-6">Discard Changes</Button>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className={cn(
                   "font-black rounded-xl h-11 px-8 min-w-[160px] transition-all",
                   saving ? "bg-emerald-500" : ""
                )}
              >
                {saving ? (
                   <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" /> Changes Saved
                   </div>
                ) : (
                   <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" /> Save Settings
                   </div>
                )}
              </Button>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}

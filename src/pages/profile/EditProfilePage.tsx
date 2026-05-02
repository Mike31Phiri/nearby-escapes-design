import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const interests = ["Safari", "Boutique stays", "Hiking", "River trips", "Local food", "Photography", "Music", "Coffee", "Markets", "Sunsets"];

export function EditProfilePage() {
  const [picked, setPicked] = useState<string[]>(["Safari", "Boutique stays", "Hiking", "River trips", "Local food", "Photography"]);
  const [saving, setSaving] = useState(false);

  function toggle(tag: string) {
    setPicked((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated");
    }, 600);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Profile
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Edit profile</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">How others see you</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This is your public profile shown to hosts when you request a stay.
          </p>
        </header>

        <Card className="mt-8 border-border/60">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-5">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">MP</AvatarFallback>
                </Avatar>
                <div>
                  <Button type="button" variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-1" /> Change photo
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">JPG or PNG, up to 5 MB.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="display">Display name</Label>
                  <Input id="display" defaultValue="Mike Phiri" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="Lusaka" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="bio">About me</Label>
                  <Textarea id="bio" rows={5} defaultValue="Software engineer who loves slow weekends in the bush, river boats and quiet boutique stays." />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="languages">Languages I speak</Label>
                  <Input id="languages" defaultValue="English, Bemba" />
                </div>
              </div>

              <div>
                <Label className="block mb-2">Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((tag) => {
                    const active = picked.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggle(tag)}
                        className="focus:outline-none"
                      >
                        <Badge variant={active ? "default" : "outline"} className="cursor-pointer text-xs">
                          {tag}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="ghost">Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

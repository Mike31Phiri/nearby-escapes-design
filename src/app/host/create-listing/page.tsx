"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Hotel, Bus, Gem, Package, 
  MapPin, Camera, DollarSign, 
  CheckCircle2, ArrowLeft, ArrowRight,
  Info, ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Category", icon: LayoutGrid },
  { id: 2, title: "Details", icon: Info },
  { id: 3, title: "Photos", icon: Camera },
  { id: 4, title: "Pricing", icon: DollarSign },
  { id: 5, title: "Review", icon: CheckCircle2 },
];

export default function CreateListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [price, setPrice] = useState(0);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = 5 - photos.length;
      const filesToProcess = files.slice(0, remainingSlots);

      if (files.length > remainingSlots) {
        alert("You can only upload up to 5 photos.");
      }

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new window.Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 1000;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
            setPhotos(prev => [...prev, dataUrl]);
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    }
  };

  const handlePublish = () => {
    try {
      const newListing = {
        id: "mock-" + Date.now(),
        name: title || "Untitled Listing",
        location: location || "Unknown Location",
        description: description,
        price: price || 0,
        category: category || "stay",
        rating: 5.0,
        reviews: 0,
        image: photos.length > 0 ? photos[0] : "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
        photos: photos
      };

      const existing = JSON.parse(localStorage.getItem("mock_host_listings") || "[]");
      localStorage.setItem("mock_host_listings", JSON.stringify([...existing, newListing]));
      
      router.push("/host/listing-success");
    } catch (error) {
      console.error("Failed to save listing:", error);
      alert("Failed to save listing. If you uploaded many high-resolution photos, please try using fewer or smaller images.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center py-12 md:py-20 px-4 md:px-6">
        <div className="w-full max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Progress Indicator */}
          <div className="relative flex justify-between items-center max-w-2xl mx-auto mb-16">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 -z-10" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 -z-10 transition-all duration-500" 
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  currentStep >= step.id 
                    ? "bg-primary border-primary text-white shadow-lg scale-110" 
                    : "bg-background border-muted text-muted-foreground"
                )}>
                  {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-bold text-sm">{step.id}</span>}
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest hidden md:block",
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          <Card className="border-border/60 shadow-2xl rounded-[40px] overflow-hidden">
            <CardContent className="p-8 md:p-16">
              {/* Step 1: Category */}
              {currentStep === 1 && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-extrabold tracking-tight">What kind of escape is it?</h2>
                    <p className="text-muted-foreground">Select the category that best describes your offering.</p>
                  </div>
                  <RadioGroup onValueChange={setCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { id: "stay", title: "Stay", icon: Hotel, desc: "Hotel, lodge, or house" },
                      { id: "transport", title: "Transport", icon: Bus, desc: "Bus, car, or transfer" },
                      { id: "gem", title: "Gem", icon: Gem, desc: "Local experience" },
                      { id: "package", title: "Package", icon: Package, desc: "Bundled trip" },
                    ].map((item) => (
                      <div key={item.id}>
                        <RadioGroupItem value={item.id} id={item.id} className="peer sr-only" />
                        <Label
                          htmlFor={item.id}
                          className="flex flex-col items-center text-center p-8 rounded-[32px] border-2 border-muted bg-card hover:bg-muted/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full"
                        >
                          <item.icon className="h-10 w-10 mb-4 text-primary" />
                          <span className="font-extrabold text-lg block mb-1">{item.title}</span>
                          <span className="text-xs text-muted-foreground">{item.desc}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight">Tell us more</h2>
                    <p className="text-muted-foreground">Provide clear details to attract the right guests.</p>
                  </div>
                  <div className="grid gap-6 max-w-2xl mx-auto">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Listing Title</Label>
                      <Input id="title" placeholder="e.g. Modern Riverside Villa" className="rounded-xl h-12" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground/50" />
                        <Input id="location" placeholder="City, Area" className="rounded-xl h-12 pl-12" value={location} onChange={e => setLocation(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe the unique features of your escape..." className="rounded-xl min-h-[150px] p-4" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Photos */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in duration-500 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight">Add some photos</h2>
                    <p className="text-muted-foreground">High-quality photos make a huge difference.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                    <div className="col-span-full relative group aspect-[21/9] rounded-[32px] overflow-hidden border border-border shadow-inner bg-muted/10">
                      {photos.length > 0 ? (
                        <img src={photos[activePreviewIndex] || photos[0]} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-500" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                          <Camera className="h-12 w-12 opacity-20" />
                          <p className="font-bold">No photos yet</p>
                        </div>
                      )}
                      <Label htmlFor="photo-upload" className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center cursor-pointer transition-all opacity-0 hover:opacity-100 group">
                        <Input id="photo-upload" type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={photos.length >= 5} />
                        <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          <Camera className="h-10 w-10 text-white" />
                          <p className="text-white font-bold">{photos.length >= 5 ? "Max 5 photos reached" : "Add Photos"}</p>
                        </div>
                      </Label>
                    </div>

                    {photos.map((photo, i) => (
                      <div 
                        key={i} 
                        onClick={() => setActivePreviewIndex(i)}
                        className={cn(
                          "aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all relative group",
                          activePreviewIndex === i ? "border-primary shadow-lg scale-105" : "border-transparent opacity-70 hover:opacity-100"
                        )}
                      >
                        <img src={photo} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhotos(prev => prev.filter((_, idx) => idx !== i));
                            if (activePreviewIndex >= i) setActivePreviewIndex(Math.max(0, activePreviewIndex - 1));
                          }}
                          className="absolute top-1 right-1 h-6 w-6 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <span className="text-xs">×</span>
                        </button>
                      </div>
                    ))}

                    {photos.length < 5 && Array.from({ length: 5 - photos.length }).map((_, i) => (
                      <Label 
                        key={`empty-${i}`} 
                        htmlFor="photo-upload"
                        className="aspect-square rounded-2xl border-2 border-dashed border-border flex items-center justify-center bg-muted/5 cursor-pointer hover:bg-muted/10 transition-colors"
                      >
                        <Camera className="h-6 w-6 text-muted-foreground/30" />
                      </Label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Pricing */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-in fade-in duration-500 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight">Set your price</h2>
                    <p className="text-muted-foreground">You can change this anytime after publishing.</p>
                  </div>
                  <div className="max-w-sm mx-auto p-12 bg-primary/5 rounded-[40px] border border-primary/10">
                    <div className="relative flex items-center justify-center">
                      <span className="text-2xl font-bold mr-2">ZMW</span>
                      <input 
                        type="number" 
                        value={price || ""}
                        onChange={e => setPrice(Number(e.target.value))} 
                        className="bg-transparent text-6xl font-black focus:outline-none w-48 text-center"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground mt-4">per night / per person</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 w-fit mx-auto px-4 py-2 rounded-full text-xs font-bold">
                    <ShieldCheck className="h-4 w-4" /> You&apos;ll earn ZMW 0.00 after our 5% service fee
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-extrabold tracking-tight">Almost there!</h2>
                    <p className="text-muted-foreground">Review your listing details before going live.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <div className="space-y-4">
                      <div className="aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border border-border/40 bg-muted/10">
                        <img 
                          src={photos[activePreviewIndex] || photos[0] || "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&fit=crop&w=600&h=450"} 
                          alt="Preview" 
                          className="h-full w-full object-cover animate-in fade-in zoom-in-95 duration-500" 
                        />
                      </div>
                      {photos.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                          {photos.map((photo, i) => (
                            <div 
                              key={i}
                              onClick={() => setActivePreviewIndex(i)}
                              className={cn(
                                "h-16 w-16 rounded-xl overflow-hidden cursor-pointer transition-all border-2 flex-shrink-0",
                                activePreviewIndex === i ? "border-primary scale-105" : "border-transparent opacity-60"
                              )}
                            >
                              <img src={photo} alt={`Preview ${i}`} className="h-full w-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-6">
                      <div>
                        <Badge className="bg-primary/10 text-primary mb-2 capitalize">{category || "Stay"}</Badge>
                        <h3 className="text-2xl font-bold">{title || "Listing Title"}</h3>
                        <p className="text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-4 w-4" /> {location || "Location"}</p>
                      </div>
                      <div className="p-6 bg-muted/30 rounded-2xl space-y-4">
                        <div className="flex justify-between font-bold">
                          <span>Nightly Rate</span>
                          <span>ZMW {price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground border-t border-border/40 pt-4">
                          <span>Visibility</span>
                          <span>Public</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-16 pt-8 border-t border-border/50 flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="rounded-xl font-bold flex items-center gap-2 h-12"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                
                {currentStep === 5 ? (
                  <Button onClick={handlePublish} className="rounded-xl px-12 h-14 bg-primary font-extrabold text-lg shadow-xl">
                    Publish Listing
                  </Button>
                ) : (
                  <Button 
                    onClick={nextStep}
                    disabled={currentStep === 1 && !category}
                    className="rounded-xl px-12 h-14 bg-primary font-extrabold text-lg shadow-xl flex items-center gap-2"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function LayoutGrid({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}

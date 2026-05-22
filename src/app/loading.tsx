import { Navbar } from "@/components/layout/Navbar";
import { Compass } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-500">
          <div className="h-24 w-24 bg-primary/10 rounded-[40px] flex items-center justify-center animate-spin-slow relative">
            <Compass className="h-10 w-10 text-primary animate-pulse" />
            <div className="absolute inset-0 border-4 border-primary/20 rounded-[40px] border-t-primary animate-spin" />
          </div>
          <p className="text-xl font-black text-primary uppercase tracking-widest animate-pulse">
            Loading...
          </p>
        </div>
      </main>
    </div>
  );
}

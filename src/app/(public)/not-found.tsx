import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center py-20">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <h1 className="text-[150px] leading-none font-black text-primary/10 select-none">404</h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight">Looks like you&apos;re lost</h2>
          <p className="text-muted-foreground text-xl">
            We can&apos;t seem to find the page you&apos;re looking for. It might have been removed
            or the link is incorrect.
          </p>
        </div>

        <Link href="/" className="inline-block mt-8">
          <Button className="h-14 rounded-2xl px-12 bg-primary font-extrabold text-xl shadow-xl">
            Back to Exploration
          </Button>
        </Link>
      </div>
    </div>
  );
}

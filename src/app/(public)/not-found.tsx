import Link from "next/link";
import { MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-[#faf8f4] px-4 py-16 sm:px-6">
      <div className="w-full max-w-xl text-center">
        <MapPinOff aria-hidden="true" className="mx-auto mb-7 size-12 text-purple" />
        <h1 className="text-balance text-3xl font-semibold text-black sm:text-4xl">
          Destination off the map.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
          We couldn&apos;t find the page you were looking for. Head back to Explore and find
          somewhere new.
        </p>

        <Button
          asChild
          variant="outline"
          className="mt-8 h-auto rounded-xl border-purple/40 bg-white px-10 py-4 text-base font-medium text-purple shadow-[0_4px_14px_rgba(107,43,184,0.14)] hover:border-purple hover:bg-purple hover:text-white sm:px-12"
        >
          <Link href="/explore">Explore</Link>
        </Button>
      </div>
    </main>
  );
}

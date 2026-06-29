import { Suspense } from "react";
import { HomePage } from "@/components/guest/home/HomePage";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomePage />
    </Suspense>
  );
}

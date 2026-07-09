import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

/**
 * Returns a `goBack` function that navigates to the previous route ONLY if
 * it was on the same site (same origin). If the user arrived from an external
 * site, a new tab, or directly by URL, it falls back to the provided `fallback`
 * path (defaults to the home page).
 */
export function useBackNavigation(fallback: string = ROUTES.home) {
  const router = useRouter();

  const goBack = () => {
    const referrer = typeof document !== "undefined" ? document.referrer : "";
    const isSameOrigin =
      referrer !== "" &&
      referrer.startsWith(typeof window !== "undefined" ? window.location.origin : "");

    if (isSameOrigin) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return goBack;
}

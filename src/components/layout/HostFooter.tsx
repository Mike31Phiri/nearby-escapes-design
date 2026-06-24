"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// List of routes where the footer should be visible (matches HostTabs logic)
const dashboardRoutes = [
  "/host",
  "/host/bookings",
  "/host/availability",
  "/host/notifications",
  "/host/finances",
];

export function HostFooter() {
  const pathname = usePathname();

  // ONLY render the footer if the current route is one of the dashboard tools
  if (!dashboardRoutes.includes(pathname)) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Compliance */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-[12px] text-gray-500 font-medium">
            <span>© {new Date().getFullYear()} Nearby Escapes.</span>
            <Link href="/legal/privacy" className="hover:text-gray-900 transition-colors">
              Privacy
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/legal/terms" className="hover:text-gray-900 transition-colors">
              Terms
            </Link>
          </div>

          {/* Right: Operational Support */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2 text-[12px] font-semibold text-gray-600">
            <Link href="/help" className="hover:text-primary transition-colors">
              Help Center
            </Link>
            <span className="text-gray-300">•</span>
            <a
              href="mailto:support@nearbyescapes.com"
              className="hover:text-primary transition-colors"
            >
              Contact Support
            </a>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5 cursor-default">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

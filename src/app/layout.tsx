import type { Metadata } from "next";
import "../styles.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Nearby Escapes — Stay, travel, explore Zambia",
  description: "Discover stays, bus tickets and hidden gems across Zambia. Book trusted lodges, hotels and tour packages with Nearby Escapes.",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nearby Escapes",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#0f766e" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}

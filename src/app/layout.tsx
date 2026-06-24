import { Plus_Jakarta_Sans, Outfit, Dancing_Script } from "next/font/google";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontDisplay = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const fontScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
});

import type { Metadata } from "next";
import "../styles.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { RouteProgressBar } from "@/components/ui/RouteProgressBar";
import { ClientModals } from "./ClientModals";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Nearby Escapes — Stay, travel, explore Zambia",
  description:
    "Discover stays, bus tickets and hidden gems across Zambia. Book trusted lodges, hotels and tour packages with Nearby Escapes.",
  keywords: [
    "Zambia",
    "travel",
    "booking",
    "lodges",
    "bus tickets",
    "tours",
    "Nearby Escapes",
    "vacation",
  ],
  authors: [{ name: "Nearby Escapes" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nearbyescapes.com",
    title: "Nearby Escapes — Stay, travel, explore Zambia",
    description:
      "Discover stays, bus tickets and hidden gems across Zambia. Book trusted lodges, hotels and tour packages with Nearby Escapes.",
    siteName: "Nearby Escapes",
    images: [
      {
        url: "https://images.pexels.com/photos/2166936/pexels-photo-2166936.jpeg",
        width: 1200,
        height: 630,
        alt: "Nearby Escapes Zambia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nearby Escapes — Stay, travel, explore Zambia",
    description:
      "Discover stays, bus tickets and hidden gems across Zambia. Book trusted lodges, hotels and tour packages with Nearby Escapes.",
    images: ["https://images.pexels.com/photos/2166936/pexels-photo-2166936.jpeg"],
  },
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
        <link rel="icon" type="image/jpeg" href="/favicon.jpg" />
        <link rel="apple-touch-icon" href="/favicon.jpg" />
        <meta name="theme-color" content="#2A1B3D" />
      </head>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} ${fontScript.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <Suspense fallback={null}>
            <RouteProgressBar />
          </Suspense>
          {children}
          <Toaster />
          <ClientModals />
        </AuthProvider>
      </body>
    </html>
  );
}

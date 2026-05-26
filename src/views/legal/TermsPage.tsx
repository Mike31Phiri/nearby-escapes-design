"use client";

import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-12">
          <Link href="/help" className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-6">
            <ArrowLeft className="h-3 w-3" /> Back to Help Center
          </Link>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
            <div><h1 className="text-2xl font-bold tracking-tight text-foreground">Terms of Service</h1><p className="text-sm text-muted-foreground">Last updated: May 2025</p></div>
          </div>
          <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
            <section><h2 className="text-lg font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Nearby Escapes, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. We reserve the right to update these terms at any time; continued use constitutes acceptance of changes.</p></section>
            <section><h2 className="text-lg font-bold text-foreground mb-3">2. User Responsibilities</h2>
            <p>You agree to provide accurate information when creating an account and making bookings. You are responsible for maintaining the confidentiality of your account credentials. You may not use the platform for any unlawful purpose or in violation of any applicable laws or regulations.</p></section>
            <section><h2 className="text-lg font-bold text-foreground mb-3">3. Bookings & Payments</h2>
            <p>All bookings are subject to availability and host confirmation. Prices are displayed in Zambian Kwacha (K) and include applicable taxes unless otherwise stated. Cancellation policies vary by host and are displayed before booking. We process payments securely on behalf of hosts.</p></section>
            <section><h2 className="text-lg font-bold text-foreground mb-3">4. Host Obligations</h2>
            <p>Hosts agree to maintain accurate listings, honor confirmed bookings, respond promptly to guest inquiries, and provide services as described. Failure to meet these obligations may result in account suspension or removal from the platform.</p></section>
            <section><h2 className="text-lg font-bold text-foreground mb-3">5. Limitation of Liability</h2>
            <p>Nearby Escapes acts as a marketplace connecting guests and hosts. We are not responsible for the actual condition of listings, the conduct of guests or hosts, or any damages arising from bookings made through our platform. Our liability is limited to the maximum extent permitted by law.</p></section>
            <section><h2 className="text-lg font-bold text-foreground mb-3">6. Contact</h2>
            <p>For questions about these terms, contact legal@nearbyescapes.com.</p></section>
          </div>
        </div>
      </main>
    </div>
  );
}

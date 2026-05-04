"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Download, Info } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const documents = [
  { id: "d1", year: "2025", type: "Annual income summary", status: "Available", size: "112 KB" },
  { id: "d2", year: "2024", type: "Annual income summary", status: "Available", size: "98 KB" },
  { id: "d3", year: "2025", type: "Tax invoice (traveler)", status: "Available", size: "64 KB" },
];

export function TaxesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Account
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Taxes</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Tax information</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage tax residency, invoice details and download your yearly statements.
          </p>
        </header>

        <Card className="mt-8 border-border/60">
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold tracking-tight">Tax profile</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="taxName">Legal name</Label>
                <Input id="taxName" defaultValue="Mike Phiri" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tpin">TPIN / Tax number</Label>
                <Input id="tpin" placeholder="e.g. 1001234567" />
              </div>
              <div className="space-y-1.5">
                <Label>Tax residency</Label>
                <Select defaultValue="ZM">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ZM">Zambia</SelectItem>
                    <SelectItem value="ZA">South Africa</SelectItem>
                    <SelectItem value="ZW">Zimbabwe</SelectItem>
                    <SelectItem value="OT">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invoice">Invoice email</Label>
                <Input id="invoice" type="email" defaultValue="mike@example.com" />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end">
              <Button>Save tax profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-border/60">
          <CardContent className="p-0">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold tracking-tight">Documents</h2>
            </div>
            {documents.map((d, i) => (
              <div key={d.id}>
                {i > 0 && <Separator />}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {d.type} · {d.year}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {d.status} · {d.size}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-primary-soft/40 p-4">
          <Info className="mt-0.5 h-4 w-4 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            Tax forms are generated each January. Hosts earning above the local threshold will be
            contacted for additional documentation.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

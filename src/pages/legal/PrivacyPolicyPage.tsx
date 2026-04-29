import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const sections = [
  { id: "scope", title: "1. Scope", body: "This policy explains what personal data we collect when you use Nearby Escapes, why we collect it, and the choices you have." },
  { id: "data", title: "2. Data we collect", body: "Account data (name, email), booking data (dates, prices, host messages), device data (browser, IP) and optional data you choose to share (photos, ID for verification)." },
  { id: "use", title: "3. How we use data", body: "To run bookings, prevent fraud, comply with the law and improve the service. We do not sell personal data." },
  { id: "share", title: "4. Sharing", body: "We share booking data with the host you book with, and with payment processors needed to take payment and pay out hosts. We never share your contact details with third-party advertisers." },
  { id: "rights", title: "5. Your rights", body: "You can access, export or delete your data from Account → Privacy. We respond to verified requests within 30 days." },
  { id: "retention", title: "6. Retention", body: "Booking and payment records are kept for 7 years to meet tax and accounting laws. Other data is deleted within 90 days of account closure." },
  { id: "security", title: "7. Security", body: "Data is encrypted in transit and at rest. Access by staff is limited to those who need it and is logged for auditing." },
  { id: "kids", title: "8. Children", body: "Nearby Escapes is not intended for people under 18. We delete accounts identified as belonging to minors." },
  { id: "contact", title: "9. Contact our DPO", body: "Questions or complaints can be sent to privacy@nearbyescapes.example." },
];

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-6 md:py-14">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Legal</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Privacy policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Effective April 28, 2026 · v2.4</p>
        </header>

        <div className="mt-8 grid gap-8 md:grid-cols-[200px_1fr]">
          <aside className="hidden md:block">
            <nav className="sticky top-24 space-y-1 text-sm">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="block px-3 py-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          <Card className="border-border/60">
            <CardContent className="p-6 md:p-8">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id}>
                  {i > 0 && <Separator className="my-6" />}
                  <h2 className="text-lg font-bold tracking-tight">{s.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{s.body}</p>
                </section>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

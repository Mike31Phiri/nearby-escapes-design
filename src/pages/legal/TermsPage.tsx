import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const sections = [
  { id: "acceptance", title: "1. Acceptance of terms", body: "By accessing or using Nearby Escapes you agree to be bound by these terms. If you do not agree, please do not use the service." },
  { id: "account", title: "2. Your account", body: "You are responsible for keeping your login credentials safe and for any activity on your account. Notify us immediately if you suspect unauthorised use." },
  { id: "bookings", title: "3. Bookings & cancellations", body: "When you book a stay, a contract is formed directly between you and the host. The cancellation policy chosen by the host applies — see your booking page for details." },
  { id: "payments", title: "4. Payments & fees", body: "Service fees and taxes are shown clearly before checkout. We hold guest payments and release them to hosts after check-in to protect both sides." },
  { id: "conduct", title: "5. Acceptable use", body: "Treat hosts, guests and properties with respect. Behaviour that endangers people, damages property or breaks the law will lead to removal from the platform." },
  { id: "content", title: "6. Reviews & content", body: "You retain ownership of the content you post and grant us a licence to display it on Nearby Escapes. We may remove content that violates these terms." },
  { id: "liability", title: "7. Liability", body: "We are not liable for the conduct of hosts or guests, or for indirect losses arising from a stay. Our total liability is capped at the amounts you paid for the stay in question." },
  { id: "changes", title: "8. Changes to these terms", body: "We may update these terms from time to time. Material changes will be communicated by email or in-app at least 30 days in advance." },
  { id: "contact", title: "9. Contact", body: "Questions about these terms can be sent to legal@nearbyescapes.example." },
];

export function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-6 md:py-14">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Legal</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Terms of service</h1>
          <p className="mt-2 text-sm text-muted-foreground">Effective April 28, 2026 · v3.2</p>
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

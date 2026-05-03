import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Users, Leaf, MessageCircle, AlertOctagon } from "lucide-react";

const pillars = [
  {
    icon: Heart,
    title: "Be respectful",
    body: "Treat hosts, guests and our team with kindness — in messages, reviews and in person.",
  },
  {
    icon: Shield,
    title: "Be safe",
    body: "No illegal activity, weapons, or behaviour that puts people or property at risk.",
  },
  {
    icon: Users,
    title: "Be inclusive",
    body: "Discrimination on race, religion, gender, sexuality or ability has no place on Nearby Escapes.",
  },
  {
    icon: Leaf,
    title: "Be a guest",
    body: "Respect house rules, neighbourhood quiet hours and the natural places we visit.",
  },
  {
    icon: MessageCircle,
    title: "Be honest",
    body: "Reviews and listing details should reflect reality. Don't attempt to manipulate ratings.",
  },
  {
    icon: AlertOctagon,
    title: "Reporting",
    body: "If you see behaviour that breaks these standards, report it. We investigate every report within 24 hours.",
  },
];

export function CommunityStandardsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-6 md:py-14">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Legal</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Community standards
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Nearby Escapes works because hosts and guests trust each other. These are the standards
            we hold everyone to, and what to do when something goes wrong.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {pillars.map((p) => (
            <Card key={p.title} className="border-border/60">
              <CardContent className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <p.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-3 text-base font-semibold">{p.title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground leading-6">{p.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-border/60">
          <CardContent className="p-6 md:p-8 space-y-5 text-sm leading-7 text-muted-foreground">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              What happens when standards are broken
            </h2>
            <p>
              We treat first-time, accidental issues differently from repeat or serious ones. Most
              cases end with a warning and a private conversation.
            </p>
            <p>
              Serious or repeat issues — fraud, violence, discrimination, illegal use — lead to
              permanent removal from the platform and a ban on future accounts.
            </p>
            <p>
              If you've been wrongly affected by a removal, you can appeal within 14 days. A
              different team member will review the decision.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("Nearby Escapes");
  const [supportEmail, setSupportEmail] = useState("support@nearbyescapes.zm");
  const [commissionRate, setCommissionRate] = useState("12");
  const [currency, setCurrency] = useState("USD");
  const [maintenance, setMaintenance] = useState(false);
  const [autoApproveHosts, setAutoApproveHosts] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Platform-wide configuration.</p>
      </div>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Site name" value={siteName} onChange={setSiteName} />
          <Field label="Support email" type="email" value={supportEmail} onChange={setSupportEmail} />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader><CardTitle className="text-base">Marketplace</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Commission rate (%)" type="number" value={commissionRate} onChange={setCommissionRate} />
          <Field label="Currency" value={currency} onChange={setCurrency} />
          <Separator />
          <Toggle label="Auto-approve new hosts" description="Skip manual review for new host applications." checked={autoApproveHosts} onChange={setAutoApproveHosts} />
          <Toggle label="Email notifications" description="Send admin email digests for important events." checked={emailNotifs} onChange={setEmailNotifs} />
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader><CardTitle className="text-base text-destructive">Danger zone</CardTitle></CardHeader>
        <CardContent>
          <Toggle
            label="Maintenance mode"
            description="Visitors will see a maintenance page until disabled."
            checked={maintenance}
            onChange={setMaintenance}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          className="bg-[image:var(--gradient-hero)] hover:opacity-95"
          onClick={() => toast.success("Settings saved")}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

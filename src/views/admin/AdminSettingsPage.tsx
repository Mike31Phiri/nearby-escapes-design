import { useState } from "react";
import { Settings, Globe, Mail, CreditCard, Shield, Bell } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("Nearby Escapes");
  const [supportEmail, setSupportEmail] = useState("support@nearbyescapes.com");
  const [currency, setCurrency] = useState("ZMW");
  const [language, setLanguage] = useState("en");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newUserApproval, setNewUserApproval] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(true);

  function handleSave() {
    toast.success("Settings saved successfully");
  }

  return (
    <AdminLayout title="Platform Settings" description="Configure global platform settings">
      <div className="space-y-6">
        {/* General Settings */}
        <Card className="border-border/60">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">General Settings</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Default Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ZMW">ZMW - Zambian Kwacha</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="language">Default Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bemba">Bemba</SelectItem>
                    <SelectItem value="nyanja">Nyanja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/60">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <ToggleRow
                label="Email Notifications"
                description="Send system-wide email notifications to users"
                checked={emailNotifications}
                onChange={setEmailNotifications}
              />
              <Separator />
              <ToggleRow
                label="Booking Alerts"
                description="Receive real-time alerts for new bookings and cancellations"
                checked={bookingAlerts}
                onChange={setBookingAlerts}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card className="border-border/60">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Security & Access</h2>
            </div>
            <div className="space-y-4">
              <ToggleRow
                label="Maintenance Mode"
                description="Take the platform offline for maintenance. Users will see a maintenance page."
                checked={maintenanceMode}
                onChange={setMaintenanceMode}
              />
              <Separator />
              <ToggleRow
                label="Require User Approval"
                description="New user registrations require admin approval before activation"
                checked={newUserApproval}
                onChange={setNewUserApproval}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="border-border/60">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Payment Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Payment Gateway</Label>
                  <Select defaultValue="stripe">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="flutterwave">Flutterwave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Commission Rate (%)</Label>
                  <Input type="number" defaultValue="10" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-[image:var(--gradient-hero)] hover:opacity-95">
            <Settings className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

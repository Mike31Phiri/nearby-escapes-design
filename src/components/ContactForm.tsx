import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "Name is too long"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(255, "Email is too long"),
  subject: z.string().trim().min(3, "Subject is too short").max(120, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message is too short")
    .max(2000, "Message must be under 2000 characters"),
});

type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const parsed = contactSchema.safeParse({
      name: data.get("name"),
      email: data.get("email"),
      subject: data.get("subject"),
      message: data.get("message"),
    });

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof ContactInput;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      // TODO: wire up to NestJS backend at /api/contact
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Thanks — we'll get back to you shortly.");
      form.reset();
    } catch {
      toast.error("Couldn't send right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <Input id="name" name="name" autoComplete="name" maxLength={80} required />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" maxLength={255} required />
        </Field>
      </div>
      <Field id="subject" label="Subject" error={errors.subject}>
        <Input id="subject" name="subject" maxLength={120} required />
      </Field>
      <Field id="message" label="Message" error={errors.message}>
        <Textarea id="message" name="message" rows={5} maxLength={2000} required />
      </Field>
      <Button
        type="submit"
        disabled={submitting}
        className="bg-[image:var(--gradient-hero)] hover:opacity-95"
      >
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

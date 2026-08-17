import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Vitalis — talk to our nutrition team" },
      {
        name: "description",
        content:
          "Questions about plans, targets or your data? Send the Vitalis team a message and we'll reply within one business day.",
      },
      { property: "og:title", content: "Contact Vitalis" },
      {
        property: "og:description",
        content: "Reach the Vitalis team for support, partnerships or coaching questions.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Let's talk</h1>
          <p className="mt-5 text-muted-foreground">
            Whether you need help setting targets or want to bring Vitalis to your clinic, we read
            every message.
          </p>
          <ul className="mt-10 grid gap-4 text-sm">
            {[
              { icon: Mail, text: "hello@nutritrack.app" },
              { icon: Phone, text: "+1 (415) 555-0132" },
              { icon: MapPin, text: "221 Grove Street, San Francisco" },
            ].map((c) => (
              <li key={c.text} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <c.icon className="size-4" />
                </span>
                {c.text}
              </li>
            ))}
          </ul>
        </div>
        <form
          className="surface-card grid gap-5 p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent", { description: "We'll get back to you shortly." });
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="c-name">Full name</Label>
              <Input id="c-name" required placeholder="Reem Haboush" className="h-11 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="c-email">Email</Label>
              <Input
                id="c-email"
                type="email"
                required
                placeholder="you@email.com"
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c-subject">Subject</Label>
            <Input id="c-subject" placeholder="How can we help?" className="h-11 rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c-message">Message</Label>
            <Textarea id="c-message" rows={6} className="rounded-xl" />
          </div>
          <Button type="submit" className="h-11 rounded-xl">
            Send message
          </Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}

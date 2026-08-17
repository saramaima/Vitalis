import { createFileRoute } from "@tanstack/react-router";

import lifestyle from "@/assets/lifestyle-run.jpg";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Vitalis — nutrition coaching without the noise" },
      {
        name: "description",
        content:
          "Vitalis is built by dietitians and engineers who believe healthy habits should be measurable, calm and genuinely sustainable.",
      },
      { property: "og:title", content: "About Vitalis" },
      {
        property: "og:description",
        content: "Why we built a calm, premium nutrition and health tracker.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8">
        <div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Health data you'll actually use</h1>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Vitalis started as a spreadsheet shared between a dietitian and her clients. The numbers
            worked; the experience didn't. So we rebuilt it as a product: fast logging, honest
            targets and visuals that make a good week obvious at a glance.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Today more than 40,000 people use Vitalis to plan meals, train consistently and stay
            hydrated — without turning their lives into a data-entry job.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-4">
            {[
              { k: "40k+", v: "Active members" },
              { k: "12M", v: "Meals logged" },
              { k: "4.9", v: "Average rating" },
            ].map((s) => (
              <div key={s.k} className="surface-card p-5">
                <dt className="font-display text-2xl font-bold text-primary">{s.k}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <img
          src={lifestyle}
          alt="Runner training outdoors at sunrise"
          width={1920}
          height={1088}
          loading="lazy"
          className="aspect-[4/5] w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
        />
      </main>
      <SiteFooter />
    </div>
  );
}

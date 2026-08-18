import { createFileRoute } from "@tanstack/react-router";
import { Apple, Droplets, Dumbbell, LineChart, Scale, Target } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Vitalis health & nutrition tracking" },
      {
        name: "description",
        content:
          "Meal logging, exercise tracking, hydration, weight trends, goals and progress insights — see everything Vitalis does for your daily routine.",
      },
      { property: "og:title", content: "Features — Vitalis" },
      {
        property: "og:description",
        content: "Meals, exercise, water, weight, goals and insights in one premium tracker.",
      },
    ],
  }),
  component: FeaturesPage,
});

const items = [
  {
    icon: Apple,
    title: "Meal Tracking",
    body: "Log breakfast through snacks with serving sizes and instant macro breakdowns.",
  },
  {
    icon: Dumbbell,
    title: "Exercise Tracking",
    body: "Capture workouts in a two-tap modal and see burned calories fold into your balance.",
  },
  {
    icon: Droplets,
    title: "Water Tracking",
    body: "Glass-by-glass hydration with a target that adapts to your activity level.",
  },
  {
    icon: Scale,
    title: "Weight Tracking",
    body: "Daily weigh-ins smoothed into a clean trend line, not a noisy scatter of numbers.",
  },
  {
    icon: LineChart,
    title: "Progress Insights",
    body: "Weekly, monthly and quarterly views with averages that reveal what's actually working.",
  },
  {
    icon: Target,
    title: "Goals & Targets",
    body: "Set calorie and macro targets once, then let Vitalis keep score for you.",
  },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <h1 className="max-w-2xl text-4xl font-extrabold sm:text-5xl">
          Built for the habits that actually move the needle
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Every module is designed to take seconds a day and still give you a full picture of your
          nutrition and training.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="surface-card surface-card-hover p-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                <item.icon className="size-5" />
              </span>
              <h2 className="mt-5 font-display text-lg font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

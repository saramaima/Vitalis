import { Link, createFileRoute } from "@tanstack/react-router";
import { Apple, ArrowRight, Droplets, Dumbbell, Flame, LineChart, Scale } from "lucide-react";

import heroBowl from "@/assets/hero-bowl.jpg";
import lifestyle from "@/assets/lifestyle-run.jpg";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitalis — Track your health. Transform your life." },
      {
        name: "description",
        content:
          "Vitalis is a premium health and nutrition tracker for meals, exercise, water, weight and progress insights — all in one calm dashboard.",
      },
      { property: "og:title", content: "Vitalis — Track your health. Transform your life." },
      {
        property: "og:description",
        content:
          "Log meals, workouts, hydration and weight, then watch your progress compound with clear daily insights.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { label: "Meal Tracking", icon: Apple },
  { label: "Exercise Tracking", icon: Dumbbell },
  { label: "Water Tracking", icon: Droplets },
  { label: "Weight Tracking", icon: Scale },
  { label: "Progress Insights", icon: LineChart },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-semibold text-accent-foreground">
            <Flame className="size-3.5" />
            Trusted daily nutrition companion
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
            Track your health. <span className="text-gradient-green">Transform your life.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Log meals, workouts, hydration and weight in seconds. Vitalis turns everyday habits into
            clear, encouraging insights so you always know your next best step.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
              <Link to="/signup">
                Start free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-primary/30 px-7 text-base text-primary hover:bg-primary-soft"
            >
              <Link to="/dashboard">View dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <img
            src={heroBowl}
            alt="Healthy grain bowl with salmon, avocado and greens"
            width={1200}
            height={1200}
            className="aspect-square w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
          />
          <div className="glass-stat absolute -left-2 top-8 w-48 p-4 sm:-left-6">
            <p className="text-xs font-medium text-muted-foreground">Today's Calories</p>
            <p className="mt-1 font-display text-xl font-bold">
              1450<span className="text-sm font-medium text-muted-foreground">/2000</span>
            </p>
            <Progress value={72} className="mt-3 h-1.5" />
          </div>
          <div className="glass-stat absolute -right-2 bottom-10 w-48 p-4 sm:-right-6">
            <p className="text-xs font-medium text-muted-foreground">Water Intake</p>
            <p className="mt-1 font-display text-xl font-bold">
              5<span className="text-sm font-medium text-muted-foreground">/8 glasses</span>
            </p>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <Droplets
                  key={i}
                  className={i < 5 ? "size-4 text-water" : "size-4 text-muted-foreground/30"}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-10 sm:grid-cols-3 lg:grid-cols-5 lg:px-8">
          {features.map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-3 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
                <f.icon className="size-6" />
              </span>
              <p className="text-sm font-semibold">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative isolate">
        <img
          src={lifestyle}
          alt="Woman running along a waterfront path at sunrise"
          width={1920}
          height={1088}
          loading="lazy"
          className="h-[520px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/45 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-5 lg:px-8">
          <div className="max-w-lg rounded-2xl bg-foreground/55 p-8 backdrop-blur-md sm:p-10">
            <h2 className="text-3xl font-bold text-background sm:text-4xl">
              Everything you need to achieve your goals
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-background/85 sm:text-base">
              Nutrition targets, workout logs, hydration reminders and weight trends live in one
              place. Vitalis keeps the numbers honest and the habits sustainable — so progress feels
              inevitable rather than exhausting.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-7 h-12 rounded-full bg-background px-7 text-base text-foreground hover:bg-background/90"
            >
              <Link to="/onboarding">Set up your plan</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

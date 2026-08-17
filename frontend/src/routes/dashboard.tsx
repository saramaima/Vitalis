import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Apple, Droplets, Dumbbell, Scale } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";

import { AppShell, SectionCard } from "@/components/app-shell";
import { AddExerciseDialog, AddWaterDialog, AddWeightDialog } from "@/components/quick-add-dialogs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiGet, formatApiError } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Vitalis" }] }),
  component: DashboardPage,
});

type MealFood = {
  id: number;
  name: string;
  serving_size: string;
  calories: number;
  pivot: { quantity: number | string };
};
type Meal = { id: number; meal_type: string; total_calories: number; foods: MealFood[] };
type Dashboard = {
  date: string;
  onboarding_completed: boolean;
  calories: { target: number; consumed: number; burned: number; net: number; remaining: number };
  macros: {
    protein: { consumed: number; target: number | null };
    carbs: { consumed: number; target: number | null };
    fat: { consumed: number; target: number | null };
  };
  water: { consumed: number; target: number };
  weight: { current: string | number | null; target: string | number | null };
  meals: Meal[];
};

function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      setData(await apiGet<Dashboard>("/dashboard"));
    } catch (error: any) {
      if (error?.status === 422 && String(error?.message).includes("onboarding")) {
        navigate({ to: "/onboarding" });
        return;
      }
      if (error?.status === 401) {
        navigate({ to: "/login" });
        return;
      }
      toast.error(formatApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const macroStats = data
    ? [
        { label: "Calories", value: data.calories.net, target: data.calories.target, unit: "kcal" },
        {
          label: "Protein",
          value: data.macros.protein.consumed,
          target: data.macros.protein.target ?? 0,
          unit: "g",
        },
        {
          label: "Carbs",
          value: data.macros.carbs.consumed,
          target: data.macros.carbs.target ?? 0,
          unit: "g",
        },
        {
          label: "Fat",
          value: data.macros.fat.consumed,
          target: data.macros.fat.target ?? 0,
          unit: "g",
        },
      ]
    : [];

  const nutritionBreakdown = useMemo(
    () =>
      data
        ? [
            { name: "Protein", value: data.macros.protein.consumed, color: "var(--protein)" },
            { name: "Carbs", value: data.macros.carbs.consumed, color: "var(--carbs)" },
            { name: "Fat", value: data.macros.fat.consumed, color: "var(--fat)" },
          ]
        : [],
    [data],
  );

  const todaysFoods =
    data?.meals.flatMap((meal) =>
      meal.foods.map((food) => ({
        ...food,
        meal: meal.meal_type,
        quantity: Number(food.pivot.quantity),
      })),
    ) ?? [];

  return (
    <AppShell
      title="Dashboard"
      actions={
        <>
          <Button className="rounded-full" size="sm" onClick={() => navigate({ to: "/meals" })}>
            <Apple className="size-4" /> Add food
          </Button>
          <AddExerciseDialog
            onSaved={load}
            trigger={
              <Button variant="outline" size="sm" className="rounded-full">
                <Dumbbell className="size-4" /> Add exercise
              </Button>
            }
          />
          <AddWaterDialog
            onSaved={load}
            trigger={
              <Button variant="outline" size="sm" className="rounded-full">
                <Droplets className="size-4" /> Add water
              </Button>
            }
          />
          <AddWeightDialog
            onSaved={load}
            trigger={
              <Button variant="outline" size="sm" className="rounded-full">
                <Scale className="size-4" /> Log weight
              </Button>
            }
          />
        </>
      }
    >
      {loading && <p className="text-sm text-muted-foreground">Loading your dashboard...</p>}
      {!loading && data && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {macroStats.map((s) => (
              <div key={s.label} className="surface-card surface-card-hover p-5">
                <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                <p className="mt-2 font-display text-2xl font-bold">
                  {Math.round(s.value)}
                  <span className="text-sm font-medium text-muted-foreground">
                    /{s.target || "—"} {s.unit}
                  </span>
                </p>
                <Progress
                  value={s.target ? Math.min(100, (s.value / s.target) * 100) : 0}
                  className="mt-4 h-1.5"
                />
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div className="surface-card p-5">
              <p className="text-sm text-muted-foreground">Water</p>
              <p className="mt-2 font-display text-2xl font-bold">
                {data.water.consumed}/{data.water.target} glasses
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm text-muted-foreground">Calories burned</p>
              <p className="mt-2 font-display text-2xl font-bold">{data.calories.burned} kcal</p>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="mt-2 font-display text-2xl font-bold">
                {data.weight.current ?? "—"} kg{" "}
                <span className="text-sm text-muted-foreground">/ {data.weight.target ?? "—"}</span>
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <SectionCard title="Today's meals" className="lg:col-span-2">
              {todaysFoods.length ? (
                <ul className="grid gap-3">
                  {todaysFoods.map((m) => (
                    <li
                      key={`${m.meal}-${m.id}`}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{m.name}</p>
                        <p className="truncate text-xs capitalize text-muted-foreground">
                          {m.meal} · {m.quantity} × {m.serving_size}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold">
                        {Math.round(m.calories * m.quantity)} kcal
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No meals logged today yet.</p>
              )}
            </SectionCard>

            <SectionCard title="Nutrition breakdown">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={nutritionBreakdown}
                      dataKey="value"
                      innerRadius={55}
                      outerRadius={85}
                    >
                      {nutritionBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-4 grid gap-2 text-sm">
                {nutritionBreakdown.map((n) => (
                  <li key={n.name} className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: n.color }} />
                    <span className="flex-1 text-muted-foreground">{n.name}</span>
                    <span className="font-semibold">{n.value} g</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </>
      )}
    </AppShell>
  );
}

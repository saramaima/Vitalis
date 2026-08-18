import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { AppShell, SectionCard } from "@/components/app-shell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiGet, formatApiError } from "@/lib/api";
export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "Progress — Vitalis" }] }),
  component: ProgressPage,
});
type P = {
  range: string;
  weight_trend: { date: string; weight: string | number }[];
  calories: { average: number; daily: { date: string; calories: number }[] };
  exercise_summary: { total_workouts: number; total_minutes: number; calories_burned: number };
};
function ProgressPage() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<P | null>(null);
  useEffect(() => {
    apiGet<P>(`/progress?range=${range}`)
      .then(setData)
      .catch((e) => toast.error(formatApiError(e)));
  }, [range]);
  const weights = data?.weight_trend.map((w) => ({ d: w.date, w: Number(w.weight) })) ?? [];
  return (
    <AppShell title="Progress" subtitle="See how your habits change over time.">
      <Tabs value={range} onValueChange={setRange}>
        <TabsList>
          <TabsTrigger value="7d">7 days</TabsTrigger>
          <TabsTrigger value="30d">30 days</TabsTrigger>
          <TabsTrigger value="3m">3 months</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">Average calories</p>
          <p className="mt-2 text-2xl font-bold">{data?.calories.average ?? 0}</p>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">Workouts</p>
          <p className="mt-2 text-2xl font-bold">{data?.exercise_summary.total_workouts ?? 0}</p>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">Active minutes</p>
          <p className="mt-2 text-2xl font-bold">{data?.exercise_summary.total_minutes ?? 0}</p>
        </div>
      </div>
      <SectionCard title="Weight trend" className="mt-5">
        {weights.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-center text-sm text-muted-foreground">
            No weight data yet. Add a weight record to start tracking your progress.
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weights}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="d" />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                <Tooltip />
                <Line type="monotone" dataKey="w" stroke="var(--primary)" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </SectionCard>
      <SectionCard title="Daily calories" className="mt-5">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.calories.daily ?? []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="calories" stroke="var(--primary)" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </AppShell>
  );
}

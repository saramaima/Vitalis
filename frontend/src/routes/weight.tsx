import { createFileRoute } from "@tanstack/react-router";
import { Scale, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import { AddWeightDialog } from "@/components/quick-add-dialogs";
import { Button } from "@/components/ui/button";
import { apiDelete, apiGet, formatApiError, getStoredUser } from "@/lib/api";
export const Route = createFileRoute("/weight")({
  head: () => ({ meta: [{ title: "Weight — Vitalis" }] }),
  component: WeightPage,
});
type W = { id: number; weight: string | number; date: string };
function WeightPage() {
  const [records, setRecords] = useState<W[]>([]);
  const load = async () => {
    try {
      const r = await apiGet<{ data: W[] }>("/weight");
      setRecords(r.data);
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const data = useMemo(() => records.map((r) => ({ d: r.date, w: Number(r.weight) })), [records]);
  const lastRecord = records.at(-1);
  const current = lastRecord
    ? Number(lastRecord.weight)
    : Number(getStoredUser()?.current_weight ?? 0);
  const goal = Number(getStoredUser()?.target_weight ?? 0);
  return (
    <AppShell
      title="Weight"
      subtitle="Trends matter more than any single weigh-in."
      actions={
        <AddWeightDialog
          onSaved={load}
          trigger={
            <Button size="sm" className="rounded-full">
              <Scale className="size-4" /> Log weight
            </Button>
          }
        />
      }
    >
      {" "}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">Current</p>
          <p className="mt-2 text-2xl font-bold">{current || "—"} kg</p>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">Goal</p>
          <p className="mt-2 text-2xl font-bold">{goal || "—"} kg</p>
        </div>
      </div>
      <SectionCard title="Weight trend" className="mt-5">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="d" />
              <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip />
              <Line type="monotone" dataKey="w" stroke="var(--primary)" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-4 grid gap-2">
          {records.map((r) => (
            <li key={r.id} className="flex items-center justify-between rounded-xl border p-3">
              <span>
                {r.date} · {r.weight} kg
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await apiDelete(`/weight/${r.id}`);
                  toast.success("Weight entry deleted");
                  void load();
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </SectionCard>
    </AppShell>
  );
}

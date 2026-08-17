import { createFileRoute } from "@tanstack/react-router";
import { Droplets, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import waterImg from "@/assets/water.jpg";
import { AppShell, SectionCard } from "@/components/app-shell";
import { AddWaterDialog } from "@/components/quick-add-dialogs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiDelete, apiGet, formatApiError } from "@/lib/api";
export const Route = createFileRoute("/water")({
  head: () => ({ meta: [{ title: "Water — Vitalis" }] }),
  component: WaterPage,
});
type Record = { id: number; amount: number; date: string };
function WaterPage() {
  const [data, setData] = useState<{
    total_glasses: number;
    water_target: number;
    records: Record[];
  } | null>(null);
  const load = async () => {
    try {
      setData(await apiGet("/water"));
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const glasses = data?.total_glasses ?? 0,
    target = data?.water_target ?? 8;
  return (
    <AppShell
      title="Water"
      subtitle="Hydration is the easiest win of the day."
      actions={
        <AddWaterDialog
          onSaved={load}
          trigger={
            <Button size="sm" className="rounded-full">
              <Droplets className="size-4" /> Add water
            </Button>
          }
        />
      }
    >
      {" "}
      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="Today" className="lg:col-span-2">
          <p className="font-display text-3xl font-bold">
            {glasses}
            <span className="text-base text-muted-foreground">/{target} glasses</span>
          </p>
          <Progress
            value={target ? Math.min(100, (glasses / target) * 100) : 0}
            className="mt-4 h-2"
          />
          <div className="mt-5 flex flex-wrap gap-2">
            {Array.from({ length: target }).map((_, i) => (
              <span
                key={i}
                className={`grid size-12 place-items-center rounded-xl border ${i < glasses ? "bg-water/15 text-water" : "text-muted-foreground/40"}`}
              >
                <Droplets className="size-5" />
              </span>
            ))}
          </div>
          <ul className="mt-6 grid gap-2">
            {data?.records.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-xl border p-3">
                <span>
                  {r.amount} glasses · {r.date}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    await apiDelete(`/water/${r.id}`);
                    toast.success("Water entry deleted");
                    void load();
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </SectionCard>
        <div className="surface-card overflow-hidden">
          <img src={waterImg} alt="Water" className="h-64 w-full object-cover" />
          <div className="p-5">
            <h2 className="font-bold">Daily target</h2>
            <p className="mt-1 text-2xl font-bold">{target} glasses</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

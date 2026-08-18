import { createFileRoute } from "@tanstack/react-router";
import { Dumbbell, Flame, Timer, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import exerciseImg from "@/assets/exercise.jpg";
import { AppShell, SectionCard } from "@/components/app-shell";
import { AddExerciseDialog } from "@/components/quick-add-dialogs";
import { Button } from "@/components/ui/button";
import { apiDelete, apiGet, formatApiError } from "@/lib/api";

export const Route = createFileRoute("/exercise")({
  head: () => ({ meta: [{ title: "Exercise — Vitalis" }] }),
  component: ExercisePage,
});
type Exercise = {
  id: number;
  type: string;
  duration: number;
  intensity: string;
  calories_burned: number;
  date: string;
};
function ExercisePage() {
  const [workouts, setWorkouts] = useState<Exercise[]>([]);
  const load = async () => {
    try {
      const r = await apiGet<{ data: Exercise[] }>("/exercises");
      setWorkouts(r.data);
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const summary = useMemo(
    () => [
      { label: "Sessions", value: String(workouts.length), icon: Dumbbell },
      {
        label: "Active minutes",
        value: String(workouts.reduce((a, w) => a + Number(w.duration), 0)),
        icon: Timer,
      },
      {
        label: "Calories burned",
        value: String(workouts.reduce((a, w) => a + Number(w.calories_burned), 0)),
        icon: Flame,
      },
    ],
    [workouts],
  );
  return (
    <AppShell
      title="Exercise"
      subtitle="Your training log and effort."
      actions={
        <AddExerciseDialog
          onSaved={load}
          trigger={
            <Button size="sm" className="rounded-full">
              <Dumbbell className="size-4" /> Add exercise
            </Button>
          }
        />
      }
    >
      <div className="grid gap-5 sm:grid-cols-3">
        {summary.map((s) => (
          <div key={s.label} className="surface-card p-5">
            <s.icon className="size-5 text-primary" />
            <p className="mt-4 font-display text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <SectionCard title="Recent workouts" className="lg:col-span-2">
          {workouts.length ? (
            <ul className="grid gap-3">
              {workouts.map((w) => (
                <li
                  key={w.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl border p-4"
                >
                  <div>
                    <p className="font-semibold capitalize">{w.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {w.date} · {w.duration} min · {w.intensity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-primary">{w.calories_burned} kcal</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      await apiDelete(`/exercises/${w.id}`);
                      toast.success("Exercise deleted");
                      void load();
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No workouts logged yet.</p>
          )}
        </SectionCard>
        <div className="surface-card overflow-hidden">
          <img src={exerciseImg} alt="Training" className="h-64 w-full object-cover" />
          <div className="p-5">
            <h2 className="font-bold">Consistency beats intensity</h2>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

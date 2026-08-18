import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AppShell, SectionCard } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { apiGet, apiPut, formatApiError, setStoredUser, type ApiUser } from "@/lib/api";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Goals — Vitalis" }] }),
  component: GoalsPage,
});

function GoalsPage() {
  const [user, setUser] = useState<ApiUser | null>(null);
  useEffect(() => {
    apiGet<ApiUser>("/user")
      .then(setUser)
      .catch((e) => toast.error(formatApiError(e)));
  }, []);
  if (!user)
    return (
      <AppShell title="Goals">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </AppShell>
    );

  const current = Number(user.current_weight ?? 0);
  const goal = Number(user.target_weight ?? 0);
  const weightProgress =
    current && goal
      ? Math.max(
          0,
          Math.min(100, goal <= current ? (goal / current) * 100 : (current / goal) * 100),
        )
      : 0;

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      const response = await apiPut<{ user: ApiUser }>("/users/me", {
        daily_calorie_target: Number(f.get("daily_calorie_target")),
        protein_target: Number(f.get("protein_target")),
        carbs_target: Number(f.get("carbs_target")),
        fat_target: Number(f.get("fat_target")),
        water_target: Number(f.get("water_target")),
        target_weight: Number(f.get("target_weight")),
      });
      setUser(response.user);
      setStoredUser(response.user);
      toast.success("Goals updated");
    } catch (error) {
      toast.error(formatApiError(error));
    }
  }

  return (
    <AppShell title="Goals" subtitle="Targets that keep the daily numbers meaningful.">
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Active goals">
          <ul className="grid gap-5">
            <li>
              <div className="flex justify-between">
                <p className="font-semibold">Reach {goal || "—"} kg</p>
                <span className="text-sm font-semibold text-primary">
                  {Math.round(weightProgress)}%
                </span>
              </div>
              <Progress value={weightProgress} className="mt-2.5 h-1.5" />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Current weight: {current || "—"} kg
              </p>
            </li>
            <li>
              <p className="font-semibold">Daily calories</p>
              <p className="text-sm text-muted-foreground">
                {user.daily_calorie_target ?? "—"} kcal
              </p>
            </li>
            <li>
              <p className="font-semibold">Hydration</p>
              <p className="text-sm text-muted-foreground">
                {user.water_target ?? "—"} glasses/day
              </p>
            </li>
          </ul>
        </SectionCard>
        <SectionCard title="Update your targets">
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={save}>
            {[
              ["daily_calorie_target", "Daily calories", user.daily_calorie_target],
              ["protein_target", "Protein (g)", user.protein_target],
              ["carbs_target", "Carbs (g)", user.carbs_target],
              ["fat_target", "Fat (g)", user.fat_target],
              ["water_target", "Water (glasses)", user.water_target],
              ["target_weight", "Goal weight (kg)", user.target_weight],
            ].map(([name, label, value]) => (
              <div key={String(name)} className="grid gap-2">
                <Label>{label}</Label>
                <Input
                  name={String(name)}
                  type="number"
                  step={name === "target_weight" ? "0.1" : "1"}
                  defaultValue={(value as any) ?? ""}
                />
              </div>
            ))}
            <Button type="submit" className="mt-2 h-11 rounded-xl sm:col-span-2">
              <Target className="size-4" /> Save goals
            </Button>
          </form>
        </SectionCard>
      </div>
    </AppShell>
  );
}

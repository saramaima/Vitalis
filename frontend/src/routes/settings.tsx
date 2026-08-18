import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AppShell, SectionCard } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiGet, apiPut, formatApiError, setStoredUser, type ApiUser } from "@/lib/api";
export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Vitalis" }] }),
  component: SettingsPage,
});
function SettingsPage() {
  const [u, setU] = useState<ApiUser | null>(null);
  const load = () =>
    apiGet<ApiUser>("/user")
      .then((x) => {
        setU(x);
        setStoredUser(x);
      })
      .catch((e) => toast.error(formatApiError(e)));
  useEffect(() => {
    void load();
  }, []);
  if (!u)
    return (
      <AppShell title="Settings">
        <p>Loading...</p>
      </AppShell>
    );
  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body: Object = {};
    for (const [k, v] of f.entries())
      if (v !== "")
        (body as any)[k] = [
          "age",
          "height",
          "target_weight",
          "daily_calorie_target",
          "water_target",
          "protein_target",
          "carbs_target",
          "fat_target",
        ].includes(k)
          ? Number(v)
          : v;
    try {
      const r = await apiPut<{ user: ApiUser }>("/users/me", body);
      setU(r.user);
      setStoredUser(r.user);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };
  return (
    <AppShell title="Settings" subtitle="Keep your profile and targets up to date.">
      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="targets">Targets</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-5">
          <SectionCard title="Profile">
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={save}>
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input name="name" defaultValue={u.name} />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input value={u.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Age</Label>
                <Input name="age" type="number" defaultValue={u.age ?? ""} />
              </div>
              <div className="grid gap-2">
                <Label>Height (cm)</Label>
                <Input name="height" type="number" defaultValue={u.height ?? ""} />
              </div>
              <Button className="sm:col-span-2">Save profile</Button>
            </form>
          </SectionCard>
        </TabsContent>
        <TabsContent value="goals" className="mt-5">
          <SectionCard title="Goals">
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={save}>
              <div className="grid gap-2">
                <Label>Fitness goal</Label>
                <Select name="fitness_goal" defaultValue={u.fitness_goal ?? "maintain_weight"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose weight</SelectItem>
                    <SelectItem value="maintain_weight">Maintain weight</SelectItem>
                    <SelectItem value="gain_muscle">Build muscle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Target weight</Label>
                <Input
                  name="target_weight"
                  type="number"
                  step="0.1"
                  defaultValue={u.target_weight ?? ""}
                />
              </div>
              <div className="grid gap-2">
                <Label>Activity level</Label>
                <Select name="activity_level" defaultValue={u.activity_level ?? "moderate"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="very_active">Very active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="sm:col-span-2">Save goals</Button>
            </form>
          </SectionCard>
        </TabsContent>
        <TabsContent value="targets" className="mt-5">
          <SectionCard title="Daily targets">
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={save}>
              {[
                ["daily_calorie_target", "Calories", u.daily_calorie_target],
                ["protein_target", "Protein (g)", u.protein_target],
                ["carbs_target", "Carbs (g)", u.carbs_target],
                ["fat_target", "Fat (g)", u.fat_target],
                ["water_target", "Water (glasses)", u.water_target],
              ].map(([n, l, v]) => (
                <div key={String(n)} className="grid gap-2">
                  <Label>{l}</Label>
                  <Input name={String(n)} type="number" defaultValue={(v as any) ?? ""} />
                </div>
              ))}
              <Button className="sm:col-span-2">Save targets</Button>
            </form>
          </SectionCard>
        </TabsContent>
        <TabsContent value="preferences" className="mt-5">
          <SectionCard title="Preferences">
            <div className="grid gap-4">
              {[
                ["water_reminder", "Water reminders", u.water_reminder],
                ["meal_reminder", "Meal reminders", u.meal_reminder],
                ["exercise_reminder", "Exercise reminders", u.exercise_reminder],
              ].map(([key, label, val]) => (
                <div
                  key={String(key)}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <span>{label}</span>
                  <Switch
                    checked={Boolean(val)}
                    onCheckedChange={async (checked) => {
                      try {
                        const r = await apiPut<{ user: ApiUser }>("/users/me", {
                          [String(key)]: checked,
                        });
                        setU(r.user);
                        toast.success("Preference updated");
                      } catch (e) {
                        toast.error(formatApiError(e));
                      }
                    }}
                  />
                </div>
              ))}
              <div className="grid gap-2">
                <Label>Theme</Label>
                <Select
                  value={u.theme ?? "light"}
                  onValueChange={async (theme) => {
                    try {
                      const r = await apiPut<{ user: ApiUser }>("/users/me", { theme });
                      setU(r.user);
                      document.documentElement.classList.toggle("dark", theme === "dark");
                    } catch (e) {
                      toast.error(formatApiError(e));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

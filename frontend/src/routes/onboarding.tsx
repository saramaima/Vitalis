import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import props from "@/assets/onboarding-props.jpg";
import { Logo } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  apiPost,
  apiPut,
  formatApiError,
  getStoredUser,
  setStoredUser,
  type ApiUser,
} from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Set up your plan — Vitalis" }] }),
  component: Onboarding,
});

const steps = ["About You", "Your Goal", "Targets"];

function Onboarding() {
  const navigate = useNavigate();
  const stored = getStoredUser();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState(stored?.age?.toString() ?? "22");
  const [gender, setGender] = useState<"female" | "male">(
    (stored?.gender as "female" | "male") ?? "female",
  );
  const [height, setHeight] = useState(stored?.height?.toString() ?? "165");
  const [weight, setWeight] = useState(stored?.current_weight?.toString() ?? "65.4");
  const [targetWeight, setTargetWeight] = useState(stored?.target_weight?.toString() ?? "58");
  const [activity, setActivity] = useState(stored?.activity_level ?? "moderate");
  const [goal, setGoal] = useState(stored?.fitness_goal ?? "lose_weight");
  const [proteinTarget, setProteinTarget] = useState(stored?.protein_target?.toString() ?? "120");
  const [carbsTarget, setCarbsTarget] = useState(stored?.carbs_target?.toString() ?? "220");
  const [fatTarget, setFatTarget] = useState(stored?.fat_target?.toString() ?? "65");
  const [waterTarget, setWaterTarget] = useState(stored?.water_target?.toString() ?? "8");

  async function finish() {
    setLoading(true);
    try {
      const response = await apiPost<{ user: ApiUser; daily_calorie_target: number }>(
        "/users/onboarding",
        {
          age: Number(age),
          gender,
          height: Number(height),
          current_weight: Number(weight),
          target_weight: Number(targetWeight),
          activity_level: activity,
          fitness_goal: goal,
        },
      );

      const targets = await apiPut<{ user: ApiUser }>("/users/me", {
        protein_target: Number(proteinTarget),
        carbs_target: Number(carbsTarget),
        fat_target: Number(fatTarget),
        water_target: Number(waterTarget),
      });

      setStoredUser(targets.user ?? response.user);
      toast.success("Your Vitalis plan is ready", {
        description: `Daily calorie target: ${response.daily_calorie_target} kcal`,
      });
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
      <div className="flex flex-col px-6 py-10 sm:px-14">
        <Logo />
        <ol className="mt-10 flex items-center gap-3">
          {steps.map((label, i) => (
            <li key={label} className="flex min-w-0 flex-1 items-center gap-3">
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full border text-sm font-semibold",
                  i < step && "border-primary bg-primary text-primary-foreground",
                  i === step && "border-primary bg-primary-soft text-accent-foreground",
                  i > step && "border-border bg-card text-muted-foreground",
                )}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "truncate text-sm font-medium",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {i < steps.length - 1 && <span className="hidden h-px flex-1 bg-border sm:block" />}
            </li>
          ))}
        </ol>

        <div className="mt-10 max-w-xl flex-1">
          {step === 0 && (
            <div className="grid gap-5">
              <h1 className="text-2xl font-bold sm:text-3xl">A little about you</h1>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="ob-age">Age</Label>
                  <Input
                    id="ob-age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Gender</Label>
                  <Select value={gender} onValueChange={(v) => setGender(v as "female" | "male")}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ob-height">Height (cm)</Label>
                  <Input
                    id="ob-height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ob-weight">Current weight (kg)</Label>
                  <Input
                    id="ob-weight"
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label>Activity level</Label>
                  <Select value={activity} onValueChange={setActivity}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Lightly active</SelectItem>
                      <SelectItem value="moderate">Moderately active</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="very_active">Very active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5">
              <h1 className="text-2xl font-bold sm:text-3xl">What are you working towards?</h1>
              <RadioGroup value={goal} onValueChange={setGoal} className="grid gap-3">
                {[
                  {
                    v: "lose_weight",
                    t: "Lose weight",
                    d: "A calorie deficit based on your activity.",
                  },
                  {
                    v: "maintain_weight",
                    t: "Maintain",
                    d: "Keep your energy intake close to maintenance.",
                  },
                  { v: "gain_muscle", t: "Build muscle", d: "A small calorie surplus for growth." },
                ].map((o) => (
                  <label
                    key={o.v}
                    className="surface-card flex cursor-pointer items-start gap-3 p-4 has-[:checked]:border-primary has-[:checked]:bg-primary-soft"
                  >
                    <RadioGroupItem value={o.v} className="mt-0.5" />
                    <span>
                      <span className="block text-sm font-semibold">{o.t}</span>
                      <span className="block text-sm text-muted-foreground">{o.d}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
              <div className="grid gap-2 sm:max-w-xs">
                <Label htmlFor="ob-target-weight">Target weight (kg)</Label>
                <Input
                  id="ob-target-weight"
                  type="number"
                  step="0.1"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5">
              <h1 className="text-2xl font-bold sm:text-3xl">Set your daily macro targets</h1>
              <p className="text-sm text-muted-foreground">
                Vitalis will calculate your calorie target automatically. You can customise the
                other targets here.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="t-protein">Protein (g)</Label>
                  <Input
                    id="t-protein"
                    type="number"
                    value={proteinTarget}
                    onChange={(e) => setProteinTarget(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="t-carbs">Carbs (g)</Label>
                  <Input
                    id="t-carbs"
                    type="number"
                    value={carbsTarget}
                    onChange={(e) => setCarbsTarget(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="t-fat">Fat (g)</Label>
                  <Input
                    id="t-fat"
                    type="number"
                    value={fatTarget}
                    onChange={(e) => setFatTarget(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="t-water">Water (glasses)</Label>
                  <Input
                    id="t-water"
                    type="number"
                    value={waterTarget}
                    onChange={(e) => setWaterTarget(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            className="rounded-xl"
            disabled={step === 0 || loading}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
          <Button
            className="h-11 rounded-xl px-6"
            disabled={loading}
            onClick={() => (step === steps.length - 1 ? finish() : setStep((s) => s + 1))}
          >
            {loading ? "Saving..." : step === steps.length - 1 ? "Finish setup" : "Continue"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img
          src={props}
          alt="Fitness and nutrition props"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </div>
  );
}

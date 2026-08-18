import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import exerciseImg from "@/assets/exercise.jpg";
import waterImg from "@/assets/water.jpg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiPost, formatApiError } from "@/lib/api";

function SplitDialog({
  trigger,
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  children,
  onSave,
  open,
  onOpenChange,
  loading,
}: {
  trigger?: ReactNode;
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  onSave: () => Promise<void>;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-w-3xl overflow-hidden rounded-2xl p-0 sm:max-w-3xl">
        <div className="grid md:grid-cols-2">
          <div className="relative hidden md:block">
            <img src={image} alt={imageAlt} className="absolute inset-0 size-full object-cover" />
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            <div className="mt-6 grid gap-4">{children}</div>
            <Button
              className="mt-7 h-11 w-full rounded-xl text-base"
              disabled={loading}
              onClick={async () => {
                await onSave();
              }}
            >
              {loading ? "Saving..." : "Save entry"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const today = new Date().toISOString().slice(0, 10);

export function AddExerciseDialog({
  trigger,
  onSaved,
}: {
  trigger: ReactNode;
  onSaved?: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState("running");
  const [duration, setDuration] = useState("30");
  const [intensity, setIntensity] = useState("moderate");
  const [calories, setCalories] = useState("250");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  return (
    <SplitDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      image={exerciseImg}
      imageAlt="Person training"
      eyebrow="Quick add"
      title="Log exercise"
      description="Add a workout to your Vitalis activity history."
      loading={loading}
      onSave={async () => {
        setLoading(true);
        try {
          await apiPost("/exercises", {
            type: activity,
            duration: Number(duration),
            intensity,
            calories_burned: Number(calories),
            date,
          });
          toast.success("Workout logged");
          setOpen(false);
          await onSaved?.();
        } catch (e) {
          toast.error(formatApiError(e));
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="grid gap-2">
        <Label>Activity</Label>
        <Select value={activity} onValueChange={setActivity}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="strength">Strength training</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="cycling">Cycling</SelectItem>
            <SelectItem value="yoga">Yoga</SelectItem>
            <SelectItem value="swimming">Swimming</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Intensity</Label>
        <Select value={intensity} onValueChange={setIntensity}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="ex-duration">Duration (min)</Label>
          <Input
            id="ex-duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ex-calories">Calories burned</Label>
          <Input
            id="ex-calories"
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ex-date">Date</Label>
        <Input
          id="ex-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>
    </SplitDialog>
  );
}

export function AddWaterDialog({
  trigger,
  onSaved,
}: {
  trigger: ReactNode;
  onSaved?: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("1");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);
  return (
    <SplitDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      image={waterImg}
      imageAlt="Glass of water"
      eyebrow="Quick add"
      title="Log water"
      description="Add glasses to today's hydration total."
      loading={loading}
      onSave={async () => {
        setLoading(true);
        try {
          await apiPost("/water", { amount: Number(amount), date });
          toast.success("Water logged");
          setOpen(false);
          await onSaved?.();
        } catch (e) {
          toast.error(formatApiError(e));
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="w-glasses">Glasses</Label>
        <Input
          id="w-glasses"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="w-date">Date</Label>
        <Input
          id="w-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>
    </SplitDialog>
  );
}

export function AddWeightDialog({
  trigger,
  onSaved,
}: {
  trigger: ReactNode;
  onSaved?: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("65.4");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);
  return (
    <SplitDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      image={exerciseImg}
      imageAlt="Bright gym interior"
      eyebrow="Quick add"
      title="Log weight"
      description="Record a weigh-in and update your trend."
      loading={loading}
      onSave={async () => {
        setLoading(true);
        try {
          await apiPost("/weight", { weight: Number(weight), date });
          toast.success("Weight logged");
          setOpen(false);
          await onSaved?.();
        } catch (e) {
          toast.error(formatApiError(e));
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="wt-value">Weight (kg)</Label>
        <Input
          id="wt-value"
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="wt-date">Date</Label>
        <Input
          id="wt-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>
    </SplitDialog>
  );
}

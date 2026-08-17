import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell, SectionCard } from "@/components/app-shell";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiDelete, apiGet, apiPost, formatApiError } from "@/lib/api";

export const Route = createFileRoute("/meals")({
  head: () => ({ meta: [{ title: "Meals — Vitalis" }] }),
  component: MealsPage,
});

type Food = {
  id: number;
  name: string;
  serving_size: string;
  calories: number;
  protein: number | string;
  carbs: number | string;
  fat: number | string;
};
type MealFood = Food & { pivot: { quantity: number | string } };
type Meal = {
  id: number;
  meal_type: string;
  date: string;
  total_calories: number;
  total_protein: number | string;
  total_carbs: number | string;
  total_fat: number | string;
  foods: MealFood[];
};
const mealTypes = ["breakfast", "lunch", "dinner", "snacks"] as const;
const today = new Date().toISOString().slice(0, 10);

function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [open, setOpen] = useState(false);
  const [mealType, setMealType] = useState("breakfast");
  const [foodId, setFoodId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [date, setDate] = useState(today);
  const [newFood, setNewFood] = useState({
    name: "",
    serving_size: "1 serving",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  const load = async () => {
    try {
      const [m, f] = await Promise.all([
        apiGet<{ data: Meal[] }>(`/meals?date=${today}`),
        apiGet<{ data: Food[] }>("/foods"),
      ]);
      setMeals(m.data);
      setFoods(f.data);
      if (!foodId && f.data[0]) setFoodId(String(f.data[0].id));
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const sections = useMemo(
    () =>
      mealTypes.map(
        (type) =>
          meals.find((m) => m.meal_type === type) ?? {
            id: 0,
            meal_type: type,
            date: today,
            total_calories: 0,
            total_protein: 0,
            total_carbs: 0,
            total_fat: 0,
            foods: [],
          },
      ),
    [meals],
  );
  async function add() {
    try {
      if (!foodId) {
        toast.error("Create or select a food first");
        return;
      }
      await apiPost(`/meals/${mealType}/foods`, {
        food_id: Number(foodId),
        quantity: Number(quantity),
        date,
      });
      toast.success("Food added to meal");
      setOpen(false);
      await load();
    } catch (e) {
      toast.error(formatApiError(e));
    }
  }
  async function createFood() {
    try {
      const r = await apiPost<{ data: Food }>("/foods", {
        name: newFood.name,
        serving_size: newFood.serving_size,
        calories: Number(newFood.calories),
        protein: Number(newFood.protein),
        carbs: Number(newFood.carbs),
        fat: Number(newFood.fat),
      });
      toast.success("Food created");
      setFoods((x) => [...x, r.data]);
      setFoodId(String(r.data.id));
      setNewFood({
        name: "",
        serving_size: "1 serving",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      });
    } catch (e) {
      toast.error(formatApiError(e));
    }
  }
  return (
    <AppShell
      title="Meals"
      subtitle="Every food you log, grouped by meal."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full">
              <Plus className="size-4" /> Add food
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <h2 className="text-xl font-bold">Add food to a meal</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Meal</Label>
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypes.map((m) => (
                      <SelectItem key={m} value={m} className="capitalize">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Food</Label>
                <Select value={foodId} onValueChange={setFoodId} disabled={foods.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder={foods.length ? "Choose food" : "No foods available yet"} />
                  </SelectTrigger>
                  <SelectContent>
                    {foods.map((f) => (
                      <SelectItem key={f.id} value={String(f.id)}>
                        {f.name} · {f.calories} kcal
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {foods.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No foods are saved yet. Create a manual food below; it will be selected automatically.
                  </p>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>
              <Button onClick={add}>Add to meal</Button>
              <div className="border-t pt-4">
                <p className="mb-3 text-sm font-semibold">Or create a manual food</p>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Food name"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  />
                  <Input
                    placeholder="Serving size"
                    value={newFood.serving_size}
                    onChange={(e) => setNewFood({ ...newFood, serving_size: e.target.value })}
                  />
                  <Input
                    placeholder="Calories"
                    type="number"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                  />
                  <Input
                    placeholder="Protein"
                    type="number"
                    value={newFood.protein}
                    onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                  />
                  <Input
                    placeholder="Carbs"
                    type="number"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                  />
                  <Input
                    placeholder="Fat"
                    type="number"
                    value={newFood.fat}
                    onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                  />
                </div>
                <Button variant="outline" className="mt-3" onClick={createFood}>
                  Create food
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <Tabs defaultValue="breakfast">
        <TabsList className="flex-wrap">
          {mealTypes.map((s) => (
            <TabsTrigger key={s} value={s} className="capitalize">
              {s}
            </TabsTrigger>
          ))}
        </TabsList>
        {sections.map((section) => (
          <TabsContent key={section.meal_type} value={section.meal_type} className="mt-5">
            <SectionCard
              title={section.meal_type.charAt(0).toUpperCase() + section.meal_type.slice(1)}
            >
              {section.foods.length ? (
                <ul className="grid gap-3">
                  {section.foods.map((item) => {
                    const q = Number(item.pivot.quantity);
                    return (
                      <li
                        key={item.id}
                        className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 rounded-xl border p-3"
                      >
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {q} × {item.serving_size} · P {Number(item.protein) * q}g · C{" "}
                            {Number(item.carbs) * q}g · F {Number(item.fat) * q}g
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {Math.round(item.calories * q)} kcal
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={async () => {
                            await apiDelete(`/meals/${section.id}/foods/${item.id}`);
                            toast.success("Food removed");
                            void load();
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No food logged for this meal.</p>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/50 p-4 text-sm sm:grid-cols-4">
                <p>
                  Calories
                  <br />
                  <b>{section.total_calories} kcal</b>
                </p>
                <p>
                  Protein
                  <br />
                  <b>{section.total_protein} g</b>
                </p>
                <p>
                  Carbs
                  <br />
                  <b>{section.total_carbs} g</b>
                </p>
                <p>
                  Fat
                  <br />
                  <b>{section.total_fat} g</b>
                </p>
              </div>
            </SectionCard>
          </TabsContent>
        ))}
      </Tabs>
    </AppShell>
  );
}

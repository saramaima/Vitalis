import oatmeal from "@/assets/food-oatmeal.jpg";
import salad from "@/assets/food-salad.jpg";
import salmon from "@/assets/food-salmon.jpg";
import smoothie from "@/assets/food-smoothie.jpg";

export const user = { name: "Reem", initials: "RH", plan: "Premium" };

export const macroStats = [
  { label: "Calories", value: 1450, target: 2000, unit: "kcal", token: "primary" },
  { label: "Protein", value: 92, target: 130, unit: "g", token: "protein" },
  { label: "Carbs", value: 168, target: 220, unit: "g", token: "carbs" },
  { label: "Fat", value: 48, target: 70, unit: "g", token: "fat" },
] as const;

export const foodImages = { oatmeal, salad, salmon, smoothie };

export type FoodItem = {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  time: string;
};

export const mealSections: { id: string; label: string; items: FoodItem[] }[] = [
  {
    id: "breakfast",
    label: "Breakfast",
    items: [
      {
        name: "Oatmeal with berries",
        serving: "1 bowl · 240 g",
        calories: 320,
        protein: 12,
        carbs: 54,
        fat: 6,
        image: oatmeal,
        time: "07:40",
      },
      {
        name: "Greek yogurt",
        serving: "150 g",
        calories: 130,
        protein: 15,
        carbs: 8,
        fat: 4,
        image: smoothie,
        time: "08:05",
      },
    ],
  },
  {
    id: "lunch",
    label: "Lunch",
    items: [
      {
        name: "Grilled chicken quinoa bowl",
        serving: "1 bowl · 380 g",
        calories: 520,
        protein: 42,
        carbs: 48,
        fat: 16,
        image: salad,
        time: "13:10",
      },
    ],
  },
  {
    id: "dinner",
    label: "Dinner",
    items: [
      {
        name: "Baked salmon & vegetables",
        serving: "1 plate · 320 g",
        calories: 480,
        protein: 38,
        carbs: 30,
        fat: 22,
        image: salmon,
        time: "19:30",
      },
    ],
  },
  {
    id: "snacks",
    label: "Snacks",
    items: [
      {
        name: "Green smoothie",
        serving: "1 glass · 300 ml",
        calories: 180,
        protein: 5,
        carbs: 28,
        fat: 4,
        image: smoothie,
        time: "16:20",
      },
    ],
  },
];

export const todaysMeals = mealSections.flatMap((section) =>
  section.items.map((item) => ({ ...item, meal: section.label })),
);

export const nutritionBreakdown = [
  { name: "Protein", value: 92, color: "var(--protein)" },
  { name: "Carbs", value: 168, color: "var(--carbs)" },
  { name: "Fat", value: 48, color: "var(--fat)" },
  { name: "Others", value: 24, color: "var(--muted-foreground)" },
];

export const weightSeries = {
  "7": [
    { d: "Mon", w: 71.8 },
    { d: "Tue", w: 71.6 },
    { d: "Wed", w: 71.5 },
    { d: "Thu", w: 71.3 },
    { d: "Fri", w: 71.1 },
    { d: "Sat", w: 70.9 },
    { d: "Sun", w: 70.6 },
  ],
  "30": [
    { d: "W1", w: 73.4 },
    { d: "W2", w: 72.8 },
    { d: "W3", w: 72.0 },
    { d: "W4", w: 71.2 },
    { d: "Now", w: 70.6 },
  ],
  "90": [
    { d: "Mar", w: 76.2 },
    { d: "Apr", w: 74.5 },
    { d: "May", w: 73.1 },
    { d: "Jun", w: 71.8 },
    { d: "Now", w: 70.6 },
  ],
} as const;

export const progressSummary = [
  { label: "Average Calories", value: "1,842", note: "kcal / day" },
  { label: "Total Workouts", value: "18", note: "sessions logged" },
  { label: "Water Average", value: "6.4", note: "glasses / day" },
];

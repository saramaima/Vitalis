export const API_BASE_URL =
  (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://127.0.0.1:8000/api";

const TOKEN_KEY = "vitalis_token";
const USER_KEY = "vitalis_user";

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  age?: number | null;
  gender?: "male" | "female" | null;
  height?: number | string | null;
  current_weight?: number | string | null;
  target_weight?: number | string | null;
  activity_level?: string | null;
  fitness_goal?: string | null;
  daily_calorie_target?: number | null;
  water_target?: number | null;
  protein_target?: number | null;
  carbs_target?: number | null;
  fat_target?: number | null;
  water_reminder?: boolean | number;
  meal_reminder?: boolean | number;
  exercise_reminder?: boolean | number;
  theme?: "light" | "dark";
  onboarding_completed?: boolean | number;
};

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]> | undefined;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}

export function setStoredUser(user: ApiUser) {
  if (typeof window !== "undefined") localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): ApiUser | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(USER_KEY);
    return value ? (JSON.parse(value) as ApiUser) : null;
  } catch {
    return null;
  }
}

export function clearStoredUser() {
  if (typeof window !== "undefined") localStorage.removeItem(USER_KEY);
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(
      "Could not reach the Laravel API. Make sure php artisan serve and MySQL are running.",
      0,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
      clearStoredUser();
    }
    throw new ApiError(data.message || "Request failed", response.status, data.errors);
  }

  return data as T;
}

export const apiGet = <T>(path: string) => api<T>(path);
export const apiPost = <T>(path: string, body?: unknown) =>
  api<T>(
    path,
    body === undefined ? { method: "POST" } : { method: "POST", body: JSON.stringify(body) },
  );
export const apiPut = <T>(path: string, body?: unknown) =>
  api<T>(
    path,
    body === undefined ? { method: "PUT" } : { method: "PUT", body: JSON.stringify(body) },
  );
export const apiDelete = <T>(path: string) => api<T>(path, { method: "DELETE" });

export function formatApiError(error: unknown) {
  if (error instanceof ApiError) {
    const firstValidation = error.errors ? Object.values(error.errors).flat()[0] : undefined;
    return firstValidation ?? error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong";
}

import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import heroBowl from "@/assets/hero-bowl.jpg";
import { Logo } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost, formatApiError, setStoredUser, setToken, type ApiUser } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Vitalis" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-14">
        <Logo />
        <div className="mt-12 max-w-md">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Welcome back</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Log in to continue tracking your nutrition, exercise, water and weight.
          </p>
          <form
            className="mt-9 grid gap-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                const response = await apiPost<{
                  message: string;
                  user: ApiUser;
                  token: string;
                }>("/auth/login", { email, password });
                setToken(response.token);
                setStoredUser(response.user);
                toast.success("Login successful");
                navigate({
                  to: response.user.onboarding_completed ? "/dashboard" : "/onboarding",
                });
              } catch (error) {
                toast.error(formatApiError(error));
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Checkbox defaultChecked /> Keep me signed in
            </label>
            <Button type="submit" disabled={loading} className="h-11 rounded-xl text-base">
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img
          src={heroBowl}
          alt="Nutritious grain bowl"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/25" />
      </div>
    </div>
  );
}

import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import lifestyle from "@/assets/lifestyle-run.jpg";
import { Logo } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost, formatApiError, setStoredUser, setToken, type ApiUser } from "@/lib/api";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create your Vitalis account" }] }),
  component: SignupPage,
});

const perks = [
  "Personalised calorie and macro targets",
  "Meal, workout and hydration logging",
  "Weekly progress insights",
];

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-14">
        <Logo />
        <div className="mt-12 max-w-md">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Create your account</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Start building your personalised Vitalis plan.
          </p>
          <form
            className="mt-9 grid gap-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                const response = await apiPost<{ user: ApiUser; token: string }>("/auth/register", {
                  name,
                  email,
                  password,
                  password_confirmation: confirmation,
                });
                setToken(response.token);
                setStoredUser(response.user);
                toast.success("Account created");
                navigate({ to: "/onboarding" });
              } catch (error) {
                toast.error(formatApiError(error));
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="su-email">Email</Label>
              <Input
                id="su-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="su-password">Password</Label>
              <Input
                id="su-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                At least 8 characters with a letter, number and symbol.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="su-confirm">Confirm password</Label>
              <Input
                id="su-confirm"
                type="password"
                required
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <Button type="submit" disabled={loading} className="h-11 rounded-xl text-base">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <ul className="mt-8 grid gap-2.5 text-sm text-muted-foreground">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2.5">
                <Check className="size-4 shrink-0 text-primary" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Already a member?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img
          src={lifestyle}
          alt="Runner at sunrise"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/25" />
      </div>
    </div>
  );
}

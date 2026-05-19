"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm({ mode }: { mode: "signIn" | "signUp" }) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    data.set("flow", mode);
    try {
      await signIn("password", data);
      router.replace("/");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Check your email and password.";
      setError(message.includes("Invalid") ? "Invalid email or password." : message);
      setLoading(false);
    }
  }

  const isSignUp = mode === "signUp";

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight">
          {isSignUp ? "Create account" : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSignUp
            ? "Start tracking your trades in seconds."
            : "Sign in to your trade journal."}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
            minLength={8}
            placeholder={isSignUp ? "At least 8 characters" : "Your password"}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-loss" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} size="lg" className="font-semibold">
        {loading ? "..." : isSignUp ? "Create account" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            No account?{" "}
            <Link href="/auth/signup" className="text-primary underline-offset-4 hover:underline">
              Create one
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { ShowPassword } from "./ShowPassword";

function SignInForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [isNavigating, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message ?? "Incorrect login credentials.");
        setPending(false);
        return;
      }
      setPending(false);
      startTransition(() => {
        router.push("/dashboard");
        router.refresh();
      });
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="px-1 py-1 border focus:outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>
        <ShowPassword
          id="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={pending || isNavigating}>
        {pending || isNavigating ? "Getting you in..." : "Log In"}
      </Button>

      <div className="text-muted-foreground flex justify-around text-sm underline">
        <Link href="/sign-up">Create an account</Link>
        <Link href="/forgot-password">Forgot password?</Link>
      </div>
    </form>
  );
}

export default SignInForm;

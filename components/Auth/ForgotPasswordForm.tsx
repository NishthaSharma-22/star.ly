"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    try {
      const error = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      const status = (error as unknown as {status?: number} | null)?.status;

      if (status === 429) {
        setErrorMessage("Too many requests. Please wait a bit and try again.");
      } else {
        setSent(true);
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    }
    setPending(false);
  }

  if (sent) {
    return (
      <div>
        <p role="status">
          if an account exists for that email, we have sent a link to reset the
          password. It may take a minute to arrive.
        </p>
        <Link href="/sign-in">Back to log in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-2">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          className="px-1 py-1 border focus:outline-none"
          required
        />
      </div>
      {errorMessage && <p role="alert"> {errorMessage}</p>}

      <Button type="submit" disabled={pending} className="items-center w-">
        {pending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}

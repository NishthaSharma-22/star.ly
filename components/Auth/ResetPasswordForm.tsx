import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { ShowPassword } from "./ShowPassword";
import { authClient } from "@/lib/auth-client";

export function ResetPassWordForm({ token }: { token: string }) {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password !== confirm) {
      setErrorMessage("The two passwords do not match");
      return;
    }
    setPending(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (error) {
        setErrorMessage(
          error.message ??
            "This link is invalid or has expired. Please request a new one.",
        );
      } else {
        setDone(true);
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    }
    setPending(false);
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <p role="status">Your password has been updated.</p>
        <Link href="/sign-in" className="text-sm underline">
          Log in with your new password
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="password">New password</label>
        <ShowPassword
          id="confirm"
          name="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="confirm">Confirm new password</label>
        <ShowPassword
          id="confirm"
          name="confirm"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Set new password"}
      </Button>
    </form>
  );
}

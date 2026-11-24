"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@base-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShowPassword } from "../Auth/ShowPassword";

export function DeleteAccountForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmation = String(formData.get("confirmation") ?? "").trim();

    if (confirmation !== "DELETE") {
      setErrorMessage("Type DELETE in uppercase to confirm.");
      return;
    }

    setPending(true);
    try {
      const { error } = await authClient.deleteUser({ password });
      if (error) {
        setErrorMessage(
          error.message ??
            "Could not delete your account. Check your account and try again",
        );
        setPending(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Delete my account
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p>
        This permanently deletes your account and all of your practice history.
        Account deletion happens instantly and cannot be undone.
      </p>

      <div className="flex flex-col gap-2">
        <label htmlFor="password">Your password</label>
        <ShowPassword
          id="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmation">Type DELETE to confirm</label>
        <input
          id="confirmation"
          name="completion"
          autoComplete="off"
          className="px-1 py-1 border focus:outline-none"
          required
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Deleting..." : "Permanently delete my account"}
        </Button>
        <Button
          type="button"
          disabled={pending}
          onClick={() => {
            setOpen(false);
            setErrorMessage(null);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

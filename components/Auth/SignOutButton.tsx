"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      const { error } = await authClient.signOut();
      if (error) return;
      router.push("/");
      router.refresh();
    });
  }

  return (
    <Button type="button" onClick={handleSignOut} disabled={isPending}>
      {isPending ? "Logging out..." : "Log out"}
    </Button>
  );
}

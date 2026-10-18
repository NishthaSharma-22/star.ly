"use client"

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }
  return(
    <Button type="button" onClick={handleSignOut} disabled={pending}>
        {pending? "Logging Out": "Log out"}
    </Button>
  )
}
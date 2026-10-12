"use client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("error!", error);
  }, [error]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1>
        We hit an unexpected asteroid. You can try again. If it keeps happening,
        please let us know.
      </h1>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}

export default Error;

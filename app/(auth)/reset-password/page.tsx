import { ResetPassWordForm } from "@/components/Auth/ResetPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Choiose a new password | star.ly",
};

type PageProps = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

async function ResetContent({ searchParams }: PageProps) {
  const { token, error } = await searchParams;
  if (!token || error) {
    return (
      <div className="flex flex-col gap-4">
        <p role="alert">This reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="text-sm underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return <ResetPassWordForm token={token} />;
}

export default function ResetPasswordPage({ searchParams }: PageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Choose a new password</CardTitle>
          <CardDescription>
            Pick a password you have not used on other sites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p>Loading...</p>}>
            <ResetContent searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

import { ForgotPasswordForm } from "@/components/Auth/ForgotPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { canSendEmail } from "@/lib/email";
import { CONTACT_EMAIL } from "@/lib/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset your password | star.ly",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            {canSendEmail
              ? "Enter your email and we will send you a link to choose a new one."
              : "Password reset by email is not available yet."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {canSendEmail ? (
            <ForgotPasswordForm />
          ) : (
            <p>
              Please email <a href={`mailto:${CONTACT_EMAIL}`}></a> and we will
              help you get back into your account
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

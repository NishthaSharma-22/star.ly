import { env } from "./env";

type Email = { to: string; subject: string; text: string };

export async function sendEmail({ to, subject, text }: Email): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  const from = env.EMAIL_FROM;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      console.error("Email not sent - no email provider configured");
      return;
    }
    console.log(
      `email - development only - not sent to: ${to} and subject: ${subject} text: ${text}`,
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });

  if (!response.ok) {
    console.log(response.status);
  }
}

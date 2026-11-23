import Footer from "@/components/LandingPageUI/Footer";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const OPERATOR = "Nishtha Sharma";
const CONTACT_EMAIL = "nishthans22@gmail.com";
const LAST_UPDATED = "November 22, 2026";
const DELETION_DAYS = 7;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 flex flex-col gap-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-2xl p-6">
        <h1 className="text-2xl">Privacy Policy</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Last Updated: {LAST_UPDATED}
        </p>
        <p className="mt-6">
          star.ly is an SAT math practice site run by {OPERATOR}. This
          page explains what information we collect, why we collect it and what
          choices you have.
        </p>

        <Section title="What we collect">
          <ul className="list-disc pl-6">
            <li>
              <strong>Account details:</strong> your first name, your email
              address, and a password. We never store your password itself, only
              a scrambled version that cannot be turned back into the original.
            </li>
            <li>
              <strong>Practice activity:</strong> each answer you submit, which
              problem it was for, whether it was right or wrong, and the date
              you submitted it in your own time zone.
            </li>
            <li>
              <strong>Sign-in details:</strong> a session record that keeps you
              logged in. It includes when the session started and when it ends,
              and it may include your browser details and your IP address.
            </li>
          </ul>
          <p>
            We do not ask for your phone number, home address, school or payment
            details.
          </p>
        </Section>
        <Section title="How we use it">
          We use this information to run star.ly to log you in, check your
          answers, show your progress, and fix problems with the site. We do not
          sell your information, and we do not use it for advertising.
        </Section>

        <Section title="Who handles it">
          <p>
            Your information is stored with companies that help us run the site.
            Our database is hosted by Neon, and the site is hosted by Vercel.
            They handle data only to provide those services to us. We do not
            share your information with advertisers.
          </p>
        </Section>
        <Section title="Cookies and tracking">
          <p>
            Star.ly uses one cookie, which keeps you signed in. We do not
            currently use analytics tools. If that changes, we will update the
            page first.
          </p>
        </Section>
        <Section title="Age">
          <p>
            star.ly is for students 13 and older. If you are under 13, please do
            not create an account. If we learn that we have collected the
            information from a child under 13 without a parent&apos;s
            permission, we will delete it. Parents and guardians can contact us
            at any time using the email {CONTACT_EMAIL}
          </p>
        </Section>
        <Section title="Keeping and deleting your information">
          <p>
            We keep your account and practice history active while your accuont
            is open. You can ask us to delete your account at any time by
            emailing {CONTACT_EMAIL}. We will delete your account and your
            practice history within {DELETION_DAYS} adys.
          </p>
        </Section>
        <Section title="Changes to this page">
          <p>
            If we change how we handle your information, we will update this
            page and the date at the top.
          </p>
        </Section>
        <Section title="Contact">
          <p>
            For questions or a request to delete the account, please email{" "}
            {CONTACT_EMAIL}.
          </p>
        </Section>
      </main>
      <Footer />
    </>
  );
}

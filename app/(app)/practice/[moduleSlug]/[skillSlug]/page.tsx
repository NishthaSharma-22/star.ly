import { ProblemForm } from "@/components/Practice/ProblemForm";
import { requireSession } from "@/lib/auth-utils";
import { DIFFICULTY_LABELS } from "@/lib/difficulty";
import { getRandomProblem, getSkill } from "@/lib/practice";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ moduleSlug: string; skillSlug: string }>;
};

async function PracticeContent({ params }: PageProps) {
  await requireSession();

  const { moduleSlug, skillSlug } = await params;
  const skill = await getSkill(moduleSlug, skillSlug);
  if (!skill) notFound();

  const problem = await getRandomProblem(skill.skillId);

  return (
    <>
      <div>
        <p className="text-sm">{skill.moduleName}</p>
        <h1 className="text-xl">{skill.skillName}</h1>
      </div>
      {problem ? (
        <>
          <span className="bg-yellow-200 text-sm">
            {DIFFICULTY_LABELS[problem.difficulty]}
          </span>
          <ProblemForm key={problem.id} problem={problem} />
        </>
      ) : (
        <p>No problems for this skill yet. Check back soon.</p>
      )}
    </>
  );
}

export default function PracticePage({ params }: PageProps) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
      <Suspense fallback={<p>Loading...</p>}>
        <PracticeContent params={params} />
      </Suspense>
    </main>
  );
}

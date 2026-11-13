import { SkillCard } from "@/components/Practice/SkillCard";
import { requireSession } from "@/lib/auth-utils";
import { getModuleOverview } from "@/lib/practice";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ moduleSlug: string }>;
};

async function ModuleContent({ params }: PageProps) {
  const { user } = await requireSession();
  const { moduleSlug } = await params;
  const overview = await getModuleOverview(moduleSlug, user.id);
  if (!overview) notFound();

  return (
    <>
      <div>
        <h1>{overview.name}</h1>
        <p>{overview.description}</p>
      </div>

      {overview.skills.length > 0 ? (
        <div>
          {overview.skills.map((skill) => (
            <SkillCard
              key={skill.slug}
              href={`/practice/${moduleSlug}/${skill.slug}`}
              name={skill.name}
              solved={skill.solved}
              total={skill.total}
            />
          ))}
        </div>
      ) : (
        <p>No problems in this module yet! Check back soon</p>
      )}
    </>
  );
}

export default function ModulePage({params}: PageProps){
    return(
        <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
            <Suspense fallback={<p>Loading...</p>}>
                <ModuleContent params={params} />
            </Suspense>
        </main>
    )
}
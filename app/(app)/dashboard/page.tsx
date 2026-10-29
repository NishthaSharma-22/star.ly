import { ModuleCard } from "@/components/Dashboard/ModuleCard";
import { StatCard } from "@/components/Dashboard/StatCard";
import { UpNextCard } from "@/components/Dashboard/UpNextCard";
import { requireSession } from "@/lib/auth-utils";
import { SAT_MODULES } from "@/lib/course-content";
import { Suspense } from "react";

const MOCK_STATS = { streak: 3, solved: 47 };
const MOCK_UP_NEXT = {
  topic: "Linear Equations in one variable",
  moduleName: "Algebra",
  href: "/practice/algebra/linear-equations-one-variable",
};

async function DashboardContent() {
  const { user } = await requireSession();

  return (
    <>
      <h1 className="text-2xl font-semibold mt-5">
        Hi, {user.name.toUpperCase()}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Day Streak" value={MOCK_STATS.streak} />
        <StatCard label="Problems Solved" value={MOCK_STATS.solved} />
        <div className="col-span-2 am:col-span-1">
          <UpNextCard {...MOCK_UP_NEXT} />
        </div>
      </div>
      <hr />

      <section aria-labelledby="course-heading" className="flex flex-col gap-4">
        <h2 id="course-heading" className="text-xl font-semibold mt-5">
          SAT Math
        </h2>
        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
          {SAT_MODULES.map((module) => (
            <ModuleCard key={module.slug} module={module} />
          ))}
        </div>
      </section>
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="px-4 mx-auto w-full max-w-5xl">
      <Suspense fallback={<p className="text-center">Loading...</p>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}

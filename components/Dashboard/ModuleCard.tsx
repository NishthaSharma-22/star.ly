import { CourseModule } from "@/lib/course-content";
import Link from "next/link";

export function ModuleCard({ module }: { module: CourseModule }) {
  return (
    <Link
      href={`/practice/${module.slug}`}
      className="flex w-full max-w-xl mx-auto flex-col gap-3 border p-4 transition hover:bg-muted"
    >
      <div className="flex gap-1 items-center">
        <h3 className="font-semibold">{module.name}</h3>
        <span className="text-sm text-muted-foreground">{module.progress}%</span>
        {/* <p className="text-sm text-muted-foreground">{module.description}</p> */}
      </div>
      <div
        role="progressbar"
        aria-valuenow={module.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${module.name} progress`}
        className="h-2 bg-muted rounded"
      >
        <div
          className="h-2 rounded bg-primary"
          style={{ width: `${module.progress}%` }}
        />{" "}
      </div>
    </Link>
  );
}

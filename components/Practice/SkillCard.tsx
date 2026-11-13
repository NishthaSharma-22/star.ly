import Link from "next/link";

type SkillCardProps = {
  href: string;
  name: string;
  solved: number;
  total: number;
};

export function SkillCard({ href, name, solved, total }: SkillCardProps) {
  const percent = total === 0 ? 0 : Math.round((solved / total) * 100);

  return (
    <Link href={href} className="">
      <div>
        <h3>{name}</h3>
        <span>
          {solved} of {total} solved
        </span>
      </div>
      <div>
        <div
          className="h-2 rounded bg-primary"
          style={{ width: `${percent}%` }}
        />
      </div>
    </Link>
  );
}

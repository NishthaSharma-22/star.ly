import Link from "next/link";

export function UpNextCard({
  topic,
  moduleName,
  href,
}: {
  topic: string;
  moduleName: string;
  href: string;
}) {
  return (
    <div className="bg-blue-300 p-3 h-full w-full">
      <Link href={href}>
        <p className="text-sm">Up Next - {moduleName}</p>
        <p className="text-xl">{topic}</p>
      </Link>
    </div>
  );
}

export type SkillRow = {
  moduleSlug: string;
  moduleName: string;
  moduleDescription: string;
  skillSlug: string;
  skillName: string;
  total: number;
  solved: number;
};

export type DashboardModule = {
  slug: string;
  name: string;
  description: string;
  total: number;
  solved: number;
  progress: number;
};

export type UpNext = {
  topic: string;
  moduleName: string;
  href: string;
};

export function summarizeDashboard(rows: SkillRow[]) {
  const byModule = new Map<string, DashboardModule>();
  let upNext: UpNext | null = null;

  for (const row of rows) {
    if (row.total === 0) continue;

    const mod = byModule.get(row.moduleSlug) ?? {
      slug: row.moduleSlug,
      name: row.moduleName,
      description: row.moduleDescription,
      total: 0,
      solved: 0,
      progress: 0,
    };
    mod.total += row.total;
    mod.solved += row.solved;
    byModule.set(row.moduleSlug, mod);

    if (!upNext && row.solved < row.total) {
      upNext = {
        topic: row.skillName,
        moduleName: row.moduleName,
        href: `/practice/${row.moduleSlug}/${row.skillSlug}`,
      };
    }
  }
  const modules = [...byModule.values()].map((mod) => ({
    ...mod,
    progress: Math.min(100, Math.round((mod.solved / mod.total) * 100)),
  }));

  return { modules, upNext };
}

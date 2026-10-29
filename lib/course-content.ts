export type CourseModule = {
    slug: string;
    name: string;
    description: string;
    progress: number;
}

export const SAT_MODULES: CourseModule[] = [
  {
    slug: "algebra",
    name: "Algebra",
    description: "Linear equations, systems and inequalities",
    progress: 40,
  },
  {
    slug: "advanced-math",
    name: "Advanced Math",
    description: "Quadratics, polynomials and exponential functions",
    progress: 20,
  },
  {
    slug: "geometry",
    name: "Geometry",
    description: "Area, volume, circles and trigonometry",
    progress: 10,
  },
  {
    slug: "statistics",
    name: "Statistics",
    description: "Data analysis, probability and statistics",
    progress: 0,
  },
];
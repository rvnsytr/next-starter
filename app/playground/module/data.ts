import { userStatus, UserStatus } from "@/modules/auth/constants";
import { faker } from "@faker-js/faker";
import { Skill, skills, UserRole, userRoles } from "./constants";

export type Employee = {
  id: string;
  isActive: boolean;
  name: string;
  email: string;
  age: number;
  salary: number;
  createdAt: Date;
  status: UserStatus;
  role: UserRole;
  skills: Skill[];
  department: string;
  manager: string | null;
  phone?: string;
  address: {
    city: string;
    country: string;
  };
  projects: string[];
};

const projects = [
  "CRM",
  "Dashboard",
  "Infrastructure",
  "Automation",
  "Design System",
  "API Gateway",
  "Help Center",
  "Cloud Migration",
  "Portal",
  "Kubernetes",
  "Website",
  "ERP",
  "Regression",
  "ML Platform",
  "Knowledge Base",
  "Payments",
  "Branding",
  "Service Mesh",
  "Testing",
  "Security",
  "Live Chat",
  "Admin Portal",
  "Observability",
  "Campaign",
  "Recommendation Engine",
  "Smoke Test",
  "Internal Tools",
];

const names = Array.from({ length: 100 }, () => faker.person.fullName());
const departments = Array.from({ length: 20 }, () =>
  faker.commerce.department(),
);
const cities = Array.from({ length: 20 }, () => faker.location.city());
const countries = Array.from({ length: 20 }, () => faker.location.country());

const newEmployee = (): Employee => {
  const name = names[Math.floor(Math.random() * names.length)];
  const withManager = Math.random() > 0.5;

  return {
    id: crypto.randomUUID(),
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    age: 18 + Math.floor(Math.random() * 48),
    salary:
      Math.round((50000 + Math.floor(Math.random() * 100001)) / 1000) * 1000,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000),
    ),
    status:
      userStatus.values[Math.floor(Math.random() * userStatus.values.length)],
    role: userRoles[Math.floor(Math.random() * userRoles.length)],
    skills: skills.filter(() => Math.random() > 0.5),
    department: departments[Math.floor(Math.random() * departments.length)],
    manager: withManager
      ? names[Math.floor(Math.random() * names.length)]
      : null,
    phone: `+1 555 ${String(Math.floor(Math.random() * 10000000)).padStart(7, "0")}`,
    address: {
      city: cities[Math.floor(Math.random() * cities.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
    },
    projects: projects.filter(() => Math.random() > 0.7).slice(0, 5),
    isActive: Math.random() > 0.5,
  };
};

export const generateEmployees = (count: number): Employee[] => {
  return Array.from({ length: count }, newEmployee);
};

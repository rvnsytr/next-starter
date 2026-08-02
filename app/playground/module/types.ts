import { UserStatus } from "@/modules/auth/constants";

export type UserRole =
  "Admin" | "Manager" | "Developer" | "Designer" | "QA" | "Support";

export type Skill =
  | "React"
  | "Vue"
  | "Angular"
  | "Node.js"
  | "TypeScript"
  | "Python"
  | "Go"
  | "Docker"
  | "AWS"
  | "GraphQL";

export type Employee = {
  id: number;
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

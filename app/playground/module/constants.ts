import { Skill, UserRole } from "./types";

export const userRoleMeta: Record<UserRole, { color: string }> = {
  Admin: { color: "#FF0000" },
  Manager: { color: "#FFA500" },
  Developer: { color: "#0000FF" },
  Designer: { color: "#800080" },
  QA: { color: "#008000" },
  Support: { color: "#00CED1" },
};

export const skillMeta: Record<Skill, { color: string }> = {
  React: { color: "#61DAFB" },
  Vue: { color: "#42B883" },
  Angular: { color: "#DD0031" },
  "Node.js": { color: "#339933" },
  TypeScript: { color: "#3178C6" },
  Python: { color: "#3776AB" },
  Go: { color: "#00ADD8" },
  Docker: { color: "#2496ED" },
  AWS: { color: "#FF9900" },
  GraphQL: { color: "#E10098" },
};

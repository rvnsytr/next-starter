import { LucideIcon } from "lucide-react";

export type Docs = {
  icon: LucideIcon;
  section: string;
  content: ({
    refs?: (
      | keyof typeof docsFromConfig
      | { type?: "internal" | "external"; url: string; label?: string }
    )[];
    render?: (() => React.ReactNode) | React.ReactNode;
  } & (
    | { type: "text"; label?: string }
    | { type: "docs"; label: string }
    | {
        type: "comp";
        label: string;
        variants?: { label: string; render: React.ReactNode }[];
      }
  ))[];
};

export const docsFromConfig: Record<
  | "aceternityui"
  | "cosshooks"
  | "cossui"
  | "magicui"
  | "reui"
  | "shadcnui"
  | "spellui",
  { label: string; baseUrl: string }
> = {
  aceternityui: {
    label: "Aceternity UI",
    baseUrl: "https://ui.aceternity.com/components",
  },
  cosshooks: {
    label: "coss/hooks",
    baseUrl: "https://coss.com/ui/docs/hooks",
  },
  cossui: {
    label: "coss/ui",
    baseUrl: "https://coss.com/ui/docs/components",
  },
  magicui: {
    label: "Magic UI",
    baseUrl: "https://magicui.design/docs/components",
  },
  reui: {
    label: "RE UI",
    baseUrl: "https://reui.io/docs/components/base",
  },
  shadcnui: {
    label: "shadcn/ui",
    baseUrl: "https://ui.shadcn.com/docs/components/base",
  },
  spellui: {
    label: "Spell UI",
    baseUrl: "https://spell.sh/docs",
  },
};

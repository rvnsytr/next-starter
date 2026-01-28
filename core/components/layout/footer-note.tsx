import { cn } from "@/core/utils/helpers";
import Link from "next/link";

export function FooterNote({ className }: { className?: string }) {
  return (
    <small className={cn("text-muted-foreground", className)}>
      {"Built by "}
      <Link
        href="https://github.com/RvnSytR"
        target="_blank"
        className="link-underline"
      >
        RvnS
      </Link>
      {" under heavy caffeine influence."}
    </small>
  );
}

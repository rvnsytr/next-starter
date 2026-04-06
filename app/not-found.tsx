import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/core/components/ui/empty";
import { GlobeXIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Empty className="min-h-svh">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <GlobeXIcon />
        </EmptyMedia>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          Oops, Looks like there&apos;s no one here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href="/" className="link">
          Take me Home
        </Link>
      </EmptyContent>
    </Empty>
  );
}

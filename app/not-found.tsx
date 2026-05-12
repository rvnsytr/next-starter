import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/core/components/ui/empty";
import { setRouteTitle } from "@/core/route";
import { GlobeXIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: setRouteTitle("404"),
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Empty>
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
    </div>
  );
}

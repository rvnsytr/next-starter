// export const metadata: Metadata = { title: "Current Page" };

// export default function Page() {
//   return (
//     <div>Page</div>
//   )
// }

import { ThemeToggle } from "@/core/components/theme";
import { Button } from "@/core/components/ui/button";
import { LinkSpinner } from "@/core/components/ui/spinner";
import { GithubIcon } from "@/shared/components/icons";
import { appConfig } from "@/shared/config";
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  TestTubeDiagonalIcon,
} from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="container flex min-h-svh max-w-lg flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <small className="text-muted-foreground text-xs font-light tracking-widest">
          RvnSytR
        </small>
        <h1 className="text-2xl font-medium">{appConfig.name}</h1>
        <p className="text-muted-foreground text-sm">{appConfig.description}</p>
      </div>

      <div className="flex gap-2">
        <ThemeToggle variant="outline" />

        <Button
          size="icon"
          variant="outline"
          nativeButton={false}
          render={
            <Link
              href="https://github.com/rvnsytr/next-starter"
              target="_blank"
            >
              <GithubIcon />
            </Link>
          }
        />
      </div>

      <div className="flex gap-2">
        {/* <Button
          nativeButton={false}
          render={
            <Link href="/dashboard">
              Docs
              <LinkSpinner icon={{ base: <ExternalLinkIcon /> }} />
            </Link>
          }
        /> */}

        <Button disabled>
          Docs <ExternalLinkIcon />
        </Button>

        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/playground">
              <LinkSpinner icon={{ base: <TestTubeDiagonalIcon /> }} />
              Playground
            </Link>
          }
        />

        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/dashboard">
              Dashboard
              <LinkSpinner icon={{ base: <ArrowRightIcon /> }} />
            </Link>
          }
        />
      </div>
    </div>
  );
}

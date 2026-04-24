// export const metadata: Metadata = { title: "Current Page" };

// export default function Page() {
//   return (
//     <div>Page</div>
//   )
// }

import { LinkSpinner } from "@/core/components/ui/spinner";
import { ToastExample } from "@/modules/docs/components/examples";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <Link href="/dashboard" className="link">
        <LinkSpinner icon={{ base: "Dashboard" }} />
      </Link>

      <ToastExample />
    </div>
  );
}

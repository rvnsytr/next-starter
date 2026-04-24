// export const metadata: Metadata = { title: "Current Page" };

// export default function Page() {
//   return (
//     <div>Page</div>
//   )
// }

import { LinkSpinner } from "@/core/components/ui/spinner";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Link href="/dashboard" className="link">
        <LinkSpinner icon={{ base: "Dashboard" }} />
      </Link>
    </div>
  );
}

import { DashboardMain } from "@/core/components/layouts";
import { R } from "@/core/components/ui/motion";
import { requireAuth } from "@/modules/auth";

export default async function Page() {
  const { session, meta } = await requireAuth("/dashboard");

  return (
    <DashboardMain
      currentPage={meta.displayName}
      className="items-center justify-center"
    >
      <R />
      <pre className="animate-fade delay-500">
        {JSON.stringify(session, null, 2)}
      </pre>
    </DashboardMain>
  );
}

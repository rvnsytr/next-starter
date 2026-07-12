import {
  DashboardPage,
  DashboardPageDescription,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/core/components/layout/dashboard-page";

export default function Page() {
  return (
    <DashboardPage>
      <DashboardPageHeader className="border-b">
        <DashboardPageTitle>Dashboard</DashboardPageTitle>
        <DashboardPageDescription>
          Welcome to the dashboard! Here you can find an overview of your
          account and access various features.
        </DashboardPageDescription>
      </DashboardPageHeader>

      <p>Hello World</p>
    </DashboardPage>
  );
}

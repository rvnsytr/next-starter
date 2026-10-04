import {
  ContentLayout,
  ContentLayoutDescription,
  ContentLayoutHeader,
  ContentLayoutTitle,
} from "@/core/components/layout/content-layout";

export default function Page() {
  return (
    <ContentLayout className="px-0">
      <ContentLayoutHeader className="border-b px-4">
        <ContentLayoutTitle>Dashboard</ContentLayoutTitle>
        <ContentLayoutDescription>
          Welcome to the dashboard! Here you can find an overview of your
          account and access various features.
        </ContentLayoutDescription>
      </ContentLayoutHeader>

      <p>Hello World</p>
    </ContentLayout>
  );
}

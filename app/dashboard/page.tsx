import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/core/components/layout/page";
import { FormExample } from "@/modules/docs/components/form-example";

export default function Page() {
  return (
    <PageContainer>
      <PageHeader className="border-b">
        <PageTitle>Dashboard</PageTitle>
        <PageDescription>
          Welcome to the dashboard! Here you can find an overview of your
          account and access various features.
        </PageDescription>
      </PageHeader>

      <p>Hello World</p>

      <FormExample />
    </PageContainer>
  );
}

import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { AreaChart, BarChart, PieChart } from "@/core/components/ui/charts";
import { R } from "@/core/components/ui/r";
import { ScrollArea, ScrollBar } from "@/core/components/ui/scroll-area";
import { LinkSpinner } from "@/core/components/ui/spinner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { ThemeToggle } from "@/core/components/ui/theme";
import { ExampleForm, ExampleTypography } from "@/modules/docs";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

// export const metadata: Metadata = { title: "Current Page" };

const pieChartData = [
  { nameKey: "Chrome", dataKey: 275, fill: "var(--color-chart-1)" },
  { nameKey: "Safari", dataKey: 200, fill: "var(--color-chart-2)" },
  { nameKey: "Firefox", dataKey: 187, fill: "var(--color-chart-3)" },
  { nameKey: "Edge", dataKey: 173, fill: "var(--color-chart-4)" },
  { nameKey: "Other", dataKey: 90, fill: "var(--color-chart-5)" },
];

const areaAndPieChartData = [
  { xLabel: "Januari", dataKeys: { key1: 186, key2: 80 } },
  { xLabel: "Februari", dataKeys: { key1: 305, key2: 200 } },
  { xLabel: "Maret", dataKeys: { key1: 237, key2: 120 } },
  { xLabel: "April", dataKeys: { key1: 73, key2: 190 } },
  { xLabel: "Mei", dataKeys: { key1: 209, key2: 130 } },
  { xLabel: "Juni", dataKeys: { key1: 214, key2: 140 } },
];

const areaAndPieChartConfig = {
  key1: { label: "Desktop", color: "var(--color-chart-1)" },
  key2: { label: "Mobile", color: "var(--color-chart-2)" },
};

const comp = {
  pieChart: (
    <Card>
      <CardHeader>
        <CardTitle>Pie Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mx-auto aspect-square h-80">
          <PieChart label="Kategori" data={pieChartData} />
        </div>
      </CardContent>
    </Card>
  ),

  timelineChart: (
    <Card>
      <CardHeader>
        <CardTitle>Timeline Chart</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 md:flex-row">
        <div className="md:basis-1/2">
          <AreaChart
            config={areaAndPieChartConfig}
            data={areaAndPieChartData}
          />
        </div>

        <div className="md:basis-1/2">
          <BarChart config={areaAndPieChartConfig} data={areaAndPieChartData} />
        </div>
      </CardContent>
    </Card>
  ),

  form: (
    <Card>
      <CardContent>
        <ExampleForm />
      </CardContent>
    </Card>
  ),

  typography: <ExampleTypography />,
};

const tabs: { section: string; content?: (keyof typeof comp)[] }[] = [
  { section: "Form", content: ["form"] },
  { section: "Typography", content: ["typography"] },
  { section: "Chart", content: ["pieChart", "timelineChart"] },
  { section: "Event Calendar" },
  { section: "Form Builder" },
];

export default function Page() {
  return (
    <div className="container flex flex-col gap-y-8 py-8 md:py-16">
      <div className="flex flex-col items-center gap-y-4">
        <R />

        <div className="animate-fade flex flex-wrap gap-2 delay-750">
          <ThemeToggle variant="outline" />

          <Button variant="outline" asChild>
            <Link href="/dashboard">
              Ke Dashboard <LinkSpinner icon={{ base: <ArrowRightIcon /> }} />
            </Link>
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue={tabs[0].section}
        className="animate-fade w-full flex-col gap-x-4 delay-1000 md:flex-row"
      >
        <ScrollArea className="pb-2">
          <TabsList variant="line">
            {tabs.map(({ section }) => (
              <TabsTrigger key={section} value={section}>
                {section}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="w-full">
          {tabs.map(({ section, content }) => (
            <TabsContent key={section} value={section} className="grid gap-y-4">
              <h3>{section}</h3>
              {content ? (
                content.map((key, index) => (
                  <Fragment key={index}>{comp[key]}</Fragment>
                ))
              ) : (
                <p>TODO</p>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

"use client";

import { cn } from "@/core/utils";
import {
  Area,
  AreaChart as AreaChartComp,
  Bar,
  BarChart as BarChartComp,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart as PieChartComp,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";

type TimelineChart = {
  config: ChartConfig;
  data: { xLabel: string; dataKeys: Record<string, number> }[];
};

const radius = 8;
const tickMargin = 10;
const tickFormatter = (str: string) => str.slice(0, 3);

export function PieChart({
  label,
  data,
  className,
}: {
  label: string;
  data: { nameKey: string; dataKey: number; fill: string }[];
  className?: string;
}) {
  return (
    <ChartContainer
      config={{
        dataKey: { label: label },
        ...data.reduce(
          (acc, item) => {
            acc[item.nameKey] = { label: item.nameKey };
            return acc;
          },
          {} as Record<string, { label: string }>,
        ),
      }}
      className={cn(
        "aspect-square",
        "[&_.recharts-pie-label-text]:animate-fade [&_.recharts-pie-label-text]:animate-delay-1000",
        "[&_.recharts-pie-label-line]:animate-fade [&_.recharts-pie-label-line]:animate-delay-1250",
        className,
      )}
    >
      <PieChartComp>
        <Pie
          data={data}
          nameKey="nameKey"
          dataKey="dataKey"
          innerRadius={40}
          label
        />

        <ChartLegend
          content={
            <ChartLegendContent
              nameKey="nameKey"
              className="animate-fade animate-delay-1000 flex-wrap gap-y-2"
            />
          }
        />

        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChartComp>
    </ChartContainer>
  );
}

export function AreaChart({
  config,
  data,
  className,
}: TimelineChart & { className?: string }) {
  return (
    <ChartContainer config={config} className={className}>
      <AreaChartComp
        accessibilityLayer
        margin={{ right: 6 }}
        data={data.map((item) => ({ xLabel: item.xLabel, ...item.dataKeys }))}
      >
        <defs>
          {Object.keys(config).map((item) => (
            <linearGradient
              key={item}
              id={`fill-${item}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={`var(--color-${item})`}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={`var(--color-${item})`}
                stopOpacity={0.1}
              />
            </linearGradient>
          ))}
        </defs>

        {Object.keys(config).map((item) => (
          <Area
            key={item}
            dataKey={item}
            fill={`url(#fill-${item})`}
            stroke={`var(--color-${item})`}
            fillOpacity={0.4}
          />
        ))}

        <XAxis
          dataKey="xLabel"
          axisLine={false}
          tickMargin={tickMargin}
          tickFormatter={tickFormatter}
        />

        <YAxis axisLine={false} tickMargin={tickMargin} />

        <CartesianGrid vertical={false} />

        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
      </AreaChartComp>
    </ChartContainer>
  );
}

export function BarChart({
  config,
  data,
  className,
}: TimelineChart & { className?: string }) {
  return (
    <ChartContainer config={config} className={className}>
      <BarChartComp
        accessibilityLayer
        margin={{ top: 30 }}
        data={data.map((item) => ({ xLabel: item.xLabel, ...item.dataKeys }))}
      >
        {Object.keys(config).map((item) => (
          <Bar
            key={item}
            dataKey={item}
            fill={`var(--color-${item})`}
            radius={radius}
          >
            <LabelList className="fill-foreground" />
          </Bar>
        ))}

        <XAxis
          dataKey="xLabel"
          axisLine={false}
          tickMargin={tickMargin}
          tickFormatter={tickFormatter}
        />

        <YAxis axisLine={false} tickMargin={tickMargin} />

        <CartesianGrid vertical={false} />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
      </BarChartComp>
    </ChartContainer>
  );
}

import { Badge, CustomColorBadge } from "@/core/components/ui/badge";
import { dataController } from "@/core/modules/table/hooks/data-controller";
import { formatNumber } from "@/core/utils";
import { cn } from "cn";
import { formatDate } from "date-fns";
import {
  CalendarCheck2Icon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  Clock3Icon,
  DollarSignIcon,
  MailIcon,
  MapPinIcon,
  MapPinnedIcon,
  PackageIcon,
  TrendingDown,
  TrendingUp,
  UserRoundIcon,
} from "lucide-react";
import { Sale, productMeta, saleStatusMeta } from "../constants";

const columnHelper = dataController.createAppColumnHelper<Sale>();

export const saleDCColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    header: (c) => <c.header.SelectAllCheckbox />,
    cell: (c) => <c.cell.SelectRowCheckbox />,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableMultiSort: false,
    enableSorting: false,
  }),

  columnHelper.display({
    id: "no",
    header: () => <div className="text-center">No</div>,
    cell: (c) => <c.cell.RowNumber className="text-center" />,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableMultiSort: false,
    enableSorting: false,
  }),

  columnHelper.accessor("customerName", {
    header: (c) => <c.header.ColumnHeader label="Customer" />,
    cell: (c) => c.getValue(),

    filterFn: "string",

    meta: {
      label: "Customer",
      icon: UserRoundIcon,
    },
  }),

  columnHelper.accessor("customerEmail", {
    header: (c) => <c.header.ColumnHeader label="Email Address" />,
    cell: (c) => c.getValue(),

    filterFn: "string",

    meta: {
      label: "Email Address",
      icon: MailIcon,
    },
  }),

  columnHelper.accessor("location", {
    header: (c) => <c.header.ColumnHeader label="Location" />,
    cell: (c) => c.getValue(),

    filterFn: "string",

    meta: {
      label: "Location",
      icon: MapPinnedIcon,
    },
  }),

  columnHelper.accessor("salesRep", {
    header: (c) => <c.header.ColumnHeader label="Sales Rep" />,
    cell: (c) => c.getValue() ?? "-",

    filterFn: "string",

    meta: {
      label: "Sales Representative",
      icon: UserRoundIcon,
    },
  }),

  columnHelper.accessor("status", {
    header: (c) => <c.header.ColumnHeader label="Status" align="center" />,
    cell: (c) => {
      const { label, color, icon: Icon } = saleStatusMeta[c.getValue()];
      return (
        <div className="flex justify-center">
          <CustomColorBadge color={color}>
            <Icon /> {label}
          </CustomColorBadge>
        </div>
      );
    },

    filterFn: "option",

    meta: {
      label: "Status",
      icon: CircleDotIcon,

      options: Object.entries(saleStatusMeta).map(([k, v]) => ({
        value: k,
        label: v.label,
        icon: v.icon,
      })),
    },
  }),

  columnHelper.accessor("products", {
    header: (c) => <c.header.ColumnHeader label="Products" />,
    cell: (c) => (
      <div className="flex flex-wrap gap-1">
        {c.getValue().map((product: string) => {
          const key = Object.keys(productMeta).find((k) => k === product);
          const selected = key
            ? productMeta[key as keyof typeof productMeta]
            : undefined;
          return (
            <CustomColorBadge
              key={product}
              color={selected?.color || "primary"}
            >
              {selected?.label || product}
            </CustomColorBadge>
          );
        })}
      </div>
    ),

    filterFn: "multi-option",
    getUniqueValues: (r) => r.products,

    meta: {
      label: "Products",
      icon: PackageIcon,

      options: Object.entries(productMeta).map(([k, v]) => ({
        value: k,
        label: v.label,
        color: v.color,
      })),
    },
  }),

  columnHelper.accessor("amount", {
    header: (c) => <c.header.ColumnHeader label="Amount" align="end" />,
    cell: (c) => {
      const amount = c.getValue();

      const isPositive = amount > 0;
      const isNegative = amount < 0;

      const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : null;

      return (
        <div
          className={cn(
            "text-muted-foreground flex items-center justify-end gap-x-2 text-right font-medium tabular-nums",
            isPositive && "text-success",
            isNegative && "text-destructive",
          )}
        >
          {Icon && <Icon className="size-3.5" />}
          {isNegative ? "-" : ""}${formatNumber(Math.abs(amount))}
        </div>
      );
    },

    filterFn: "number",

    meta: {
      label: "Sale Amount",
      icon: DollarSignIcon,

      cellProps: (value) => {
        const isNumber = typeof value === "number";
        return {
          className: cn(
            "bg-muted dark:bg-muted",
            isNumber && value > 0 && "bg-success/10 dark:bg-success/20",
            isNumber && value < 0 && "bg-destructive/10 dark:bg-destructive/20",
          ),
        };
      },
    },
  }),

  columnHelper.accessor("isPaid", {
    header: (c) => <c.header.ColumnHeader label="Paid" align="center" />,
    cell: (c) => (
      <div className="flex justify-center">
        {c.getValue() ? (
          <Badge variant="success">Paid</Badge>
        ) : (
          <Badge variant="warning">Unpaid</Badge>
        )}
      </div>
    ),

    filterFn: "boolean",

    meta: {
      label: "Paid",
      icon: CheckCircle2Icon,

      booleanLabels: {
        true: "paid",
        false: "unpaid",
      },
    },
  }),

  columnHelper.accessor("purchasedAt", {
    header: (c) => <c.header.ColumnHeader label="Purchased At" />,
    cell: (c) => formatDate(c.getValue(), "PPPp"),

    filterFn: "temporal",

    meta: {
      label: "Purchased At",
      icon: CalendarCheck2Icon,
    },
  }),

  columnHelper.accessor("notes", {
    header: (c) => <c.header.ColumnHeader label="Notes" />,
    cell: (c) => (
      <p className="leading-normal whitespace-pre-line">{c.getValue()}</p>
    ),

    filterFn: "string",

    meta: {
      label: "Notes",
      icon: UserRoundIcon,
    },
  }),

  columnHelper.group({
    id: "shippingAddress",
    header: "Shipping Address",
    columns: columnHelper.columns([
      columnHelper.accessor("shippingAddress.city", {
        id: "city",
        header: (c) => <c.header.ColumnHeader label="City" />,
        cell: (c) => c.getValue(),

        filterFn: "string",

        meta: {
          label: "City",
        },
      }),

      columnHelper.accessor("shippingAddress.country", {
        id: "country",
        header: (c) => <c.header.ColumnHeader label="Country" />,
        cell: (c) => c.getValue(),

        filterFn: "string",

        meta: {
          label: "Country",
        },
      }),
    ]),

    meta: {
      label: "Shipping Address",
      icon: MapPinIcon,
      headerProps: {
        className: "text-center",
      },
    },
  }),

  columnHelper.group({
    id: "deliveryPeriod",
    header: "Delivery Period",
    columns: columnHelper.columns([
      columnHelper.accessor("deliveryPeriod.from", {
        id: "deliveryFrom",
        header: (c) => <c.header.ColumnHeader label="From" />,
        cell: (c) => formatDate(c.getValue(), "PPP"),

        meta: {
          label: "Delivery From",
          icon: CalendarDaysIcon,
        },
      }),

      columnHelper.accessor("deliveryPeriod.to", {
        id: "deliveryTo",
        header: (c) => <c.header.ColumnHeader label="To" />,
        cell: (c) => formatDate(c.getValue(), "PPP"),

        meta: {
          label: "Delivery To",
          icon: CalendarDaysIcon,
        },
      }),
    ]),

    meta: {
      label: "Delivery Period",
      icon: CalendarDaysIcon,
      headerProps: {
        className: "text-center",
      },
    },
  }),

  columnHelper.accessor("availableDates", {
    header: (c) => <c.header.ColumnHeader label="Available Dates" />,
    cell: (c) => (
      <div className="flex flex-wrap gap-1">
        {c.getValue().map((date, index) => (
          <Badge key={index} variant="outline">
            {formatDate(date, "PPP")}
          </Badge>
        ))}
      </div>
    ),

    meta: {
      label: "Available Dates",
      icon: CalendarDaysIcon,
    },
  }),

  columnHelper.accessor("preferredTime", {
    header: (c) => <c.header.ColumnHeader label="Preferred Time" />,
    cell: (c) => c.getValue(),

    meta: {
      label: "Preferred Time",
      icon: Clock3Icon,
    },
  }),

  columnHelper.accessor("deliveryTimes", {
    header: (c) => <c.header.ColumnHeader label="Delivery Times" />,
    cell: (c) => (
      <div className="flex flex-wrap gap-1">
        {c.getValue().map((time) => (
          <Badge key={time} variant="outline">
            {time}
          </Badge>
        ))}
      </div>
    ),

    meta: {
      label: "Delivery Times",
      icon: Clock3Icon,
    },
  }),
]);

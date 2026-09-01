import { Badge, CustomColorBadge } from "@/core/components/ui/badge";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { cn, formatNumber } from "@/core/utils";
import { sharedSchemas } from "@/shared/schema";
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
  PackageIcon,
  TrendingDown,
  TrendingUp,
  UserRoundIcon,
} from "lucide-react";
import { Sale, productMeta, saleStatusMeta } from "../constants";

const columnHelper = dataGrid.createAppColumnHelper<Sale>();

export const saleDGColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    header: (c) => <c.header.SelectAllCheckbox />,
    cell: (c) => <c.cell.SelectRowCheckbox />,
    size: 50,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableHiding: false,
    enableMultiSort: false,
    enablePinning: false,
    enableResizing: false,
    enableSorting: false,
    enableCellSelection: false,
  }),

  columnHelper.display({
    id: "no",
    header: () => <div className="text-center">No</div>,
    cell: (c) => <c.cell.RowNumber className="text-center" />,
    size: 50,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableHiding: false,
    enableMultiSort: false,
    enablePinning: false,
    enableResizing: false,
    enableSorting: false,
    enableCellSelection: false,
  }),

  columnHelper.accessor("customerName", {
    header: (c) => <c.header.ColumnHeader label="Customer" />,
    cell: (c) => c.getValue(),

    filterFn: "string",

    minSize: 200,
    size: 200,

    meta: {
      label: "Customer",
      icon: UserRoundIcon,

      editor: {
        type: "string",
        schema: sharedSchemas.string({ min: 1 }),
      },
    },
  }),

  columnHelper.accessor("customerEmail", {
    header: (c) => <c.header.ColumnHeader label="Email Address" />,
    cell: (c) => c.getValue(),

    filterFn: "string",

    minSize: 200,
    size: 200,

    meta: {
      label: "Email Address",
      icon: MailIcon,

      editor: {
        type: "string",
        schema: sharedSchemas.email,
        props: {
          type: "email",
        },
      },
    },
  }),

  columnHelper.accessor("salesRep", {
    header: (c) => <c.header.ColumnHeader label="Sales Rep" />,
    cell: (c) => c.getValue() ?? "-",

    filterFn: "string",

    minSize: 200,
    size: 200,

    meta: {
      label: "Sales Representative",
      icon: UserRoundIcon,

      editor: {
        type: "string",
      },
    },
  }),

  columnHelper.accessor("status", {
    header: (c) => <c.header.ColumnHeader label="Status" align="center" />,
    cell: (c) => {
      const status = c.getValue();
      const { color } = saleStatusMeta[status];

      return (
        <div className="flex justify-center">
          <CustomColorBadge color={color}>{status}</CustomColorBadge>
        </div>
      );
    },

    filterFn: "option",

    minSize: 120,
    size: 120,

    meta: {
      label: "Status",
      icon: CircleDotIcon,

      options: Object.entries(saleStatusMeta).map(([k, v]) => ({
        value: k,
        label: k,
        icon: v.icon,
      })),
    },
  }),

  columnHelper.accessor("products", {
    header: (c) => <c.header.ColumnHeader label="Products" />,
    cell: (c) => (
      <div className="flex flex-wrap gap-1">
        {c.getValue().map((product) => (
          <CustomColorBadge key={product} color={productMeta[product].color}>
            {product}
          </CustomColorBadge>
        ))}
      </div>
    ),

    filterFn: "multi-option",

    minSize: 300,
    size: 300,

    meta: {
      label: "Products",
      icon: PackageIcon,

      options: Object.keys(productMeta).map((k) => ({ value: k, label: k })),
    },
  }),

  columnHelper.accessor("amount", {
    header: (c) => <c.header.ColumnHeader label="Amount" align="end" />,
    cell: (c) => {
      const amount = c.getValue();
      const isNegative = amount < 0;
      const Icon = isNegative ? TrendingDown : TrendingUp;
      return (
        <div
          className={cn(
            "flex items-center justify-end gap-x-2 text-right font-medium tabular-nums",
            isNegative ? "text-destructive" : "text-success",
          )}
        >
          <Icon className="size-3.5" />
          {isNegative ? "-" : ""}${formatNumber(Math.abs(amount))}
        </div>
      );
    },

    filterFn: "number",

    minSize: 120,
    size: 120,

    meta: {
      label: "Sale Amount",
      icon: DollarSignIcon,

      editor: {
        type: "number",
      },

      cellProps: (value) => ({
        className: cn(
          typeof value === "number" && value >= 0
            ? "bg-success/10 dark:bg-success/20"
            : "bg-destructive/10 dark:bg-destructive/20",
        ),
      }),
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

    minSize: 100,
    size: 100,

    meta: {
      label: "Paid",
      icon: CheckCircle2Icon,

      editor: {
        type: "boolean:switch",
      },
    },
  }),

  columnHelper.accessor("purchasedAt", {
    header: (c) => <c.header.ColumnHeader label="Purchased At" />,
    cell: (c) => formatDate(c.getValue(), "PPPp"),

    minSize: 250,
    size: 250,

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

    minSize: 350,
    size: 350,

    meta: {
      label: "Notes",
      icon: UserRoundIcon,

      editor: {
        type: "string:textarea",
      },
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

        minSize: 150,
        size: 150,

        meta: {
          label: "City",

          editor: {
            type: "string",
          },
        },
      }),

      columnHelper.accessor("shippingAddress.country", {
        id: "country",
        header: (c) => <c.header.ColumnHeader label="Country" />,
        cell: (c) => c.getValue(),

        filterFn: "string",

        minSize: 150,
        size: 150,

        meta: {
          label: "Country",

          editor: {
            type: "string",
          },
        },
      }),
    ]),

    minSize: 300,
    size: 300,

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

        minSize: 150,
        size: 150,

        meta: {
          label: "Delivery From",
          icon: CalendarDaysIcon,
        },
      }),

      columnHelper.accessor("deliveryPeriod.to", {
        id: "deliveryTo",
        header: (c) => <c.header.ColumnHeader label="To" />,
        cell: (c) => formatDate(c.getValue(), "PPP"),

        minSize: 150,
        size: 150,

        meta: {
          label: "Delivery To",
          icon: CalendarDaysIcon,
        },
      }),
    ]),

    minSize: 300,
    size: 300,

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

    minSize: 300,
    size: 300,

    meta: {
      label: "Available Dates",
      icon: CalendarDaysIcon,
    },
  }),

  columnHelper.accessor("preferredTime", {
    header: (c) => <c.header.ColumnHeader label="Preferred Time" />,
    cell: (c) => c.getValue(),

    minSize: 160,
    size: 160,

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

    minSize: 300,
    size: 300,

    meta: {
      label: "Delivery Times",
      icon: Clock3Icon,
    },
  }),
]);

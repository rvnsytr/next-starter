import { Badge, CustomColorBadge } from "@/core/components/ui/badge";
import { dataTable } from "@/core/modules/table/hooks/data-table";
import { formatNumber } from "@/core/utils";
import { formatDate } from "date-fns";
import {
  CalendarCheck2Icon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  DollarSignIcon,
  MapPinIcon,
  PackageIcon,
  UserRoundIcon,
} from "lucide-react";
import { Sale, productMeta, saleStatusMeta } from "../constants";

const columnHelper = dataTable.createAppColumnHelper<Sale>();

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
      icon: UserRoundIcon,
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

    minSize: 120,
    size: 120,

    meta: {
      label: "Status",
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

    minSize: 300,
    size: 300,

    meta: {
      label: "Products",
      icon: PackageIcon,
    },
  }),

  columnHelper.accessor("amount", {
    header: (c) => <c.header.ColumnHeader label="Amount" align="end" />,
    cell: (c) => {
      const amount = c.getValue();
      const isNegative = amount < 0;

      return (
        <div className="text-right">
          <span className="text-foreground">
            {isNegative ? "-" : ""}${formatNumber(Math.abs(amount))}
          </span>
        </div>
      );
    },

    filterFn: "number",

    minSize: 150,
    size: 150,

    meta: {
      label: "Sale Amount",
      icon: DollarSignIcon,
    },
  }),

  columnHelper.accessor("isPaid", {
    header: (c) => <c.header.ColumnHeader label="Paid" align="center" />,
    cell: (c) => (
      <div className="flex justify-center">
        {c.getValue() ? (
          <Badge variant="success">Paid</Badge>
        ) : (
          <Badge variant="outline">Unpaid</Badge>
        )}
      </div>
    ),

    filterFn: "boolean",

    minSize: 100,
    size: 100,

    meta: {
      label: "Paid",
      icon: CheckCircle2Icon,
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

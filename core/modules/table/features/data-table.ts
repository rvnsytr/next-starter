import {
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  metaHelper,
  TableFeatures,
} from "@tanstack/react-table";
import { DataTableColumnMeta, DataTableTableMeta } from "../types";
import {
  clientDataControllerFeatures,
  serverDataControllerFeatures,
} from "./data-controller";

export const serverDataTableFeatures = {
  ...serverDataControllerFeatures,
  columnPinningFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnResizingFeature,
} satisfies TableFeatures;

export const clientDataTableFeatures = {
  ...clientDataControllerFeatures,
} satisfies TableFeatures;

export const dataTableFeatures = {
  ...serverDataTableFeatures,
  ...clientDataTableFeatures,

  tableMeta: metaHelper<DataTableTableMeta>(),
  columnMeta: metaHelper<DataTableColumnMeta>(),
} satisfies TableFeatures;

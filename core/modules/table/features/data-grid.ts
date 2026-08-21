import {
  cellSelectionFeature,
  metaHelper,
  RowData,
  TableFeatures,
} from "@tanstack/react-table";
import { DataGridColumnMeta, DataGridTableMeta } from "../types";
import { clientDataTableFeatures, serverDataTableFeatures } from "./data-table";

export const serverDataGridFeatures = {
  ...serverDataTableFeatures,
  cellSelectionFeature,
} satisfies TableFeatures;

export const clientDataGridFeatures = {
  ...clientDataTableFeatures,
} satisfies TableFeatures;

export const dataGridFeatures = {
  ...serverDataGridFeatures,
  ...clientDataGridFeatures,

  tableMeta: metaHelper<DataGridTableMeta<RowData>>(),
  columnMeta: metaHelper<DataGridColumnMeta>(),
} satisfies TableFeatures;

import {
  cellSelectionFeature,
  metaHelper,
  TableFeatures,
} from "@tanstack/react-table";
import { DataGridColumnMeta } from "../types";
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

  columnMeta: metaHelper<DataGridColumnMeta>(),
} satisfies TableFeatures;

import { cellSelectionFeature, TableFeatures } from "@tanstack/react-table";
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
} satisfies TableFeatures;

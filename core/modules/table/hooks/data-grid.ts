import {
  createTableHook,
  RowData,
  tableFeatures,
  TableState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ActiveFiltersContainer } from "../components/base/filters";
import { DataGridClearFilters } from "../components/data-grid/clear-filters";
import { DataGridColumnHeader } from "../components/data-grid/column-header";
import { DataGridColumnSortMenu } from "../components/data-grid/column-sort-menu";
import { DataGridColumnVisibilityMenu } from "../components/data-grid/column-visibility-menu";
import {
  DataGridActiveFilters,
  DataGridFilterSelector,
} from "../components/data-grid/filters";
import { DataGridLayout } from "../components/data-grid/layout";
import { DataGridPageSizeSelector } from "../components/data-grid/page-size-selector";
import { DataGridPagination } from "../components/data-grid/pagination";
import { DataGridProvider } from "../components/data-grid/provider";
import { DataGridResetChangesButton } from "../components/data-grid/reset-changes-button";
import { DataGridResetTableButton } from "../components/data-grid/reset-table-button";
import { DataGridRowCheckbox } from "../components/data-grid/row-checkbox";
import { DataGridRowNumber } from "../components/data-grid/row-number";
import { DataGridSaveChangesButton } from "../components/data-grid/save-changes-button";
import { DataGridSearch } from "../components/data-grid/search";
import { DataGridSelectAllCheckbox } from "../components/data-grid/select-all-checkbox";
import { DataGrid } from "../components/data-grid/table";
import { dataGridFeatures } from "../features/data-grid";
import {
  CellComponents,
  DataGridTableComponents,
  DataGridUpdateChange,
  HeaderComponents,
  TableComponents,
} from "../types";

const { useAppTable: dataGridUseAppTable, ...rest } = createTableHook({
  features: tableFeatures(dataGridFeatures),
  tableComponents: {
    Table: DataGrid,
    ActiveFilters: DataGridActiveFilters,
    ActiveFiltersContainer,
    ClearFilters: DataGridClearFilters,
    ColumnSortMenu: DataGridColumnSortMenu,
    ColumnVisibilityMenu: DataGridColumnVisibilityMenu,
    FilterSelector: DataGridFilterSelector,
    PageSizeSelector: DataGridPageSizeSelector,
    Pagination: DataGridPagination,
    ResetTableButton: DataGridResetTableButton,
    Search: DataGridSearch,
    Layout: DataGridLayout,
    Provider: DataGridProvider,
    SaveChangesButton: DataGridSaveChangesButton,
    ResetChangesButton: DataGridResetChangesButton,
  } satisfies TableComponents & DataGridTableComponents,
  headerComponents: {
    ColumnHeader: DataGridColumnHeader,
    SelectAllCheckbox: DataGridSelectAllCheckbox,
  } satisfies HeaderComponents,
  cellComponents: {
    RowCheckbox: DataGridRowCheckbox,
    RowNumber: DataGridRowNumber,
  } satisfies CellComponents,
});

const useAppTable = <
  TData extends RowData,
  TSelected = TableState<typeof dataGridFeatures>,
>(
  tableOptions: Parameters<typeof dataGridUseAppTable<TData, TSelected>>[0],
  selector?: Parameters<typeof dataGridUseAppTable<TData, TSelected>>[1],
): ReturnType<typeof dataGridUseAppTable<TData, TSelected>> => {
  const { data, getRowId, meta, ...restOptions } = tableOptions;
  const { onCellEditApplied, ...restMeta } = meta ?? {};

  const [update, setChanges] = useState<DataGridUpdateChange<TData>[]>([]);

  const resolvedData = useMemo(() => {
    if (!data || !update) return data ?? [];
    return data.map((row, rowIndex) => {
      const rowId = getRowId?.(row, rowIndex);
      if (!rowId) return row;

      const change = update.find((c, ci) => {
        const rowDataId = getRowId?.(c.rowData, ci);
        return !!rowDataId && rowDataId === rowId;
      });

      return change ? { ...row, ...change.changes } : row;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, update]);

  return dataGridUseAppTable(
    {
      ...restOptions,
      data: resolvedData,
      getRowId,
      meta: {
        onCellEditApplied: (ctx) => {
          setChanges(ctx.updated);
          onCellEditApplied?.(ctx);
        },
        ...restMeta,
      },
    },
    selector,
  );
};

export const dataGrid = { useAppTable, ...rest };

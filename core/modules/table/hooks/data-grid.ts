import { Override } from "@/core/types";
import {
  createTableHook,
  RowData,
  tableFeatures,
  TableState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ActiveFiltersContainer } from "../components/base/filters";
import { DataGridAddRowButton } from "../components/data-grid/add-row-button";
import { DataGridClearChangesButton } from "../components/data-grid/clear-changes-button";
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
import { DataGridResetTableButton } from "../components/data-grid/reset-table-button";
import { DataGridRowCheckbox } from "../components/data-grid/row-checkbox";
import { DataGridRowNumber } from "../components/data-grid/row-number";
import { DataGridSaveChangesButton } from "../components/data-grid/save-changes-button";
import { DataGridSearch } from "../components/data-grid/search";
import { DataGridSelectAllCheckbox } from "../components/data-grid/select-all-checkbox";
import { DataGrid } from "../components/data-grid/table";
import { dataGridFeatures } from "../features/data-grid";
import {
  DataGridChanges,
  DataGridTableComponents,
  DataGridTableMeta,
  TableCellComponents,
  TableComponents,
  TableHeaderComponents,
} from "../types";
import { mergeNested } from "../utils";

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
    AddRowButton: DataGridAddRowButton,
    ClearChangesButton: DataGridClearChangesButton,
    SaveChangesButton: DataGridSaveChangesButton,
  } satisfies TableComponents & DataGridTableComponents,
  headerComponents: {
    ColumnHeader: DataGridColumnHeader,
    SelectAllCheckbox: DataGridSelectAllCheckbox,
  } satisfies TableHeaderComponents,
  cellComponents: {
    RowCheckbox: DataGridRowCheckbox,
    RowNumber: DataGridRowNumber,
  } satisfies TableCellComponents,
});

type AppTableOptions<TData extends RowData, TSelected> = Parameters<
  typeof dataGridUseAppTable<TData, TSelected>
>[0];

type AppTableSelector<TData extends RowData, TSelected> = Parameters<
  typeof dataGridUseAppTable<TData, TSelected>
>[1];

const useAppTable = <
  TData extends RowData,
  TSelected = TableState<typeof dataGridFeatures>,
>(
  tableOptions: Override<
    AppTableOptions<TData, TSelected>,
    {
      getRowId: AppTableOptions<TData, TSelected>["getRowId"];
      meta: DataGridTableMeta<TData>;
    }
  >,
  selector?: AppTableSelector<TData, TSelected>,
): ReturnType<typeof dataGridUseAppTable<TData, TSelected>> => {
  const { data, getRowId, meta, ...restOptions } = tableOptions;
  const { onChange, ...restMeta } = meta ?? {};

  const [changes, setChanges] = useState<DataGridChanges<TData>>({
    added: [],
    updated: [],
    removed: [], // todo: will be used for ('onChange' save mode)
  });

  const resolvedData = useMemo(() => {
    if (!data || !changes) return data ?? [];

    const rowData = data.map((row, rowIndex) => {
      const rowId = getRowId?.(row, rowIndex);
      if (!rowId) return row;

      const change = changes.updated.find((c, ci) => {
        const rowDataId = getRowId?.(c.rowData, ci);
        return rowDataId === rowId;
      });

      return change ? mergeNested(row, change.changes) : row;
    });

    if (changes.added.length > 0) rowData.unshift(...changes.added.reverse());

    return rowData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, changes]);

  return dataGridUseAppTable(
    {
      ...restOptions,
      data: resolvedData,
      getRowId,
      meta: {
        original: data,
        onChange: (ctx: DataGridChanges<TData>) => {
          setChanges(ctx);
          onChange?.(ctx);
        },
        ...restMeta,
      } as DataGridTableMeta<RowData> & { original: TData },
    },
    selector,
  );
};

export const dataGrid = { useAppTable, ...rest };

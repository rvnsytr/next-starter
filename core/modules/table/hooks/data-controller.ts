import { createTableHook, tableFeatures } from "@tanstack/react-table";
import { ActiveFiltersContainer } from "../components/base/filters";
import { DataControllerClearFilters } from "../components/data-controller/clear-filters";
import { DataControllerColumnHeader } from "../components/data-controller/column-header";
import { DataControllerColumnSortMenu } from "../components/data-controller/column-sort-menu";
import {
  DataControllerActiveFilters,
  DataControllerFilterSelector,
} from "../components/data-controller/filters";
import { DataControllerLayout } from "../components/data-controller/layout";
import { DataControllerPageSizeSelector } from "../components/data-controller/page-size-selector";
import { DataControllerPagination } from "../components/data-controller/pagination";
import { DataControllerResetTableButton } from "../components/data-controller/reset-table-button";
import { DataControllerRowNumber } from "../components/data-controller/row-number";
import { DataControllerSearch } from "../components/data-controller/search";
import { DataControllerSelectAllCheckbox } from "../components/data-controller/select-all-checkbox";
import { DataControllerSelectRowCheckbox } from "../components/data-controller/select-row-checkbox";
import { DataControllerTable } from "../components/data-controller/table";
import { dataControllerFeatures } from "../features/data-controller";
import {
  TableCellComponents,
  TableComponents,
  TableHeaderComponents,
} from "../types";

export const dataController = createTableHook({
  features: tableFeatures(dataControllerFeatures),
  tableComponents: {
    ActiveFilters: DataControllerActiveFilters,
    ActiveFiltersContainer,
    ClearFilters: DataControllerClearFilters,
    ColumnSortMenu: DataControllerColumnSortMenu,
    FilterSelector: DataControllerFilterSelector,
    Layout: DataControllerLayout,
    PageSizeSelector: DataControllerPageSizeSelector,
    Pagination: DataControllerPagination,
    ResetTableButton: DataControllerResetTableButton,
    Search: DataControllerSearch,
    Table: DataControllerTable,
  } satisfies TableComponents,
  headerComponents: {
    ColumnHeader: DataControllerColumnHeader,
    SelectAllCheckbox: DataControllerSelectAllCheckbox,
  } satisfies TableHeaderComponents,
  cellComponents: {
    RowNumber: DataControllerRowNumber,
    SelectRowCheckbox: DataControllerSelectRowCheckbox,
  } satisfies TableCellComponents,
});

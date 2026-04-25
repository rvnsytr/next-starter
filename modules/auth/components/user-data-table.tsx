"use client";

import {
  DataControllerPageSize,
  DataControllerPaginationNav,
  DataControllerSearch,
  DataControllerSorting,
  DataControllerVisibility,
} from "@/core/components/data-controller";
import {
  ActiveFilters,
  ActiveFiltersContainer,
  ClearFilters,
  FilterSelector,
  ResetFilters,
} from "@/core/components/filters";
import { ButtonGroup } from "@/core/components/ui/button-group";
import { Separator } from "@/core/components/ui/separator";
import { useDataController } from "@/core/hooks/use-data-controller";
import { listUsers } from "../actions";
import { getUserColumns } from "./user-column";

export function UserDataTable() {
  const { table } = useDataController({
    mode: "auto",
    columns: () => getUserColumns(),
    query: {
      key: "/auth/admin/list-users",
      fetcher: async () => await listUsers(),
      immutable: true,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <ButtonGroup>
          <DataControllerVisibility table={table} align="start" />
          <DataControllerSorting table={table} />
          <FilterSelector table={table} />
        </ButtonGroup>

        <DataControllerPaginationNav table={table} />
        <DataControllerPageSize table={table} className="w-fit" />
        <ResetFilters table={table} />
        <DataControllerSearch table={table} />
      </div>

      {table.getState().columnFilters.length > 0 && (
        <ActiveFiltersContainer>
          <ClearFilters table={table} />
          <Separator orientation="vertical" className="h-4" />
          <ActiveFilters table={table} />
        </ActiveFiltersContainer>
      )}

      <pre>{JSON.stringify(table.getRowModel().rows.length, null, 2)}</pre>
      <Separator />
      <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
    </div>
  );
}

import { useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  FilterFn,
  SortingFn,
} from "@tanstack/react-table";

declare module "@tanstack/table-core" {
  interface SortingFns {
    stringDate: SortingFn<unknown>;
  }
  interface FilterFns {
    numToString: FilterFn<unknown>;
    customGlobalFilter: FilterFn<unknown>;
  }
}

export default function Table<T>({
  columns,
  data,
}: {
  columns: ColumnDef<T, any>[];
  data: T[];
}) {
  const sortingInitialState: SortingState = [{ id: "created_at", desc: true }];
  const [sorting, setSorting] = useState<SortingState>(sortingInitialState);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    sortingFns: {
      stringDate: (rowA, rowB, columnId: string) => {
        const valueA = rowA.getValue(columnId) as string;
        const valueB = rowB.getValue(columnId) as string;

        const [dateA, timeA] = valueA.split(" ");
        const a = new Date(
          +dateA.split("/")[2],
          +dateA.split("/")[1] - 1,
          +dateA.split("/")[0],
          +timeA.split(":")[0],
          +timeA.split(":")[1],
          +timeA.split(":")[2]
        );

        const [dateB, timeB] = valueB.split(" ");
        const b = new Date(
          +dateB.split("/")[2],
          +dateB.split("/")[1] - 1,
          +dateB.split("/")[0],
          +timeB.split(":")[0],
          +timeB.split(":")[1],
          +timeB.split(":")[2]
        );

        if (a < b) return -1;
        if (a === b) return 0;
        if (a > b) return 1;
        return 0;
      },
    },
    filterFns: {
      customGlobalFilter: (row, columnId, filterValue: string) => {
        return String(row.getValue(columnId)).includes(filterValue);
      },
      numToString: (row, columnId, filterValue: string) => {
        return String(row.getValue(columnId))
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      },
    },
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "customGlobalFilter",
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex w-full flex-col p-2">
      <div className="mb-2 mr-auto flex w-full items-center justify-between">
        <input
          value={globalFilter ?? ""}
          onChange={(evt) => setGlobalFilter(String(evt.target.value))}
          className="rounded-[8px] border p-2 text-light-50"
          placeholder="Filtrar todos..."
        />
        <div>
          <span className="mr-2">Por página:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(evt) => {
              table.setPageSize(+evt.target.value);
            }}
            className="rounded border p-1 text-light-50"
          >
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <table className="w-full border-separate border-spacing-0">
        <thead className="bg-light-900 text-light-50 dark:bg-dark-500 dark:text-dark-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-zinc-300 p-3 dark:border-zinc-500"
                >
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : "",
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {
                      {
                        asc: " ↑",
                        desc: " ↓",
                      }[(header.column.getIsSorted() as string) ?? null]
                    }
                  </div>
                  {header.column.getCanFilter() ? (
                    <input
                      type="text"
                      onChange={(evt) =>
                        header.column.setFilterValue(evt.target.value)
                      }
                      value={(header.column.getFilterValue() ?? "") as string}
                      className="mt-1 w-full rounded-[8px] border py-1 px-2 font-normal text-light-50 shadow"
                      placeholder={`Filtrar ${header.column.columnDef.header}`}
                    />
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-zinc-800 dark:text-zinc-900">
          {table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id}
              className={`${
                i % 2 === 0
                  ? "bg-zinc-50 hover:bg-blue-100 dark:bg-zinc-200 dark:hover:bg-indigo-200"
                  : "bg-zinc-200 hover:bg-blue-200/75 dark:bg-zinc-300 dark:hover:bg-indigo-200/95"
              } transition-all`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border border-zinc-300 p-3 dark:border-zinc-600"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex items-center gap-3 text-sm">
        <div className="flex gap-2">
          <button
            className="rounded border bg-zinc-300 p-1 text-light-50 hover:bg-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:text-zinc-100 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-800 dark:disabled:bg-zinc-500"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
              <path
                fillRule="evenodd"
                d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
          </button>
          <button
            className="rounded border bg-zinc-300 p-1 text-light-50 hover:bg-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:text-zinc-100 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-800 dark:disabled:bg-zinc-500"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </button>
          <button
            className="rounded border bg-zinc-300 p-1 text-light-50 hover:bg-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:text-zinc-100 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-800 dark:disabled:bg-zinc-500"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </button>
          <button
            className="rounded border bg-zinc-300 p-1 text-light-50 hover:bg-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:text-zinc-100 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-800 dark:disabled:bg-zinc-500"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
              />
              <path
                fillRule="evenodd"
                d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
        </div>
        <div>
          Página: {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
}

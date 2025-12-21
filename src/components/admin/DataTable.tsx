"use client";

import React from "react";

export type Column<T> = {
    key: keyof T;
    header: string;
    render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    getRowIdAction: (row: T) => string;
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChangeAction: (page: number) => void;
    renderRowAction?: (row: T) => React.ReactNode;
    emptyMessage?: string;

    // orden
    sortKey?: keyof T | null;
    sortDirection?: "asc" | "desc";
    onSortChangeAction?: (key: keyof T) => void;
};

export function DataTable<T>({
                                 columns,
                                 data,
                                 getRowIdAction,
                                 page,
                                 pageSize,
                                 totalCount,
                                 onPageChangeAction,
                                 renderRowAction,
                                 emptyMessage = "No data.",
                                 sortKey = null,
                                 sortDirection,
                                 onSortChangeAction,
                             }: DataTableProps<T>) {
    const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
    const isPaginated = totalCount > pageSize;

    const colCount = columns.length + (renderRowAction ? 1 : 0);

    const goPrevPage = () => onPageChangeAction(Math.max(0, page - 1));
    const goNextPage = () => onPageChangeAction(Math.min(pageCount - 1, page + 1));

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* HEADER */}
            <div className="border-b border-slate-100 px-3 pt-2 pb-2 sm:px-4">
                <div
                    className="grid gap-3 text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
                >
                    {columns.map((col) => {
                        const isSorted = sortKey === col.key;
                        const dir = sortDirection ?? "asc";

                        return (
                            <button
                                key={String(col.key)}
                                type="button"
                                onClick={() => onSortChangeAction && onSortChangeAction(col.key)}
                                className={`flex items-center gap-1 text-left ${
                                    isSorted
                                        ? "text-slate-900"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                <span>{col.header}</span>
                                {isSorted && (
                                    <span className="text-[9px]">
                    {dir === "asc" ? "▲" : "▼"}
                  </span>
                                )}
                            </button>
                        );
                    })}

                    {renderRowAction && (
                        <span className="text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Actions
            </span>
                    )}
                </div>
            </div>

            {/* BODY */}
            <div className="h-72 overflow-y-auto sm:h-80 md:h-96">
                {data.length === 0 ? (
                    <div className="flex h-full items-center justify-center px-4 py-6 text-xs text-slate-400">
                        {emptyMessage}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {data.map((row) => {
                            const id = getRowIdAction(row);
                            return (
                                <div
                                    key={id}
                                    className="grid items-center gap-3 px-3 py-2 sm:px-4"
                                    //I want that if we click the row, we will be redirected to /admin/projects/[id]
                                    style={{
                                        gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
                                    }}
                                >
                                    {columns.map((col) => (
                                        <div
                                            key={String(col.key)}
                                            className="truncate text-[11px] text-slate-700 sm:text-xs"
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : String((row as any)[col.key] ?? "")}
                                        </div>
                                    ))}

                                    {renderRowAction && (
                                        <div className="flex justify-end gap-2 text-[11px] sm:text-xs">
                                            {renderRowAction(row)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="border-t border-slate-100 px-3 py-2 sm:px-4">
                <div className="flex flex-col items-center justify-between gap-2 text-[11px] text-slate-500 sm:flex-row sm:text-xs">
                    <div>
                        Showing{" "}
                        {totalCount === 0 ? 0 : page * pageSize + 1} –{" "}
                        {Math.min((page + 1) * pageSize, totalCount)} of {totalCount}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goPrevPage}
                            disabled={!isPaginated || page === 0}
                            className={`rounded-full px-3 py-1 font-medium ${
                                !isPaginated || page === 0
                                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                    : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                        >
                            Prev
                        </button>
                        <span>
              Page {page + 1} of {pageCount}
            </span>
                        <button
                            onClick={goNextPage}
                            disabled={!isPaginated || page === pageCount - 1}
                            className={`rounded-full px-3 py-1 font-medium ${
                                !isPaginated || page === pageCount - 1
                                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                    : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

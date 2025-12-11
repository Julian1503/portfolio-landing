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
    getRowId: (row: T) => string;
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    renderRowActions?: (row: T) => React.ReactNode;
    emptyMessage?: string;
    maxVisibleColumns?: number;
};

export function DataTable<T>({
                                 columns,
                                 data,
                                 getRowId,
                                 page,
                                 pageSize,
                                 totalCount,
                                 onPageChange,
                                 renderRowActions,
                                 emptyMessage = "No data.",
                                 maxVisibleColumns = 5,
                             }: DataTableProps<T>) {
    const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
    const isPaginated = totalCount > pageSize;

    const [colOffset, setColOffset] = React.useState(0);

    const totalCols = columns.length;
    const canScrollCols = totalCols > maxVisibleColumns;

    const maxOffset = Math.max(0, totalCols - maxVisibleColumns);
    const offset = Math.min(colOffset, maxOffset);

    const visibleColumns = canScrollCols
        ? columns.slice(offset, offset + maxVisibleColumns)
        : columns;

    const colCount = visibleColumns.length + (renderRowActions ? 1 : 0);

    const gridColsClass =
        colCount === 1
            ? "grid-cols-1"
            : colCount === 2
                ? "grid-cols-2"
                : colCount === 3
                    ? "grid-cols-3"
                    : colCount === 4
                        ? "grid-cols-4"
                        : colCount === 5
                            ? "grid-cols-5"
                            : "grid-cols-6";

    const goPrevPage = () => onPageChange(Math.max(0, page - 1));
    const goNextPage = () => onPageChange(Math.min(pageCount - 1, page + 1));

    const goPrevCols = () => setColOffset((prev) => Math.max(0, prev - 1));
    const goNextCols = () =>
        setColOffset((prev) => Math.min(maxOffset, prev + 1));

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* SCROLL HORIZONTAL PARA MOBILE */}
            <div className="overflow-x-auto">
                <div className="min-w-[640px]">
                    {/* HEADER */}
                    <div className="border-b border-slate-100 px-3 sm:px-4 pt-2 pb-2">
                        {canScrollCols && (
                            <div className="flex justify-end mb-1 gap-1 text-[11px]">
                                <button
                                    onClick={goPrevCols}
                                    disabled={offset === 0}
                                    className={`h-6 w-6 rounded-full border text-xs font-semibold ${
                                        offset === 0
                                            ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50"
                                            : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={goNextCols}
                                    disabled={offset === maxOffset}
                                    className={`h-6 w-6 rounded-full border text-xs font-semibold ${
                                        offset === maxOffset
                                            ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50"
                                            : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    ›
                                </button>
                            </div>
                        )}

                        <div
                            className={`grid ${gridColsClass} gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500`}
                        >
                            {visibleColumns.map((col) => (
                                <span key={String(col.key)}>{col.header}</span>
                            ))}
                            {renderRowActions && (
                                <span className="text-right">Actions</span>
                            )}
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="h-72 sm:h-80 md:h-96 overflow-y-auto">
                        {data.map((row) => {
                            const id = getRowId(row);
                            return (
                                <div
                                    key={id}
                                    className={`grid ${gridColsClass} gap-3 px-3 sm:px-4 py-2 text-xs items-center border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60`}
                                >
                                    {visibleColumns.map((col, index) => (
                                        <div
                                            key={String(col.key)}
                                            className={
                                                index === 0
                                                    ? "font-semibold text-slate-900 truncate"
                                                    : "text-slate-700 truncate"
                                            }
                                        >
                                            {col.render ? col.render(row) : (row as any)[col.key]}
                                        </div>
                                    ))}
                                    {renderRowActions && (
                                        <div className="flex justify-end gap-2 text-[11px]">
                                            {renderRowActions(row)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {data.length === 0 && (
                            <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                {emptyMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PAGINACIÓN */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-3 sm:px-4 py-2 text-[11px] text-slate-500">
        <span>
          Page {page + 1} of {pageCount}
        </span>
                <div className="flex gap-2">
                    <button
                        onClick={goPrevPage}
                        disabled={!isPaginated || page === 0}
                        className={`rounded-full px-3 py-1 font-medium ${
                            !isPaginated || page === 0
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                    >
                        Prev
                    </button>
                    <button
                        onClick={goNextPage}
                        disabled={!isPaginated || page === pageCount - 1}
                        className={`rounded-full px-3 py-1 font-medium ${
                            !isPaginated || page === pageCount - 1
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
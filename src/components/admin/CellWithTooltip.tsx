export type CellWithTooltipProps = {
    value: string;
    className?: string;
};

export function CellWithTooltip({
                                    value,
                                    className = "",
                                }: CellWithTooltipProps) {
    return (
        <div className="relative group max-w-full">
            <div className={`truncate ${className}`} title={value}>
                {value}
            </div>

            <div
                className="
          pointer-events-none absolute z-50 hidden
          group-hover:block
          max-w-xs
          rounded-md bg-slate-900 px-3 py-2
          text-[11px] text-white shadow-lg
          -top-2 left-1/2 -translate-x-1/2 -translate-y-full
          whitespace-normal
        "
            >
                {value}
            </div>
        </div>
    );
}
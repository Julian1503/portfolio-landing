export function isNonEmptyString(v: unknown): v is string {
    return typeof v === "string" && v.trim().length > 0;
}

export function parseOptionalString(v: unknown): string | undefined {
    if (v === undefined) return undefined;
    if (typeof v !== "string") return undefined;
    const t = v.trim();
    return t.length ? t : undefined;
}

export function parseOptionalNumber(v: unknown): number | undefined {
    if (v === undefined) return undefined;
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
        const n = Number(v);
        if (Number.isFinite(n)) return n;
    }
    return undefined;
}

export function parseEnum<T extends readonly string[]>(
    allowed: T,
    v: unknown
): T[number] | undefined {
    if (v === undefined) return undefined;
    if (typeof v !== "string") return undefined;
    return (allowed as readonly string[]).includes(v) ? (v as T[number]) : undefined;
}

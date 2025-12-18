export function assertReorderPayloadCompleteAndValid(
    existingIds: string[],
    incomingIds: string[]
) {
    const existing = new Set(existingIds);
    const uniqueIncoming = Array.from(new Set(incomingIds));

    if (uniqueIncoming.length !== existingIds.length) {
        throw new Error("Reorder payload must include all items exactly once");
    }

    for (const id of uniqueIncoming) {
        if (!existing.has(id)) throw new Error("Reorder payload includes invalid id");
    }

    return uniqueIncoming;
}

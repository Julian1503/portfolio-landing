import { NextRequest, NextResponse } from "next/server";
import {reorderProjectImages} from "@/lib/projectImages.service";

type Params = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const body = (await req.json()) as { imageIds?: unknown };

        if (!Array.isArray(body.imageIds) || !body.imageIds.every((x) => typeof x === "string")) {
            return NextResponse.json({ error: "imageIds must be string[]" }, { status: 400 });
        }

        const updated = await reorderProjectImages(params.id, body.imageIds);

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error reordering project images", error);

        const message = error instanceof Error ? error.message : "Failed to reorder project images";
        const status = message.includes("payload") || message.includes("invalid") ? 400 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

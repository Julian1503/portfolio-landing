import { NextRequest, NextResponse } from "next/server";
import {reorderProjectPosts} from "@/lib/projectPost.service";

type Params = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const body = (await req.json()) as { postIds?: unknown };

        if (!Array.isArray(body.postIds) || !body.postIds.every((x) => typeof x === "string")) {
            return NextResponse.json({ error: "postIds must be string[]" }, { status: 400 });
        }

        const updated = await reorderProjectPosts(params.id, body.postIds);

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error reordering project posts", error);

        const message = error instanceof Error ? error.message : "Failed to reorder project posts";
        const status = message.includes("payload") || message.includes("invalid") ? 400 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

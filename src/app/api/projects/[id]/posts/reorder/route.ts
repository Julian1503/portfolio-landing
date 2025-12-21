import { NextRequest, NextResponse } from "next/server";
import {reorderProjectPosts} from "@/lib/projectPost.service";

type RouteContext = {
    params: Promise<{ id: string }>;
};
export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        const body = (await req.json()) as { postIds?: unknown };

        if (!Array.isArray(body.postIds) || !body.postIds.every((x) => typeof x === "string")) {
            return NextResponse.json({ error: "postIds must be string[]" }, { status: 400 });
        }
        const {id} = await params;
        const updated = await reorderProjectPosts(id, body.postIds);

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error reordering project posts", error);

        const message = error instanceof Error ? error.message : "Failed to reorder project posts";
        const status = message.includes("payload") || message.includes("invalid") ? 400 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

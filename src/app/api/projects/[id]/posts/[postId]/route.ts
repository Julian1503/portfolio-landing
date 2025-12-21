import { NextRequest, NextResponse } from "next/server";
import { updateProjectPost, deleteProjectPost } from "@/lib/projectPost.service";
import {invalidateProjectsCache} from "@/lib/cache/cacheUtils";

type RouteContext = {
    params: Promise<{ id: string; postId: string }>;
};
export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        const { id, postId } = await params;
        const body = (await req.json()) as {
            slug?: unknown;
            title?: unknown;
            content?: unknown;
            order?: unknown;
            published?: unknown;
        };

        const updated = await updateProjectPost(id, postId, {
            slug: typeof body.slug === "string" ? body.slug : undefined,
            title: typeof body.title === "string" ? body.title : undefined,
            content: typeof body.content === "string" ? body.content : undefined,
            order: typeof body.order === "number" ? body.order : undefined,
            published: typeof body.published === "boolean" ? body.published : undefined,
        });

        invalidateProjectsCache();

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating project post", error);

        const message = error instanceof Error ? error.message : "Failed to update project post";
        const status = message.includes("does not belong") ? 400 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

export async function DELETE(_: NextRequest, { params }: RouteContext) {
    try {
        const { id, postId } = await params;
        await deleteProjectPost(id, postId);

        invalidateProjectsCache();

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting project post", error);

        const message = error instanceof Error ? error.message : "Failed to delete project post";
        const status = message.includes("does not belong") ? 400 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

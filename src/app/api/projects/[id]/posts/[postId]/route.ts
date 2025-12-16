import { NextRequest, NextResponse } from "next/server";
import {updateProjectPost, deleteProjectPost} from "@/lib/projectPost.service";

type Params = { params: { id: string; postId: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const body = (await req.json()) as {
            slug?: unknown;
            title?: unknown;
            content?: unknown;
            order?: unknown;
            published?: unknown;
        };

        const updated = await updateProjectPost(params.id, params.postId, {
            slug: typeof body.slug === "string" ? body.slug : undefined,
            title: typeof body.title === "string" ? body.title : undefined,
            content: typeof body.content === "string" ? body.content : undefined,
            order: typeof body.order === "number" ? body.order : undefined,
            published: typeof body.published === "boolean" ? body.published : undefined,
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating project post", error);

        const message = error instanceof Error ? error.message : "Failed to update project post";
        const status = message.includes("does not belong") ? 400 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

export async function DELETE(_: NextRequest, { params }: Params) {
    try {
        await deleteProjectPost(params.id, params.postId);

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting project post", error);

        const message = error instanceof Error ? error.message : "Failed to delete project post";
        const status = message.includes("does not belong") ? 400 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

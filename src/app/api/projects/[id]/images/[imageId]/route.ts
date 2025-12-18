import { NextRequest, NextResponse } from "next/server";
import {updateProjectImage, deleteProjectImage } from "@/lib/project/projectImages.service";

type Params = { params: { id: string; imageId: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const body = (await req.json()) as {
            url?: unknown;
            alt?: unknown;
            caption?: unknown;
            kind?: unknown;
            order?: unknown;
        };

        const updated = await updateProjectImage(params.id, params.imageId, {
            url: typeof body.url === "string" ? body.url : undefined,
            alt: body.alt === null ? null : typeof body.alt === "string" ? body.alt : undefined,
            caption: body.caption === null ? null : typeof body.caption === "string" ? body.caption : undefined,
            kind: typeof body.kind === "string" ? (body.kind as any) : undefined,
            order: typeof body.order === "number" ? body.order : undefined,
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating project image", error);

        const message = error instanceof Error ? error.message : "Failed to update project image";
        const status = message.includes("does not belong") ? 400 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

export async function DELETE(_: NextRequest, { params }: Params) {
    try {
        await deleteProjectImage(params.id, params.imageId);
        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting project image", error);

        const message = error instanceof Error ? error.message : "Failed to delete project image";
        const status = message.includes("does not belong") ? 400 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

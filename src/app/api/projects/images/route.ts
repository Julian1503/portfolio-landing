import { NextRequest, NextResponse } from "next/server";
import {addProjectImage} from "@/lib/projectImages.service";

type Params = { params: { id: string } };

function isNonEmptyString(v: unknown): v is string {
    return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: NextRequest, { params }: Params) {
    try {
        const body = (await req.json()) as {
            url?: unknown;
            alt?: unknown;
            caption?: unknown;
            kind?: unknown;
            order?: unknown;
        };

        if (!isNonEmptyString(body.url)) {
            return NextResponse.json({ error: "Missing field: url" }, { status: 400 });
        }

        const created = await addProjectImage(params.id, {
            url: body.url,
            alt: typeof body.alt === "string" ? body.alt : undefined,
            caption: typeof body.caption === "string" ? body.caption : undefined,
            kind: typeof body.kind === "string" ? (body.kind as any) : undefined,
            order: typeof body.order === "number" ? body.order : undefined,
        });

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("Error creating project image", error);
        return NextResponse.json({ error: "Failed to create project image" }, { status: 500 });
    }
}

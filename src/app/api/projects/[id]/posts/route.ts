import { NextRequest, NextResponse } from "next/server";
import {addProjectPost} from "@/lib/projectPost.service";

type Params = { params: { id: string } };

function isNonEmptyString(v: unknown): v is string {
    return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: NextRequest, { params }: Params) {
    try {
        const body = (await req.json()) as {
            slug?: unknown;
            title?: unknown;
            content?: unknown;
            order?: unknown;
            published?: unknown;
        };

        if (!isNonEmptyString(body.slug)) {
            return NextResponse.json({ error: "Missing field: slug" }, { status: 400 });
        }
        if (!isNonEmptyString(body.title)) {
            return NextResponse.json({ error: "Missing field: title" }, { status: 400 });
        }
        if (!isNonEmptyString(body.content)) {
            return NextResponse.json({ error: "Missing field: content" }, { status: 400 });
        }

        const created = await addProjectPost(params.id, {
            slug: body.slug,
            title: body.title,
            content: body.content,
            order: typeof body.order === "number" ? body.order : undefined,
            published: typeof body.published === "boolean" ? body.published : undefined,
        });

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("Error creating project post", error);

        // si querés, podemos detectar el unique constraint de prisma para devolver 409
        return NextResponse.json({ error: "Failed to create project post" }, { status: 500 });
    }
}

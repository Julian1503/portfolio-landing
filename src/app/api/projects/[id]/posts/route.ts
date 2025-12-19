import { NextRequest, NextResponse } from "next/server";
import {addProjectPost} from "@/lib/projectPost.service";
import {ProjectPostDTO} from "@/types/ProjectDTO";

type Params = {
    params: Promise<{ id: string }>
};

function isNonEmptyString(v: unknown): v is string {
    return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: NextRequest, { params }: Params) {
    try {
        const body = (await req.json()) as ProjectPostDTO;
        const {id} = await params;
        if (!isNonEmptyString(body.slug)) {
            return NextResponse.json({ error: "Missing field: slug" }, { status: 400 });
        }
        if (!isNonEmptyString(body.title)) {
            return NextResponse.json({ error: "Missing field: title" }, { status: 400 });
        }
        if (!isNonEmptyString(body.content)) {
            return NextResponse.json({ error: "Missing field: content" }, { status: 400 });
        }

        const created = await addProjectPost(id, {
            slug: body.slug,
            title: body.title,
            content: body.content,
            order: body.order,
            published:body.published,
        });

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("Error creating project post", error);

        return NextResponse.json({ error: "Failed to create project post" }, { status: 500 });
    }
}

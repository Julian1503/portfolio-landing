import { NextRequest, NextResponse } from "next/server";
import { parseCreateProjectImageBody } from "@/lib/project/projectImages.dto";
import { addProjectImage } from "@/lib/project/projectImages.service";
import { isNonEmptyString } from "@/lib/http/validators";
import {invalidateProjectsCache} from "@/lib/cache/cacheUtils";

type Params = {
    params: Promise<{ id: string }>
};

export async function POST(req: NextRequest, { params }: Params) {
    const { id } = await params;
    if (!isNonEmptyString(id)) {
        return NextResponse.json({ error: "Missing/invalid route param: id" }, { status: 400 });
    }

    let raw: any;
    try {
        raw = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = parseCreateProjectImageBody(raw);
    if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    try {
        const created = await addProjectImage(id, parsed.value);

        invalidateProjectsCache();

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("Error creating project image", error);
        return NextResponse.json({ error: "Failed to create project image" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { createProject, getProjects } from "@/lib/project/projects.service";
import type { ProjectCreateRequestDTO, ProjectDTO } from "@/types/ProjectDTO";
import {invalidateProjectsCache} from "@/lib/cache/cacheUtils";

// GET /api/projects
export async function GET() {
    try {
        const projects = await getProjects();
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

function isNonEmptyString(v: unknown): v is string {
    return typeof v === "string" && v.trim().length > 0;
}

// POST /api/projects
export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as Partial<ProjectDTO>;

        const requiredStringFields: (keyof ProjectDTO)[] = [
            "slug",
            "title",
            "tag",
            "location",
            "year",
        ];

        for (const field of requiredStringFields) {
            if (!isNonEmptyString(body[field])) {
                return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
            }
        }

        const dto: ProjectCreateRequestDTO = {
            slug: body.slug!,
            title: body.title!,
            tag: body.tag!,
            location: body.location!,
            year: body.year!,

            coverImage: body.coverImage,
            excerpt: body.excerpt,
            description: body.description,
            isFeatured: body.isFeatured ?? false,

            status: body.status ?? "CONCEPT",
            type: body.type,
            role: body.role,
            client: body.client,
            tools: body.tools ?? [],

            images: body.images ?? [],
            posts: body.posts ?? [],
        };

        const created = await createProject(dto);

        invalidateProjectsCache();

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("Error creating project", error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}
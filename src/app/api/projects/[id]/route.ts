import { NextRequest, NextResponse } from "next/server";
import { getProjectByIdOrSlug, updateProject, deleteProject } from "@/lib/project/projects.service";
import {invalidateProjectCache, invalidateProjectsCache} from "@/lib/cache/cacheUtils";
import {ProjectWithRelations} from "@/lib/automapper/project.mapper";

type Params = {
    params: Promise<{ id: string }>
};

// GET /api/projects/:id
export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const project = await getProjectByIdOrSlug(id);

        if (!project) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        console.error("Error fetching project", error);
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}

// PUT /api/projects/:id
export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const body = (await req.json()) as ProjectWithRelations;

        const updated = await updateProject(id, body);

        // ✅ Invalidar caché después de actualizar
        invalidateProjectsCache();
        invalidateProjectCache(updated.slug);

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating project", error);
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}

// DELETE /api/projects/:id
export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const project = await getProjectByIdOrSlug(id);

        await deleteProject(id);

        invalidateProjectsCache();
        if (project) {
            invalidateProjectCache(project.slug);
        }

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting project", error);
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}

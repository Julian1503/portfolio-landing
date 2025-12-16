import { NextRequest, NextResponse } from "next/server";
import type { ProjectDTO } from "@/types/ProjectDTO";
import { getProjectById, updateProject, deleteProject } from "@/lib/projects.service";

type Params = {
    params: Promise<{ id: string }>
};

// GET /api/projects/:id
export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const project = await getProjectById(id);

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
        const body = (await req.json()) as ProjectDTO;

        const updated = await updateProject(id, body);

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
        await deleteProject(id);

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting project", error);
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}
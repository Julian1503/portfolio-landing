// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
    getProjectById,
    updateProject,
    deleteProject,
} from "@/lib/projects";
import { ProjectDTO } from "@/types/ProjectDTO";
import { entityToDto } from "@/lib/automapper/project";

function getIdFromRequest(req: NextRequest): string | null {
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const id = segments[segments.length - 1] ?? null;
    return id;
}

// GET /api/projects/:id
export async function GET(req: NextRequest) {
    try {
        const id = getIdFromRequest(req);

        if (!id) {
            return NextResponse.json(
                { error: "Missing id in URL" },
                { status: 400 }
            );
        }

        const project = await getProjectById(id);
        if (!project) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json(entityToDto(project), { status: 200 });
    } catch (error) {
        console.error("Error fetching project", error);
        return NextResponse.json(
            { error: "Failed to fetch project" },
            { status: 500 }
        );
    }
}

// PUT /api/projects/:id
export async function PUT(req: NextRequest) {
    try {
        const id = getIdFromRequest(req);

        if (!id) {
            return NextResponse.json(
                { error: "Missing id in URL" },
                { status: 400 }
            );
        }

        const body = (await req.json()) as ProjectDTO;

        const updatedProject = await updateProject(id, body);

        return NextResponse.json(entityToDto(updatedProject), { status: 200 });
    } catch (error) {
        console.error("Error updating project", error);
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/:id
export async function DELETE(req: NextRequest) {
    try {
        const id = getIdFromRequest(req);

        if (!id) {
            return NextResponse.json(
                { error: "Missing id in URL" },
                { status: 400 }
            );
        }

        const deleted = await deleteProject(id);

        return NextResponse.json(entityToDto(deleted), { status: 200 });
    } catch (error) {
        console.error("Error deleting project", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}

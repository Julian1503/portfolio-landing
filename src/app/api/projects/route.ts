// app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createProject, getProjects } from "@/lib/projects";
import { entityToDto } from "@/lib/automapper/project";
import {ProjectDTO} from "@/types/ProjectDTO";


export async function GET() {
    try {
        const projects = await getProjects();
        return NextResponse.json(
            projects.map((project) => entityToDto(project)),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching projects", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as Partial<ProjectDTO>;

        const requiredFields: (keyof ProjectDTO)[] = [
            "slug",
            "title",
            "tag",
            "location",
            "year",
            "image",
        ];

        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing field: ${field}` },
                    { status: 400 }
                );
            }
        }

        const createdProject = await createProject(body as ProjectDTO);

        return NextResponse.json(entityToDto(createdProject), { status: 201 });
    } catch (error) {
        console.error("Error creating projects", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}

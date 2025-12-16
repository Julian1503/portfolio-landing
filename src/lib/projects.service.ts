import prisma from "@/lib/prisma";
import {ProjectDTO, ProjectCardDTO, type ProjectCreateRequestDTO} from "@/types/ProjectDTO";
import {mapProjectToCardDTO, mapProjectToDTO} from "@/lib/automapper/project.mapper";

export async function getProjects(): Promise<ProjectCardDTO[]> {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    });

    return projects.map(mapProjectToCardDTO);
}

export async function getProjectById(id: string): Promise<ProjectDTO | null> {
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            images: { orderBy: { order: "asc" } },
            posts: { orderBy: { order: "asc" } },
        },
    });

    if (!project) return null;

    return mapProjectToDTO(project);
}

export async function createProject(dto: ProjectCreateRequestDTO): Promise<ProjectDTO> {
    const project = await prisma.project.create({
        data: {
            slug: dto.slug,
            title: dto.title,
            tag: dto.tag,
            location: dto.location,
            year: dto.year,

            coverImage: dto.coverImage,
            excerpt: dto.excerpt,
            description: dto.description,
            isFeatured: dto.isFeatured,
            status: dto.status,
            type: dto.type,
            role: dto.role,
            client: dto.client,
            tools: dto.tools,
        },
        include: {
            images: true,
            posts: true,
        },
    });

    return mapProjectToDTO(project);
}

export async function updateProject(
    id: string,
    dto: ProjectDTO
): Promise<ProjectDTO> {
    const project = await prisma.project.update({
        where: { id },
        data: {
            slug: dto.slug,
            title: dto.title,
            tag: dto.tag,
            location: dto.location,
            year: dto.year,

            coverImage: dto.coverImage,
            excerpt: dto.excerpt,
            description: dto.description,

            status: dto.status,
            type: dto.type,
            role: dto.role,
            client: dto.client,
            tools: dto.tools,
        },
        include: {
            images: true,
            posts: true,
        },
    });

    return mapProjectToDTO(project);
}

export async function deleteProject(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } });
}

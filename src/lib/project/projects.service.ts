import prisma from "@/lib/prisma";
import {ProjectDTO, ProjectCardDTO, type ProjectCreateRequestDTO} from "@/types/ProjectDTO";
import {mapProjectToCardDTO, mapProjectToDTO, ProjectWithRelations} from "@/lib/automapper/project.mapper";

type ProjectWritableFields = Pick<
    ProjectCreateRequestDTO,
    | "slug"
    | "title"
    | "tag"
    | "location"
    | "year"
    | "coverImage"
    | "excerpt"
    | "description"
    | "isFeatured"
    | "status"
    | "type"
    | "role"
    | "client"
    | "tools"
>;

const projectRelationsInclude = {
    images: true,
    posts: true,
};

function mapProjectWriteData(dto: ProjectWritableFields) {
    return {
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
    };
}

export async function getProjects(): Promise<ProjectCardDTO[]> {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    });

    return projects.map(mapProjectToCardDTO);
}

export async function getProjectByIdOrSlug(idOrSlug: string): Promise<ProjectDTO | null> {
    // Intenta por slug primero (más común en URLs públicas)
    let project = await prisma.project.findUnique({
        where: { slug: idOrSlug },
        include: {
            images: { orderBy: { order: "asc" } },
            posts: { orderBy: { order: "asc" } },
        },
    });

    // Si no existe, intenta por ID
    if (!project) {
        project = await prisma.project.findUnique({
            where: { id: idOrSlug },
            include: {
                images: { orderBy: { order: "asc" } },
                posts: { orderBy: { order: "asc" } },
            },
        });
    }

    if (!project) return null;

    return mapProjectToDTO(project);
}

export async function createProject(dto: ProjectCreateRequestDTO): Promise<ProjectDTO> {
    const project = await prisma.project.create({
        data: mapProjectWriteData(dto),
        include: projectRelationsInclude,
    });

    return mapProjectToDTO(project);
}

export async function updateProject(
    id: string,
    dto: ProjectWithRelations
): Promise<ProjectDTO> {
    const project = await prisma.project.update({
        where: { id },
        data: mapProjectWriteData(dto),
        include: projectRelationsInclude,
    });

    return mapProjectToDTO(project);
}

export async function deleteProject(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } });
}

import prisma from "@/lib/prisma";
import { Project } from "../../generated/prisma/client";
import { ProjectDTO } from "@/types/ProjectDTO";

export async function getProjects(): Promise<Project[]> {
    return prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function createProject(dto: ProjectDTO): Promise<Project> {
    return prisma.project.create({
        data: {
            slug: dto.slug,
            title: dto.title,
            tag: dto.tag,
            location: dto.location,
            year: dto.year,
            image: dto.image,
        },
    });
}

export async function deleteProject(id: string) {
    console.log("id: "+id);
    return prisma.project.delete({ where: { id: id } });
}

export async function updateProject(id: string, dto: ProjectDTO) {
    return prisma.project.update({
        where: { id },
        data: {
            slug: dto.slug,
            title: dto.title,
            tag: dto.tag,
            location: dto.location,
            year: dto.year,
            image: dto.image,
        },
    })
}

export async function getProjectById(id: string) {
    return prisma.project.findUnique({where: {id : id}})
}

// src/lib/cache/projectCache.ts
import { unstable_cache } from 'next/cache';
import prisma from "@/lib/prisma";
import { mapProjectToDTO } from "@/lib/automapper/project.mapper";
import type { ProjectDTO } from "@/types/ProjectDTO";

type AdjacentProjects = {
    prev: { slug: string; title: string } | null;
    next: { slug: string; title: string } | null;
};

type ProjectWithAdjacent = {
    project: ProjectDTO;
    adjacent: AdjacentProjects;
} | null;

async function getProjectWithAdjacentUncached(slug: string): Promise<ProjectWithAdjacent> {
    // 1. Query principal: proyecto + relaciones
    const project = await prisma.project.findFirst({
        where: {
            OR: [
                { slug: slug },
                { id: slug }
            ]
        },
        include: {
            images: { orderBy: { order: "asc" } },
            posts: {
                where: { published: true },
                orderBy: { order: "asc" }
            },
        },
    });

    if (!project) return null;

    const [prev, next] = await Promise.all([
        prisma.project.findFirst({
            where: { createdAt: { lt: project.createdAt } },
            orderBy: { createdAt: "desc" },
            select: { slug: true, title: true }
        }),
        prisma.project.findFirst({
            where: { createdAt: { gt: project.createdAt } },
            orderBy: { createdAt: "asc" },
            select: { slug: true, title: true }
        })
    ]);

    return {
        project: mapProjectToDTO(project),
        adjacent: { prev, next }
    };
}

// ✅ Versión con caché
export const getCachedProject = unstable_cache(
    getProjectWithAdjacentUncached,
    ['project-detail'],
    {
        revalidate: 3600,
        tags: ['projects']
    }
);

async function getProjectsListUncached() {
    return prisma.project.findMany({
        orderBy: {createdAt: "desc"},
        select: {
            id: true,
            slug: true,
            title: true,
            tag: true,
            location: true,
            year: true,
            isFeatured: true,
            coverImage: true,
            excerpt: true,
        }
    });
}

export const getCachedProjectsList = unstable_cache(
    getProjectsListUncached,
    ['projects-list'],
    {
        revalidate: 3600,
        tags: ['projects']
    }
);
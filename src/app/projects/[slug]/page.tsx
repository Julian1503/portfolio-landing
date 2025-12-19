import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProjectDetailClient } from "@/components/ProjectDetail/ProjectDetailClient";
import { mapProjectToDTO } from "@/lib/automapper/project.mapper";

type Props = {
    params: Promise<{ slug: string }>;
};

async function getProjectBySlug(slug: string) {
    // Intenta buscar por slug primero
    let project = await prisma.project.findUnique({
        where: { slug },
        include: {
            images: { orderBy: { order: "asc" } },
            posts: {
                where: { published: true },
                orderBy: { order: "asc" }
            },
        },
    });

    // Si no existe, intenta por ID (por si acaso alguien usa el ID)
    if (!project) {
        project = await prisma.project.findUnique({
            where: { id: slug },
            include: {
                images: { orderBy: { order: "asc" } },
                posts: {
                    where: { published: true },
                    orderBy: { order: "asc" }
                },
            },
        });
    }

    if (!project) return null;
    return mapProjectToDTO(project);
}

async function getAdjacentProjects(currentSlug: string) {
    const allProjects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        select: { slug: true, title: true },
    });

    const currentIndex = allProjects.findIndex((p) => p.slug === currentSlug);

    const prev = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
    const next = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

    return { prev, next };
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    return {
        title: `${project.title} | Portfolio`,
        description: project.excerpt || project.description || `${project.tag} in ${project.location}`,
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params;

    const [project, adjacent] = await Promise.all([
        getProjectBySlug(slug),
        getAdjacentProjects(slug),
    ]);

    if (!project) {
        notFound();
    }

    return <ProjectDetailClient project={project} adjacent={adjacent} />;
}
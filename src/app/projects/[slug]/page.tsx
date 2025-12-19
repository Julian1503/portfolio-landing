import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProjectDetailClient } from "@/components/ProjectDetail/ProjectDetailClient";
import { mapProjectToDTO } from "@/lib/automapper/project.mapper";

type Props = {
    params: Promise<{ slug: string }>;
};

async function getProjectWithAdjacent(slug: string) {
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

    // 2. Query de adyacentes: más eficiente con cursores
    const [prev, next] = await Promise.all([
        // Proyecto anterior
        prisma.project.findFirst({
            where: { createdAt: { lt: project.createdAt } },
            orderBy: { createdAt: "desc" },
            select: { slug: true, title: true }
        }),
        // Proyecto siguiente
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

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const data = await getProjectWithAdjacent(slug);

    if (!data) {
        return {
            title: "Project Not Found",
        };
    }

    const { project } = data;

    return {
        title: `${project.title} | Portfolio`,
        description: project.excerpt || project.description || `${project.tag} in ${project.location}`,
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params;
    const data = await getProjectWithAdjacent(slug);

    if (!data) {
        notFound();
    }

    return <ProjectDetailClient project={data.project} adjacent={data.adjacent} />;
}
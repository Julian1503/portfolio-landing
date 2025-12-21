import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProjectDetailClient } from "@/components/ProjectDetail/ProjectDetailClient";
import { mapProjectToDTO } from "@/lib/automapper/project.mapper";
import {Metadata} from "next";

type PageProps = {
    params: Promise<{ slug: string }>;
};

async function getProject(slugOrId: string) {
    return (await prisma.project.findUnique({
            where: { slug: slugOrId },
            include: {
                images: { orderBy: { order: "asc" } },
                posts: {
                    where: { published: true },
                    orderBy: { order: "asc" },
                },
            },
        })) ??
        (await prisma.project.findUnique({
            where: { id: slugOrId },
            include: {
                images: { orderBy: { order: "asc" } },
                posts: {
                    where: { published: true },
                    orderBy: { order: "asc" },
                },
            },
        }));

}

async function getAdjacentProjects(createdAt: Date, id: string) {
    const [prev, next] = await Promise.all([
        prisma.project.findFirst({
            where: {
                OR: [
                    { createdAt: { lt: createdAt } },
                    { createdAt, id: { lt: id } },
                ],
            },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            select: { slug: true, title: true },
        }),
        prisma.project.findFirst({
            where: {
                OR: [
                    { createdAt: { gt: createdAt } },
                    { createdAt, id: { gt: id } },
                ],
            },
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
            select: { slug: true, title: true },
        }),
    ]);

    return { prev, next };
}

export async function generateMetadata({ params }: PageProps) : Promise<Metadata> {
    const { slug } = await params;

    const project = await prisma.project.findUnique({
        where: { slug },
        select: {
            title: true,
            excerpt: true,
            description: true,
            tag: true,
            location: true,
        },
    });

    if (!project) {
        return { title: "Project Not Found" };
    }

    return {
        title: `${project.title} | Portfolio`,
        description:
            project.excerpt ||
            project.description ||
            (project.tag && project.location
                ? `${project.tag} in ${project.location}`
                : "Project details"),
    };
}


export default async function ProjectDetailPage({ params }: PageProps) {
    const { slug } = await params;

    const data = await getProjectDetail(slug);
    if (!data) notFound();

    return (
        <ProjectDetailClient
            project={data.project}
            adjacent={data.adjacent}
        />
    );
}

async function getProjectDetail(slug: string) {
    const project = await getProject(slug);
    if (!project) return null;

    const adjacent = await getAdjacentProjects(
        project.createdAt,
        project.id
    );

    return {
        project: mapProjectToDTO(project),
        adjacent,
    };
}
import prisma from "@/lib/prisma";
import type { ProjectPostDTO } from "@/types/ProjectDTO";
import {mapProjectPostToDTO} from "@/lib/automapper/project.mapper";

export type CreateProjectPostInput = {
    slug: string;
    title: string;
    content: string;
    order?: number;
    published?: boolean;
};

export type UpdateProjectPostInput = {
    slug?: string;
    title?: string;
    content?: string;
    order?: number;
    published?: boolean;
};

export async function addProjectPost(
    projectId: string,
    input: CreateProjectPostInput
): Promise<ProjectPostDTO> {
    const maxOrder = await prisma.projectPost.aggregate({
        where: { projectId },
        _max: { order: true },
    });

    const nextOrder = (maxOrder._max.order ?? 0) + 1;

    const created = await prisma.projectPost.create({
        data: {
            projectId,
            slug: input.slug,
            title: input.title,
            content: input.content,
            published: input.published ?? true,
            order: input.order ?? nextOrder,
        },
    });

    return mapProjectPostToDTO(created);
}

export async function updateProjectPost(
    projectId: string,
    postId: string,
    input: UpdateProjectPostInput
): Promise<ProjectPostDTO> {
    const updated = await prisma.projectPost.update({
        where: { id: postId },
        data: {
            slug: input.slug,
            title: input.title,
            content: input.content,
            order: input.order,
            published: input.published,
        },
    });

    if (updated.projectId !== projectId) {
        throw new Error("Post does not belong to project");
    }

    return mapProjectPostToDTO(updated);
}

export async function deleteProjectPost(
    projectId: string,
    postId: string
): Promise<void> {
    const post = await prisma.projectPost.findUnique({ where: { id: postId } });
    if (!post) return;

    if (post.projectId !== projectId) {
        throw new Error("Post does not belong to project");
    }

    await prisma.projectPost.delete({ where: { id: postId } });
}

export async function reorderProjectPosts(
    projectId: string,
    orderedPostIds: string[]
): Promise<ProjectPostDTO[]> {
    const posts = await prisma.projectPost.findMany({
        where: { projectId },
        select: { id: true },
    });

    const existingIds = new Set(posts.map((p) => p.id));
    const uniqueIncoming = Array.from(new Set(orderedPostIds));

    if (uniqueIncoming.length !== posts.length) {
        throw new Error("Reorder payload must include all posts exactly once");
    }

    for (const id of uniqueIncoming) {
        if (!existingIds.has(id)) {
            throw new Error("Reorder payload includes invalid post id");
        }
    }

    await prisma.$transaction(
        uniqueIncoming.map((id, index) =>
            prisma.projectPost.update({
                where: { id },
                data: { order: index + 1 },
            })
        )
    );

    const updated = await prisma.projectPost.findMany({
        where: { projectId },
        orderBy: { order: "asc" },
    });

    return updated.map(mapProjectPostToDTO);
}

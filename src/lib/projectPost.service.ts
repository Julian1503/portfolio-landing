import prisma from "@/lib/prisma";
import { mapProjectPostToDTO } from "@/lib/automapper/project.mapper";
import { assertReorderPayloadCompleteAndValid } from "@/lib/utils/reorderUtils";

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

async function getNextOrderForProjectPost(projectId: string) {
    const maxOrder = await prisma.projectPost.aggregate({
        where: { projectId },
        _max: { order: true },
    });
    return (maxOrder._max.order ?? 0) + 1;
}

export async function addProjectPost(projectId: string, input: CreateProjectPostInput) {
    const nextOrder = await getNextOrderForProjectPost(projectId);

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

export async function updateProjectPost(projectId: string, postId: string, input: UpdateProjectPostInput) {
    // ✅ Seguridad: sólo actualiza si pertenece al proyecto
    const updated = await prisma.projectPost.updateMany({
        where: { id: postId, projectId },
        data: {
            slug: input.slug,
            title: input.title,
            content: input.content,
            order: input.order,
            published: input.published,
        },
    });

    if (updated.count === 0) {
        // acá elegís: throw (para 404) o return null
        throw new Error("Post not found for project");
    }

    const post = await prisma.projectPost.findUnique({ where: { id: postId } });
    // post existe seguro si count>0
    return mapProjectPostToDTO(post!);
}

export async function deleteProjectPost(projectId: string, postId: string) {
    // ✅ 1 query, seguro
    const res = await prisma.projectPost.deleteMany({
        where: { id: postId, projectId },
    });

    // si querés idempotente: no tires error si res.count === 0
    // si querés 404: throw acá
}

export async function reorderProjectPosts(projectId: string, orderedPostIds: string[]) {
    const posts = await prisma.projectPost.findMany({
        where: { projectId },
        select: { id: true },
    });

    const existingIds = posts.map((p) => p.id);
    const uniqueIncoming = assertReorderPayloadCompleteAndValid(existingIds, orderedPostIds);

    await prisma.$transaction(
        uniqueIncoming.map((id, index) =>
            prisma.projectPost.updateMany({
                where: { id, projectId },       // ✅ seguridad extra
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

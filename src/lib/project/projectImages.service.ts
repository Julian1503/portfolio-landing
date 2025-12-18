import prisma from "@/lib/prisma";
import type { ProjectImageDTO } from "@/types/ProjectDTO";
import { mapProjectImageToDTO } from "@/lib/automapper/project.mapper";
import {assertReorderPayloadCompleteAndValid} from "@/lib/utils/reorderUtils";

export type CreateProjectImageInput = {
    url: string;
    alt?: string;
    caption?: string;
    kind?: ProjectImageDTO["kind"];
    order?: number;
};

export type UpdateProjectImageInput = {
    url?: string;
    alt?: string | null;
    caption?: string | null;
    kind?: ProjectImageDTO["kind"];
    order?: number;
};

async function getNextOrderForProjectImage(projectId: string) {
    const maxOrder = await prisma.projectImage.aggregate({
        where: { projectId },
        _max: { order: true },
    });
    return (maxOrder._max.order ?? 0) + 1;
}

export async function addProjectImage(projectId: string, input: CreateProjectImageInput) {
    const nextOrder = await getNextOrderForProjectImage(projectId);

    const created = await prisma.projectImage.create({
        data: {
            projectId,
            url: input.url,
            alt: input.alt,
            caption: input.caption,
            kind: input.kind ?? "GALLERY",
            order: input.order ?? nextOrder,
        },
    });

    return mapProjectImageToDTO(created);
}

export async function updateProjectImage(projectId: string, imageId: string, input: UpdateProjectImageInput) {
    const updated = await prisma.projectImage.updateMany({
        where: { id: imageId, projectId },
        data: {
            url: input.url,
            alt: input.alt === null ? null : input.alt,
            caption: input.caption === null ? null : input.caption,
            kind: input.kind,
            order: input.order,
        },
    });

    if (updated.count === 0) {
        throw new Error("Image not found for project");
    }

    const img = await prisma.projectImage.findUnique({ where: { id: imageId } });
    return mapProjectImageToDTO(img!);
}

export async function deleteProjectImage(projectId: string, imageId: string) {
    await prisma.projectImage.deleteMany({
        where: { id: imageId, projectId },
    });
}

export async function reorderProjectImages(projectId: string, orderedImageIds: string[]) {
    const images = await prisma.projectImage.findMany({
        where: { projectId },
        select: { id: true },
    });

    const existingIds = images.map((i) => i.id);
    const uniqueIncoming = assertReorderPayloadCompleteAndValid(existingIds, orderedImageIds);

    await prisma.$transaction(
        uniqueIncoming.map((id, index) =>
            prisma.projectImage.updateMany({
                where: { id, projectId },
                data: { order: index + 1 },
            })
        )
    );

    const updated = await prisma.projectImage.findMany({
        where: { projectId },
        orderBy: { order: "asc" },
    });

    return updated.map(mapProjectImageToDTO);
}

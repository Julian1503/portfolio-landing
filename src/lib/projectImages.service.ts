import prisma from "@/lib/prisma";
import type { ProjectImageDTO } from "@/types/ProjectDTO";
import {mapProjectImageToDTO} from "@/lib/automapper/project.mapper";

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

export async function addProjectImage(
    projectId: string,
    input: CreateProjectImageInput
): Promise<ProjectImageDTO> {
    const maxOrder = await prisma.projectImage.aggregate({
        where: { projectId },
        _max: { order: true },
    });

    const nextOrder = (maxOrder._max.order ?? 0) + 1;

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

export async function updateProjectImage(
    projectId: string,
    imageId: string,
    input: UpdateProjectImageInput
): Promise<ProjectImageDTO> {
    const updated = await prisma.projectImage.update({
        where: { id: imageId },
        data: {
            url: input.url,
            alt: input.alt === null ? null : input.alt,
            caption: input.caption === null ? null : input.caption,
            kind: input.kind,
            order: input.order,
        },
    });

    if (updated.projectId !== projectId) {
        throw new Error("Image does not belong to project");
    }

    return mapProjectImageToDTO(updated);
}

export async function deleteProjectImage(
    projectId: string,
    imageId: string
): Promise<void> {
    const img = await prisma.projectImage.findUnique({ where: { id: imageId } });
    if (!img) return;

    if (img.projectId !== projectId) {
        throw new Error("Image does not belong to project");
    }

    await prisma.projectImage.delete({ where: { id: imageId } });
}

export async function reorderProjectImages(
    projectId: string,
    orderedImageIds: string[]
): Promise<ProjectImageDTO[]> {
    const images = await prisma.projectImage.findMany({
        where: { projectId },
        select: { id: true },
    });

    const existingIds = new Set(images.map((i) => i.id));
    const uniqueIncoming = Array.from(new Set(orderedImageIds));

    if (uniqueIncoming.length !== images.length) {
        throw new Error("Reorder payload must include all images exactly once");
    }

    for (const id of uniqueIncoming) {
        if (!existingIds.has(id)) {
            throw new Error("Reorder payload includes invalid image id");
        }
    }

    await prisma.$transaction(
        uniqueIncoming.map((id, index) =>
            prisma.projectImage.update({
                where: { id },
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

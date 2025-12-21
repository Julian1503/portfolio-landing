import type { ProjectDTO, ProjectImageDTO, ProjectPostDTO, ProjectCardDTO } from "@/types/ProjectDTO";
import {Project, ProjectImage, ProjectPost} from "@/generated/prisma/client";

// Normalize database nulls to undefined to align with optional fields in DTOs
// and prevent callers from handling two separate “no data” states.
function undefIfNull<T>(v: T | null): T | undefined {
    return v === null ? undefined : v;
}

export type ProjectWithRelations = Project & {
    images: ProjectImage[];
    posts: ProjectPost[];
};

export function mapProjectImageToDTO(image: ProjectImage): ProjectImageDTO {
    return {
        id: image.id,
        url: image.url,
        alt: undefIfNull(image.alt),
        caption: undefIfNull(image.caption),
        order: image.order,
        kind: image.kind,
    };
}

export function mapProjectPostToDTO(post: ProjectPost): ProjectPostDTO {
    return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        order: post.order,
        published: post.published,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
    };
}

export function mapProjectToDTO(project: ProjectWithRelations): ProjectDTO {
    return {
        id: project.id,
        slug: project.slug,
        title: project.title,
        tag: project.tag,
        location: project.location,
        year: project.year,
        isFeatured: project.isFeatured,
        coverImage: undefIfNull(project.coverImage),
        excerpt: undefIfNull(project.excerpt),
        description: undefIfNull(project.description),

        status: project.status,
        type: undefIfNull(project.type),
        role: undefIfNull(project.role),
        client: undefIfNull(project.client),
        tools: project.tools,

        images: project.images.map(mapProjectImageToDTO),
        posts: project.posts.map(mapProjectPostToDTO),

        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    };
}

export function mapProjectToCardDTO(project: Project): ProjectCardDTO {
    return {
        id: project.id,
        slug: project.slug,
        title: project.title,
        tag: project.tag,
        location: project.location,
        year: project.year,
        isFeatured: project.isFeatured,
        coverImage: undefIfNull(project.coverImage),
        excerpt: undefIfNull(project.excerpt),
    };
}

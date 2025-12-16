import { ProjectDTO, ProjectImageDTO, ProjectPostDTO, ProjectCardDTO } from "@/types/ProjectDTO";
import {ProjectImage, ProjectPost, Project} from "../../../generated/prisma/client";

export function mapProjectImageToDTO(image: ProjectImage): ProjectImageDTO {
    return {
        id: image.id,
        url: image.url,
        alt: image.alt ?? undefined,
        caption: image.caption ?? undefined,
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

export function mapProjectToDTO(
    project: Project & { images: ProjectImage[]; posts: ProjectPost[] }
): ProjectDTO {
    return {
        id: project.id,
        slug: project.slug,
        title: project.title,
        tag: project.tag,
        location: project.location,
        year: project.year,
        isFeatured: project.isFeatured,
        coverImage: project.coverImage ?? undefined,
        excerpt: project.excerpt ?? undefined,
        description: project.description ?? undefined,

        status: project.status,
        type: project.type ?? undefined,
        role: project.role ?? undefined,
        client: project.client ?? undefined,
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
        coverImage: project.coverImage ?? undefined,
        excerpt: project.excerpt ?? undefined,
    };
}

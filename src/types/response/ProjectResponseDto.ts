import type { ImageKind, ProjectStatus, ProjectType } from "../../../generated/prisma/client";

export type ProjectImageDTO = {
    id: string;
    url: string;
    alt: string | null;
    caption: string | null;
    order: number;
    kind: ImageKind;
    createdAt: string;
    updatedAt: string;
};

export type ProjectPostDTO = {
    id: string;
    title: string;
    content: string;
    order: number;
    createdAt: string;
    updatedAt: string;
};

export type ProjectResponseDTO = {
    id: string;
    slug: string;
    title: string;
    tag: string;
    location: string;
    year: string;

    coverImage: string | null;
    excerpt: string | null;
    description: string | null;

    status: ProjectStatus;
    type: ProjectType | null;
    role: string | null;
    client: string | null;
    isFeatured: boolean;

    tools: string[];

    images: ProjectImageDTO[];
    posts: ProjectPostDTO[];

    createdAt: string;
    updatedAt: string;
};

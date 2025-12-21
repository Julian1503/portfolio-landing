import {ProjectStatus, ProjectType} from "@/generated/prisma/enums";

export type ProjectCreateRequestDTO = {
    slug: string;
    title: string;
    tag: string;
    location: string;
    year: string;

    coverImage?: string | null;
    excerpt?: string | null;
    description?: string | null;

    status?: ProjectStatus;
    type?: ProjectType | null;
    role?: string | null;
    client?: string | null;
    isFeatured?: boolean;

    tools?: string[];
};

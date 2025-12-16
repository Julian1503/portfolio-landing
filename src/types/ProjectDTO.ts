export type ProjectDTO = {
    id: string;
    slug: string;
    title: string;
    tag: string;
    location: string;
    year: string;

    coverImage?: string;
    excerpt?: string;
    description?: string;

    isFeatured: boolean;

    status: "CONCEPT" | "DESIGN_DEVELOPMENT" | "DOCUMENTATION" | "SUBMITTED" | "BUILT";
    type?: "RESIDENTIAL" | "MULTI_RESIDENTIAL" | "HOSPITALITY" | "RETAIL" | "COMMERCIAL" | "MIXED_USE" | "URBAN";

    role?: string;
    client?: string;
    tools: string[];

    images: ProjectImageDTO[];
    posts: ProjectPostDTO[];

    createdAt: Date;
    updatedAt: Date;
};

export type ProjectCreateRequestDTO = Omit<ProjectDTO, "id" | "createdAt" | "updatedAt">;
export type ProjectUpdateRequestDTO = Partial<ProjectCreateRequestDTO>;


export type ProjectCardDTO = {
    id: string;
    slug: string;
    title: string;
    tag: string;
    location: string;
    year: string;
    isFeatured: boolean;
    coverImage?: string;
    excerpt?: string;
};

export type ProjectPostDTO = {
    id: string;
    slug: string;
    title: string;
    content: string;
    order: number;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type ProjectImageDTO = {
    id: string;
    url: string;
    alt?: string;
    caption?: string;
    order: number;
    kind: "COVER" | "GALLERY" | "RENDER" | "PLAN" | "SECTION" | "DETAIL" | "BEFORE_AFTER";
};
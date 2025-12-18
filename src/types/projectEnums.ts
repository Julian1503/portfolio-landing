export const IMAGE_KIND = {
    COVER: "COVER",
    GALLERY: "GALLERY",
    RENDER: "RENDER",
    PLAN: "PLAN",
    SECTION: "SECTION",
    DETAIL: "DETAIL",
    BEFORE_AFTER: "BEFORE_AFTER",
} as const;

export type ImageKind = (typeof IMAGE_KIND)[keyof typeof IMAGE_KIND];
export const IMAGE_KINDS: ImageKind[] = Object.values(IMAGE_KIND);

export const IMAGE_KIND_LABEL: Record<ImageKind, string> = {
    COVER: "Cover",
    GALLERY: "Gallery",
    RENDER: "Render",
    PLAN: "Plan",
    SECTION: "Section",
    DETAIL: "Detail",
    BEFORE_AFTER: "Before / After",
};

export const PROJECT_STATUS = {
    CONCEPT: "CONCEPT",
    DESIGN_DEVELOPMENT: "DESIGN_DEVELOPMENT",
    DOCUMENTATION: "DOCUMENTATION",
    SUBMITTED: "SUBMITTED",
    BUILT: "BUILT",
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];
export const PROJECT_STATUSES: ProjectStatus[] = Object.values(PROJECT_STATUS);

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
    CONCEPT: "Concept",
    DESIGN_DEVELOPMENT: "Design development",
    DOCUMENTATION: "Documentation",
    SUBMITTED: "Submitted",
    BUILT: "Built",
};

export const PROJECT_TYPE = {
    RESIDENTIAL: "RESIDENTIAL",
    MULTI_RESIDENTIAL: "MULTI_RESIDENTIAL",
    HOSPITALITY: "HOSPITALITY",
    RETAIL: "RETAIL",
    COMMERCIAL: "COMMERCIAL",
    MIXED_USE: "MIXED_USE",
    URBAN: "URBAN",
} as const;

export type ProjectType = (typeof PROJECT_TYPE)[keyof typeof PROJECT_TYPE];
export const PROJECT_TYPES: ProjectType[] = Object.values(PROJECT_TYPE);

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
    RESIDENTIAL: "Residential",
    MULTI_RESIDENTIAL: "Multi-residential",
    HOSPITALITY: "Hospitality",
    RETAIL: "Retail",
    COMMERCIAL: "Commercial",
    MIXED_USE: "Mixed-use",
    URBAN: "Urban",
};

// helper opcional para UI
export type Option<T extends string> = { value: T; label: string };

export function toOptions<T extends string>(
    values: readonly T[],
    labels: Record<T, string>
): Option<T>[] {
    return values.map((value) => ({ value, label: labels[value] }));
}

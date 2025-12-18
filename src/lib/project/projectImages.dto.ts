import { isNonEmptyString, parseEnum, parseOptionalNumber, parseOptionalString } from "@/lib/http/validators";
import {IMAGE_KINDS, ImageKind} from "@/types/projectEnums";


export type CreateProjectImageInput = {
    url: string;
    alt?: string;
    caption?: string;
    kind?: ImageKind;
    order?: number;
};

export function parseCreateProjectImageBody(body: any):
    | { ok: true; value: CreateProjectImageInput }
    | { ok: false; error: string } {

    if (!isNonEmptyString(body?.url)) return { ok: false, error: "Missing field: url" };

    const alt = parseOptionalString(body?.alt);
    if (body?.alt !== undefined && alt === undefined) return { ok: false, error: "Invalid field: alt" };

    const caption = parseOptionalString(body?.caption);
    if (body?.caption !== undefined && caption === undefined) return { ok: false, error: "Invalid field: caption" };

    const kind = parseEnum(IMAGE_KINDS, body?.kind);
    if (body?.kind !== undefined && !kind) {
        return { ok: false, error: `Invalid field: kind (allowed: ${IMAGE_KINDS.join(", ")})` };
    }

    const order = parseOptionalNumber(body?.order);
    if (body?.order !== undefined && order === undefined) return { ok: false, error: "Invalid field: order" };

    return {
        ok: true,
        value: {
            url: body.url.trim(),
            alt,
            caption,
            kind,
            order,
        },
    };
}

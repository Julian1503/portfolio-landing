import {ProjectDTO} from "@/types/ProjectDTO";
import {Project} from "../../../generated/prisma/client";


export function dtoToEntity(dto : ProjectDTO) : Project {

    return {
        id: dto.id,
        slug: dto.slug,
        title: dto.title,
        tag: dto.tag,
        location: dto.location,
        year: dto.year,
        image: dto.image,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
    } as Project;
}

export function entityToDto(entity : Project) : ProjectDTO {
    return {
        id: entity.id,
        slug: entity.slug,
        title: entity.title,
        tag: entity.tag,
        location: entity.location,
        year: entity.year,
        image: entity.image,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
    } as ProjectDTO;
}
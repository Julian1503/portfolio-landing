import React from "react";
import { ProjectDTO } from "@/types/ProjectDTO";

type ThumbnailGalleryProps = {
    galleryImages: ProjectDTO["images"];
    currentImageIndex: number;
    onSetImageIndex: (index: number) => void;
};

export const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({
    galleryImages,
    currentImageIndex,
    onSetImageIndex,
}) => {
    if (galleryImages.length <= 1) return null;

    return (
        <div className="mt-12 border-t border-[var(--theme-border)] pt-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--theme-text-muted)]">
                Gallery
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
                {galleryImages.map((img, i) => (
                    <button
                        key={img.id}
                        onClick={() => onSetImageIndex(i)}
                        className={`relative aspect-square overflow-hidden rounded-lg transition-all ${
                            i === currentImageIndex
                                ? "ring-2 ring-offset-2 ring-[var(--theme-primary)]"
                                : "opacity-60 hover:opacity-100"
                        }`}
                    >
                        <img
                            src={img.url}
                            alt={img.alt || `Image ${i + 1}`}
                            className="h-full w-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

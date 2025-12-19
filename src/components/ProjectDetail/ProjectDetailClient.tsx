"use client";

import React from "react";
import { ProjectDTO } from "@/types/ProjectDTO";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectContent } from "./ProjectContent";
import { ProjectSidebar } from "./ProjectSidebar";
import { ThumbnailGallery } from "./ThumbnailGallery";

type ProjectDetailClientProps = {
    project: ProjectDTO;
    adjacent: {
        prev: { slug: string; title: string } | null;
        next: { slug: string; title: string } | null;
    };
};

export function ProjectDetailClient({ project, adjacent }: ProjectDetailClientProps) {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);

    const galleryImages = project.images.filter(img =>
        img.kind === "GALLERY" || img.kind === "RENDER"
    );

    const goToPrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? galleryImages.length - 1 : prev - 1
        );
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === galleryImages.length - 1 ? 0 : prev + 1
        );
    };

    // Autoplay every 4 seconds
    React.useEffect(() => {
        if (galleryImages.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            goToNextImage();
        }, 4000);

        return () => clearInterval(interval);
    }, [currentImageIndex, isPaused, galleryImages.length]);

    return (
        <div className="min-h-screen bg-[var(--theme-bg-primary)]">
            <ProjectHeader adjacent={adjacent} />

            <ProjectGallery
                galleryImages={galleryImages}
                currentImageIndex={currentImageIndex}
                isPaused={isPaused}
                projectTitle={project.title}
                onPrevImage={goToPrevImage}
                onNextImage={goToNextImage}
                onSetImageIndex={setCurrentImageIndex}
                onSetPaused={setIsPaused}
            />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                    <ProjectContent project={project} />
                    <ProjectSidebar project={project} />
                </div>

                <ThumbnailGallery
                    galleryImages={galleryImages}
                    currentImageIndex={currentImageIndex}
                    onSetImageIndex={setCurrentImageIndex}
                />
            </div>
        </div>
    );
}
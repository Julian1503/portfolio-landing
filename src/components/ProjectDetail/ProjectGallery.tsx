import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectDTO } from "@/types/ProjectDTO";

type ProjectGalleryProps = {
    galleryImages: ProjectDTO["images"];
    currentImageIndex: number;
    isPaused: boolean;
    projectTitle: string;
    onPrevImage: () => void;
    onNextImage: () => void;
    onSetImageIndex: (index: number) => void;
    onSetPaused: (paused: boolean) => void;
};

export const ProjectGallery = React.memo<ProjectGalleryProps>(function ProjectGallery({
    galleryImages,
    currentImageIndex,
    isPaused,
    projectTitle,
    onPrevImage,
    onNextImage,
    onSetImageIndex,
    onSetPaused,
}) {
    const handleMouseEnter = React.useCallback(() => onSetPaused(true), [onSetPaused]);
    const handleMouseLeave = React.useCallback(() => onSetPaused(false), [onSetPaused]);

    if (galleryImages.length === 0) return null;

    const currentImage = galleryImages[currentImageIndex];

    return (
        <section
            className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh]"
            style={{ backgroundColor: 'var(--theme-surface)' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={currentImage.url}
                        alt={currentImage.alt || projectTitle}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority={currentImageIndex === 0}
                        loading={currentImageIndex === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            {galleryImages.length > 1 && (
                <>
                    <button
                        onClick={onPrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-[var(--theme-surface)] p-2 shadow-lg hover:bg-[var(--theme-surface-hover)] transition-all hover:scale-110"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-6 w-6 text-[var(--theme-text)]" />
                    </button>
                    <button
                        onClick={onNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-[var(--theme-surface)] p-2 shadow-lg hover:bg-[var(--theme-surface-hover)] transition-all hover:scale-110"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-6 w-6 text-[var(--theme-text)]" />
                    </button>

                    {/* Image Counter with Progress */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        <div className="rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'var(--theme-primary-text)' }}>
                            {currentImageIndex + 1} / {galleryImages.length}
                        </div>

                        {/* Progress dots */}
                        <div className="flex gap-1.5">
                            {galleryImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSetImageIndex(i)}
                                    className="h-1.5 rounded-full transition-all"
                                    style={{
                                        width: i === currentImageIndex ? '2rem' : '0.375rem',
                                        backgroundColor: i === currentImageIndex 
                                            ? 'var(--theme-primary)' 
                                            : 'var(--theme-border)'
                                    }}
                                    aria-label={`Go to image ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Pause indicator */}
                    {isPaused && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-4 right-4 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'var(--theme-primary-text)' }}
                        >
                            Paused
                        </motion.div>
                    )}
                </>
            )}

            {/* Caption */}
            {currentImage.caption && (
                <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 text-xs sm:text-sm" style={{ color: 'var(--theme-primary-text)' }}>
                    {currentImage.caption}
                </div>
            )}
        </section>
    );
});

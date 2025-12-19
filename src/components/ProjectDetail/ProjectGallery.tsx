import React from "react";
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

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
    galleryImages,
    currentImageIndex,
    isPaused,
    projectTitle,
    onPrevImage,
    onNextImage,
    onSetImageIndex,
    onSetPaused,
}) => {
    if (galleryImages.length === 0) return null;

    const currentImage = galleryImages[currentImageIndex];

    return (
        <section
            className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh]"
            style={{ backgroundColor: 'var(--theme-surface)' }}
            onMouseEnter={() => onSetPaused(true)}
            onMouseLeave={() => onSetPaused(false)}
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
                    <img
                        src={currentImage.url}
                        alt={currentImage.alt || projectTitle}
                        className="h-full w-full object-cover"
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
                        <div className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                            {currentImageIndex + 1} / {galleryImages.length}
                        </div>

                        {/* Progress dots */}
                        <div className="flex gap-1.5">
                            {galleryImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSetImageIndex(i)}
                                    className={`h-1.5 rounded-full transition-all ${
                                        i === currentImageIndex
                                            ? "w-8 bg-white"
                                            : "w-1.5 bg-white/50 hover:bg-white/75"
                                    }`}
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
                            className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                        >
                            Paused
                        </motion.div>
                    )}
                </>
            )}

            {/* Caption */}
            {currentImage.caption && (
                <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 text-xs sm:text-sm text-white/90">
                    {currentImage.caption}
                </div>
            )}
        </section>
    );
};

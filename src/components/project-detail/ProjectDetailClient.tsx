"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, Calendar, User, Building2, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { ProjectDTO } from "@/types/ProjectDTO";
import { PROJECT_STATUS_LABEL, PROJECT_TYPE_LABEL } from "@/types/projectEnums";

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

    // Autoplay cada 5 segundos
    React.useEffect(() => {
        if (galleryImages.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            goToNextImage();
        }, 4000);

        return () => clearInterval(interval);
    }, [currentImageIndex, isPaused, galleryImages.length]);

    const currentImage = galleryImages[currentImageIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30">
            {/* Header Navigation */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/#projects" className="group flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            <span>Back to Projects</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            {adjacent.prev && (
                                <Link
                                    href={`/projects/${adjacent.prev.slug}`}
                                    className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                                    title={adjacent.prev.title}
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Previous</span>
                                </Link>
                            )}
                            {adjacent.next && (
                                <Link
                                    href={`/projects/${adjacent.next.slug}`}
                                    className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                                    title={adjacent.next.title}
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Image Carousel */}
            {galleryImages.length > 0 && (
                <section
                    className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] bg-slate-900"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
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
                                alt={currentImage.alt || project.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Carousel Controls */}
                    {galleryImages.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-all hover:scale-110"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="h-6 w-6 text-slate-900" />
                            </button>
                            <button
                                onClick={goToNextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-all hover:scale-110"
                                aria-label="Next image"
                            >
                                <ChevronRight className="h-6 w-6 text-slate-900" />
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
                                            onClick={() => setCurrentImageIndex(i)}
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
            )}

            {/* Project Info */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Title & Tag */}
                        <div className="space-y-3">
                            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
                                {project.tag}
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                {project.title}
                            </h1>
                            {project.excerpt && (
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {project.excerpt}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        {project.description && (
                            <div className="border-l-4 border-amber-600 pl-6 py-2">
                                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Overview
                                </h2>
                                <p className="text-base leading-relaxed text-slate-700">
                                    {project.description}
                                </p>
                            </div>
                        )}

                        {/* Posts */}
                        {project.posts.length > 0 && (
                            <div className="space-y-10 pt-4">
                                <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3">
                                    Project Details
                                </h2>
                                {project.posts.map((post, index) => (
                                    <motion.article
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="space-y-3"
                                    >
                                        <h3 className="text-lg font-semibold text-slate-900 uppercase tracking-wide text-sm">
                                            {post.title}
                                        </h3>
                                        <div className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed">
                                            {post.content.split('\n').map((paragraph, i) => (
                                                <p key={i} className="mb-4 last:mb-0">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                        {index < project.posts.length - 1 && (
                                            <div className="pt-6 border-b border-slate-100" />
                                        )}
                                    </motion.article>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Project Info Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sticky top-20">
                            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Project Info
                            </h2>

                            <dl className="space-y-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                                    <div>
                                        <dt className="font-medium text-slate-900">Location</dt>
                                        <dd className="text-slate-600">{project.location}</dd>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                                    <div>
                                        <dt className="font-medium text-slate-900">Year</dt>
                                        <dd className="text-slate-600">{project.year}</dd>
                                    </div>
                                </div>

                                {project.client && (
                                    <div className="flex items-start gap-3">
                                        <Building2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                                        <div>
                                            <dt className="font-medium text-slate-900">Client</dt>
                                            <dd className="text-slate-600">{project.client}</dd>
                                        </div>
                                    </div>
                                )}

                                {project.role && (
                                    <div className="flex items-start gap-3">
                                        <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                                        <div>
                                            <dt className="font-medium text-slate-900">Role</dt>
                                            <dd className="text-slate-600">{project.role}</dd>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <Wrench className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                                    <div className="flex-1">
                                        <dt className="font-medium text-slate-900 mb-2">Status</dt>
                                        <dd>
                                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                {PROJECT_STATUS_LABEL[project.status]}
                                            </span>
                                        </dd>
                                    </div>
                                </div>

                                {project.type && (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                        <div className="flex-1">
                                            <dt className="font-medium text-slate-900 mb-2">Type</dt>
                                            <dd>
                                                <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                                                    {PROJECT_TYPE_LABEL[project.type]}
                                                </span>
                                            </dd>
                                        </div>
                                    </div>
                                )}

                                {project.tools.length > 0 && (
                                    <div className="pt-2 border-t border-slate-100">
                                        <dt className="font-medium text-slate-900 mb-2">Tools & Software</dt>
                                        <dd className="flex flex-wrap gap-2">
                                            {project.tools.map((tool, i) => (
                                                <span
                                                    key={i}
                                                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                                                >
                                                    {tool}
                                                </span>
                                            ))}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* CTA */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-2 text-sm font-semibold text-slate-900">
                                Interested in working together?
                            </h3>
                            <p className="mb-4 text-xs text-slate-600">
                                Let's discuss your next project.
                            </p>
                            <Button asChild className="w-full">
                                <Link href="/#contact">Get in Touch</Link>
                            </Button>
                        </div>
                    </aside>
                </div>

                {/* Thumbnail Gallery */}
                {galleryImages.length > 1 && (
                    <div className="mt-12 border-t border-slate-200 pt-8">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                            Gallery
                        </h3>
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
                            {galleryImages.map((img, i) => (
                                <button
                                    key={img.id}
                                    onClick={() => setCurrentImageIndex(i)}
                                    className={`relative aspect-square overflow-hidden rounded-lg transition-all ${
                                        i === currentImageIndex
                                            ? "ring-2 ring-slate-900 ring-offset-2"
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
                )}
            </div>
        </div>
    );
}
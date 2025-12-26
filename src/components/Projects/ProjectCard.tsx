import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

type ProjectCardProps = {
    slug: string;
    title: string;
    tag: string;
    location: string;
    year: string;
    coverImage?: string;
};

export const ProjectCard = React.memo(function ProjectCard({ slug, title, tag, location, year, coverImage }: ProjectCardProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = React.useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = React.useCallback(() => setIsHovered(false), []);
    return (
        <motion.article
            className="relative cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <Link
                href={`/projects/${slug}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="group block rounded-2xl overflow-hidden bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-lg backdrop-blur-sm"
            >
                <div className="relative aspect-[4/3] overflow-hidden">
                    {coverImage ? (
                        <motion.div
                            animate={{ scale: isHovered ? 1.1 : 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full w-full"
                        >
                            <Image
                                src={coverImage}
                                alt={title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover"
                                loading="lazy"
                            />
                        </motion.div>
                    ) : (
                        <div className="h-full w-full bg-gray-200" />
                    )}

                    {/* Animated overlay */}
                    <motion.div
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: isHovered ? 0.95 : 0.8 }}
                        className="absolute inset-0 bg-gradient-to-t opacity-90"
                        style={{ 
                            backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)'
                        }}
                    />

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                            y: isHovered ? 0 : 20,
                            opacity: isHovered ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-[var(--theme-primary)]/70 via-transparent to-transparent mix-blend-multiply flex items-center justify-center"
                    >
                        <p className="text-xs text-[var(--theme-primary-text)] text-center px-4">
                            Click to explore this project →
                        </p>
                    </motion.div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <motion.div
                        className="flex flex-col gap-2"
                        animate={{ y: isHovered ? -4 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] md:text-xs tracking-[0.25em] uppercase bg-[var(--theme-surface)]/40 text-[var(--theme-text)] border border-[var(--theme-border)]">
                            {tag}
                        </span>
                        <h3 className="text-lg md:text-xl font-semibold text-[var(--theme-text)] leading-snug">
                            {title}
                        </h3>
                        <div className="flex items-center justify-between text-xs md:text-sm text-[var(--theme-text-secondary)]">
                            <span>{location}</span>
                            <span>{year}</span>
                        </div>
                    </motion.div>
                </div>
            </Link>
        </motion.article>
    );
});

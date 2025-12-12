import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type ProjectCardProps = {
    slug: string;
    title: string;
    tag: string;
    location: string;
    year: string;
    image: string;
};

export function ProjectCard({ slug, title, tag, location, year, image }: ProjectCardProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.article
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <Link
                href={`/projects/${slug}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group block rounded-2xl overflow-hidden bg-white/60 border border-white/70 shadow-lg backdrop-blur-sm"
            >
                <div className="relative aspect-[4/3] overflow-hidden">
                    <motion.img
                        src={image}
                        alt={title}
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full w-full object-cover"
                    />

                    {/* Animated overlay */}
                    <motion.div
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: isHovered ? 0.95 : 0.8 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                    />

                    {/* Reveal effect from bottom */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                            y: isHovered ? 0 : 20,
                            opacity: isHovered ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-900/90 to-transparent"
                    >
                        <p className="text-xs text-white/80">
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
                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] md:text-xs tracking-[0.25em] uppercase bg-black/40 text-white/90 border border-white/30">
                            {tag}
                        </span>
                        <h3 className="text-lg md:text-xl font-semibold text-white leading-snug">
                            {title}
                        </h3>
                        <div className="flex items-center justify-between text-xs md:text-sm text-gray-100/90">
                            <span>{location}</span>
                            <span>{year}</span>
                        </div>
                    </motion.div>
                </div>
            </Link>
        </motion.article>
    );
}

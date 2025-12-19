import React from "react";
import { motion } from "framer-motion";
import { ProjectDTO } from "@/types/ProjectDTO";

type ProjectContentProps = {
    project: ProjectDTO;
};

export const ProjectContent: React.FC<ProjectContentProps> = ({ project }) => {
    return (
        <div className="space-y-8">
            {/* Title & Tag */}
            <div className="space-y-3">
                <span className="inline-flex items-center rounded-full border border-[var(--theme-border)] px-3 py-1 text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: 'var(--theme-primary)', color: 'var(--theme-primary-text)' }}>
                    {project.tag}
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-text)] sm:text-4xl lg:text-5xl">
                    {project.title}
                </h1>
                {project.excerpt && (
                    <p className="text-lg text-[var(--theme-text-secondary)] leading-relaxed">
                        {project.excerpt}
                    </p>
                )}
            </div>

            {/* Description */}
            {project.description && (
                <div className="border-l-4 pl-6 py-2" style={{ borderColor: 'var(--theme-primary)' }}>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--theme-text-muted)]">
                        Overview
                    </h2>
                    <p className="text-base leading-relaxed text-[var(--theme-text-secondary)]">
                        {project.description}
                    </p>
                </div>
            )}

            {/* Posts */}
            {project.posts.length > 0 && (
                <div className="space-y-10 pt-4">
                    <h2 className="text-2xl font-bold text-[var(--theme-text)] border-b border-[var(--theme-border)] pb-3">
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
                            <h3 className="text-sm font-semibold text-[var(--theme-text)] uppercase tracking-wide">
                                {post.title}
                            </h3>
                            <div className="prose prose-slate max-w-none text-[var(--theme-text-secondary)] text-base leading-relaxed">
                                {post.content.split('\n').map((paragraph, i) => (
                                    <p key={i} className="mb-4 last:mb-0">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                            {index < project.posts.length - 1 && (
                                <div className="pt-6 border-b border-[var(--theme-border-light)]" />
                            )}
                        </motion.article>
                    ))}
                </div>
            )}
        </div>
    );
};

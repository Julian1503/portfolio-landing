"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/Section";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/Button";
import {ProjectCardDTO} from "@/types/ProjectDTO";

type ProjectsClientProps = {
    projects: ProjectCardDTO[];
};

export function ProjectsClient({ projects }: ProjectsClientProps) {
    const [showAll, setShowAll] = React.useState(false);

    const hasMore = projects.length > 3;
    const visibleProjects = showAll ? projects : projects.slice(0, 3);

    const handleToggle = () => setShowAll((prev) => !prev);

    return (
        <Section
            id="projects"
            tone="dark"
            maxWidth="6xl"
            labelledBy="projects-heading"
        >
            <SectionHeader
                id="projects-heading"
                eyebrow="Projects"
                tone="dark"
                title="Selected Work"
                description="A selection of residential, hospitality and mixed use projects, from early sketches to detailed documentation."
            />

            <motion.div
                id="projects-grid"
                layout
                className="grid gap-6 md:gap-8 md:grid-cols-3"
            >
                <AnimatePresence>
                    {visibleProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ProjectCard
                                slug={project.slug}
                                title={project.title}
                                tag={project.tag}
                                location={project.location}
                                year={project.year}
                                coverImage={project.coverImage}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {hasMore && (
                <div className="mt-10 flex justify-center">
                    <Button
                        className="focus:ring-2"
                        style={{ 
                            backgroundColor: 'var(--theme-secondary)', 
                            color: 'var(--theme-secondary-text)'
                        }}
                        onClick={handleToggle}
                        aria-expanded={showAll}
                        aria-controls="projects-grid"
                    >
                        {showAll ? "View fewer projects" : "View more projects"}
                    </Button>
                </div>
            )}
        </Section>
    );
}

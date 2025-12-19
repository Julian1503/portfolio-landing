import React from "react";
import Link from "next/link";
import { MapPin, Calendar, User, Building2, Wrench } from "lucide-react";
import { Button } from "@/components/Button";
import { ProjectDTO } from "@/types/ProjectDTO";
import { PROJECT_STATUS_LABEL, PROJECT_TYPE_LABEL } from "@/types/projectEnums";

type ProjectSidebarProps = {
    project: ProjectDTO;
};

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ project }) => {
    return (
        <aside className="space-y-6">
            {/* Project Info Card */}
            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 shadow-sm sticky top-20">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--theme-text-muted)]">
                    Project Info
                </h2>

                <dl className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--theme-text-muted)]" />
                        <div>
                            <dt className="font-medium text-[var(--theme-text)]">Location</dt>
                            <dd className="text-[var(--theme-text-secondary)]">{project.location}</dd>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--theme-text-muted)]" />
                        <div>
                            <dt className="font-medium text-[var(--theme-text)]">Year</dt>
                            <dd className="text-[var(--theme-text-secondary)]">{project.year}</dd>
                        </div>
                    </div>

                    {project.client && (
                        <div className="flex items-start gap-3">
                            <Building2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--theme-text-muted)]" />
                            <div>
                                <dt className="font-medium text-[var(--theme-text)]">Client</dt>
                                <dd className="text-[var(--theme-text-secondary)]">{project.client}</dd>
                            </div>
                        </div>
                    )}

                    {project.role && (
                        <div className="flex items-start gap-3">
                            <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--theme-text-muted)]" />
                            <div>
                                <dt className="font-medium text-[var(--theme-text)]">Role</dt>
                                <dd className="text-[var(--theme-text-secondary)]">{project.role}</dd>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3">
                        <Wrench className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--theme-text-muted)]" />
                        <div className="flex-1">
                            <dt className="font-medium text-[var(--theme-text)] mb-2">Status</dt>
                            <dd>
                                <span className="inline-flex rounded-full bg-[var(--theme-surface-hover)] px-2.5 py-1 text-xs font-medium text-[var(--theme-text-secondary)]">
                                    {PROJECT_STATUS_LABEL[project.status]}
                                </span>
                            </dd>
                        </div>
                    </div>

                    {project.type && (
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <div className="flex-1">
                                <dt className="font-medium text-[var(--theme-text)] mb-2">Type</dt>
                                <dd>
                                    <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: 'var(--theme-primary)', color: 'var(--theme-primary-text)' }}>
                                        {PROJECT_TYPE_LABEL[project.type]}
                                    </span>
                                </dd>
                            </div>
                        </div>
                    )}

                    {project.tools.length > 0 && (
                        <div className="pt-2 border-t border-[var(--theme-border-light)]">
                            <dt className="font-medium text-[var(--theme-text)] mb-2">Tools & Software</dt>
                            <dd className="flex flex-wrap gap-2">
                                {project.tools.map((tool, i) => (
                                    <span
                                        key={i}
                                        className="rounded-full bg-[var(--theme-surface-hover)] px-2.5 py-1 text-xs text-[var(--theme-text-secondary)]"
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
            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 shadow-sm">
                <h3 className="mb-2 text-sm font-semibold text-[var(--theme-text)]">
                    Interested in working together?
                </h3>
                <p className="mb-4 text-xs text-[var(--theme-text-secondary)]">
                    Let&apos;s discuss your next project.
                </p>
                <Button asChild className="w-full">
                    <Link href="/#contact">Get in Touch</Link>
                </Button>
            </div>
        </aside>
    );
};

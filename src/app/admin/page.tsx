"use client";

import React from "react";
import { AdminLayout, AdminSectionId } from "@/components/admin/AdminLayout";
import { ProjectsAdminSection } from "@/components/admin/projects/ProjectsAdminSection";
import dynamic from "next/dynamic";

const sections = [
    { id: "hero" as AdminSectionId, label: "Hero / Profile" },
    { id: "about" as AdminSectionId, label: "About" },
    { id: "projects" as AdminSectionId, label: "Projects" },
    { id: "contact" as AdminSectionId, label: "Contact" },
    { id: "navigation" as AdminSectionId, label: "Navigation" },
    { id: "footer" as AdminSectionId, label: "Footer" },
    { id: "theme" as AdminSectionId, label: "Theme / Design" },
];

export default function AdminPage() {
    const [active, setActive] = React.useState<AdminSectionId>("hero");
    const ProjectsAdminSection = dynamic(
        () => import("@/components/admin/projects/ProjectsAdminSection").then(mod => ({ default: mod.ProjectsAdminSection })),
        { loading: () => <div className="text-xs text-slate-500">Loading projects...</div> }
    );

    const HeroAdminSection = dynamic(
        () => import("@/components/admin/cms").then(mod => ({ default: mod.HeroAdminSection })),
        { loading: () => <div className="text-xs text-slate-500">Loading hero section...</div> }
    );

    const AboutAdminSection = dynamic(
        () => import("@/components/admin/cms").then(mod => ({ default: mod.AboutAdminSection })),
        { loading: () => <div className="text-xs text-slate-500">Loading about section...</div> }
    );

    const ContactAdminSection = dynamic(
        () => import("@/components/admin/cms").then(mod => ({ default: mod.ContactAdminSection })),
        { loading: () => <div className="text-xs text-slate-500">Loading contact section...</div> }
    );

    const FooterAdminSection = dynamic(
        () => import("@/components/admin/cms").then(mod => ({ default: mod.FooterAdminSection })),
        { loading: () => <div className="text-xs text-slate-500">Loading footer section...</div> }
    );

    const ThemeAdminSection = dynamic(
        () => import("@/components/admin/cms").then(mod => ({ default: mod.ThemeAdminSection })),
        { loading: () => <div className="text-xs text-slate-500">Loading theme section...</div> }
    );
    return (
        <AdminLayout
            sections={sections}
            activeSection={active}
            onChangeSectionAction={setActive}
        >
            {active === "hero" && <HeroAdminSection />}
            {active === "about" && <AboutAdminSection />}
            {active === "projects" && <ProjectsAdminSection />}
            {active === "contact" && <ContactAdminSection />}
            {active === "footer" && <FooterAdminSection />}
            {active === "theme" && <ThemeAdminSection />}
            {active === "navigation" && (
                <p className="text-xs text-slate-500">
                    Navigation section - not yet implemented
                </p>
            )}
        </AdminLayout>
    );
}

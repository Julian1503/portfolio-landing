"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon, FileText, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ProjectImagesManager from "@/components/admin/projects/ProjectImagesManager";
import ProjectPostsManager from "@/components/admin/projects/ProjectPostsManager";
import type { ProjectDTO } from "@/types/ProjectDTO";

export default function ProjectAdminPage() {
  const params = useParams() as { id?: string };
  const id = params.id!;
  const router = useRouter();

  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "images" | "posts">("details");

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Failed to load project");
        const data = await res.json();
        if (mounted) setProject(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  function updateField<K extends keyof ProjectDTO>(key: K, value: ProjectDTO[K]) {
    setProject((p) => (p ? { ...p, [key]: value } : null));
    setHasChanges(true);
  }

  async function save() {
    if (!project) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (!res.ok) throw new Error("Failed to save project");

      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
              <div className="absolute inset-0 w-12 h-12 rounded-full bg-slate-900/10 blur-xl animate-pulse" />
            </div>
            <p className="text-sm font-medium text-slate-600">Loading project...</p>
          </motion.div>
        </div>
    );
  }

  if (!project) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
          >
            <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Project not found</h2>
            <p className="text-sm text-slate-600 mb-6">The project you're looking for doesn't exist.</p>
            <button
                onClick={() => router.push("/admin")}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to admin
            </button>
          </motion.div>
        </div>
    );
  }

  const statusOptions = [
    { value: "CONCEPT", label: "Concept" },
    { value: "DESIGN_DEVELOPMENT", label: "Design Development" },
    { value: "DOCUMENTATION", label: "Documentation" },
    { value: "SUBMITTED", label: "Submitted" },
    { value: "BUILT", label: "Built" },
  ];

  const typeOptions = [
    { value: "", label: "-- Not specified --" },
    { value: "RESIDENTIAL", label: "Residential" },
    { value: "MULTI_RESIDENTIAL", label: "Multi Residential" },
    { value: "HOSPITALITY", label: "Hospitality" },
    { value: "RETAIL", label: "Retail" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "MIXED_USE", label: "Mixed Use" },
    { value: "URBAN", label: "Urban" },
  ];

  const tabs = [
    { id: "details" as const, label: "Project Details", icon: Settings },
    { id: "images" as const, label: "Images", icon: ImageIcon, count: project.images.length },
    { id: "posts" as const, label: "Posts", icon: FileText, count: project.posts?.length },
  ];

  return (
      <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-6 md:py-12">
          {/* Sticky Header */}
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-0 z-40 mb-6 -mx-4 px-4 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm"
          >
            <div className="mx-auto max-w-7xl flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <button
                    onClick={() => router.push("/admin")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
                <div className="h-5 w-px bg-slate-300" />
                <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate">
                  {project.title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {hasChanges && (
                      <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="text-xs font-medium text-amber-600 flex items-center gap-1"
                      >
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Unsaved changes
                      </motion.span>
                  )}
                  {saveSuccess && (
                      <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="text-xs font-medium text-green-600 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Saved!
                      </motion.span>
                  )}
                </AnimatePresence>

                <button
                    onClick={save}
                    disabled={saving || !hasChanges}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition-all ${
                        saving || !hasChanges
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed scale-95"
                            : "bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 hover:shadow-xl"
                    }`}
                >
                  {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                  ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Project Info Banner */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('/img/noise.png')] opacity-5 mix-blend-overlay" />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    {project.tag}
                  </span>
                    <span>•</span>
                    <span>{project.location}</span>
                    <span>•</span>
                    <span>{project.year}</span>
                  </div>
                </div>
                {project.isFeatured && (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-3xl"
                    >
                      ⭐
                    </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 flex gap-2 overflow-x-auto pb-2 pl-2"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                          isActive
                              ? "bg-slate-400 text-slate-900 shadow-lg scale-105"
                              : "bg-white/80 text-slate-600 hover:bg-white/80 shadow-lg  hover:scale-102"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                        <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
                            isActive ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"
                        }`}>
                    {tab.count}
                  </span>
                    )}
                    {isActive && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-slate-300 rounded-xl shadow-lg -z-10"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                    )}
                  </button>
              );
            })}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === "details" && (
                <motion.section
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl p-6 md:p-8"
                >
                  <div className="grid gap-6">
                    {/* Basic Info Section */}
                    <div className="pb-6 border-b border-slate-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-slate-900 rounded-full" />
                        Basic Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                              type="text"
                              value={project.title}
                              onChange={(e) => updateField("title", e.target.value)}
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all"
                          />
                        </motion.div>

                        <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Slug <span className="text-red-500">*</span>
                          </label>
                          <input
                              type="text"
                              value={project.slug}
                              onChange={(e) => updateField("slug", e.target.value)}
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all"
                          />
                        </motion.div>

                        <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Tag <span className="text-red-500">*</span>
                          </label>
                          <input
                              type="text"
                              value={project.tag}
                              onChange={(e) => updateField("tag", e.target.value)}
                              placeholder="e.g. Residential Development"
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all"
                          />
                        </motion.div>

                        <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Location <span className="text-red-500">*</span>
                          </label>
                          <input
                              type="text"
                              value={project.location}
                              onChange={(e) => updateField("location", e.target.value)}
                              placeholder="e.g. Brisbane, Queensland"
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all"
                          />
                        </motion.div>

                        <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Year <span className="text-red-500">*</span>
                          </label>
                          <input
                              type="text"
                              value={project.year}
                              onChange={(e) => updateField("year", e.target.value)}
                              placeholder="e.g. 2023"
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all"
                          />
                        </motion.div>

                        <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Status <span className="text-red-500">*</span>
                          </label>
                          <select
                              value={project.status}
                              onChange={(e) => updateField("status", e.target.value as any)}
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all bg-white"
                          >
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                            ))}
                          </select>
                        </motion.div>
                      </div>
                    </div>

                    {/* Project Classification */}
                    <div className="pb-6 border-b border-slate-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-slate-900 rounded-full" />
                        Classification
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Type
                          </label>
                          <select
                              value={project.type || ""}
                              onChange={(e) => updateField("type", e.target.value || undefined as any)}
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all bg-white"
                          >
                            {typeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                            ))}
                          </select>
                        </motion.div>

                        <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Your Role
                          </label>
                          <input
                              type="text"
                              value={project.role || ""}
                              onChange={(e) => updateField("role", e.target.value || undefined)}
                              placeholder="e.g. Lead Architect"
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all"
                          />
                        </motion.div>

                        <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Client
                          </label>
                          <input
                              type="text"
                              value={project.client || ""}
                              onChange={(e) => updateField("client", e.target.value || undefined)}
                              placeholder="e.g. XYZ Development"
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all"
                          />
                        </motion.div>

                        <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Tools (comma-separated)
                          </label>
                          <input
                              type="text"
                              value={project.tools.join(", ")}
                              onChange={(e) => updateField("tools", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                              placeholder="e.g. Revit, Enscape, Photoshop"
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all"
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="pb-6 border-b border-slate-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-slate-900 rounded-full" />
                        Descriptions
                      </h3>
                      <div className="grid gap-4">
                        <motion.div whileFocus={{ scale: 1.01 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Excerpt (Short Description)
                          </label>
                          <textarea
                              value={project.excerpt || ""}
                              onChange={(e) => updateField("excerpt", e.target.value || undefined)}
                              rows={2}
                              placeholder="Brief overview for project cards..."
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all resize-none"
                          />
                        </motion.div>

                        <motion.div whileFocus={{ scale: 1.01 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Description (Full)
                          </label>
                          <textarea
                              value={project.description || ""}
                              onChange={(e) => updateField("description", e.target.value || undefined)}
                              rows={6}
                              placeholder="Detailed project description..."
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all resize-none"
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Cover Image & Settings */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-slate-900 rounded-full" />
                        Cover Image & Settings
                      </h3>
                      <div className="grid gap-4">
                        <motion.div whileFocus={{ scale: 1.01 }} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Cover Image URL
                          </label>
                          <input
                              type="text"
                              value={project.coverImage || ""}
                              onChange={(e) => updateField("coverImage", e.target.value || undefined)}
                              placeholder="https://..."
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all"
                          />
                          <AnimatePresence>
                            {project.coverImage && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                  <div className="relative mt-2 w-full max-w-md h-48 rounded-xl border-2 border-slate-200 shadow-lg overflow-hidden">
                                    <Image
                                        src={project.coverImage}
                                        alt="Cover preview"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 448px"
                                        className="object-cover"
                                    />
                                  </div>
                                </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                            onClick={() => updateField("isFeatured", !project.isFeatured)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                updateField("isFeatured", !project.isFeatured);
                              }
                            }}
                        >
                          <input
                              type="checkbox"
                              checked={project.isFeatured}
                              readOnly
                              className="w-5 h-5 rounded-lg border-2 border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900/20 cursor-pointer"
                          />
                          <span className="flex-1 text-sm font-medium text-slate-700">
    ⭐ Show this project on homepage (Featured)
  </span>
                        </motion.div>

                      </div>
                    </div>
                  </div>
                </motion.section>
            )}

            {activeTab === "images" && (
                <motion.section
                    key="images"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl p-6 md:p-8"
                >
                  <ProjectImagesManager projectId={id} initialImages={project.images || []} />
                </motion.section>
            )}

            {activeTab === "posts" && (
                <motion.section
                    key="posts"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl p-6 md:p-8"
                >
                  <ProjectPostsManager projectId={id}  initialPosts={project.posts || []} />
                </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
  );
}
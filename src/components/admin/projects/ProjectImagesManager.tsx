"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
    Plus,
    Trash2,
    Edit3,
    GripVertical,
    Upload,
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    RefreshCw
} from "lucide-react";
import { ProjectImageDTO } from "@/types/ProjectDTO";
import { Modal } from "./Modal";
import {IMAGE_KINDS, ImageKind} from "@/types/projectEnums";
import { ConfirmDialog } from "./ConfirmDialog";
import { usePageVisibility } from "@/hooks/usePageVisibility";

type Props = {
    projectId: string;
    initialImages: ProjectImageDTO[];
};

type ImageFormData = {
    url: string;
    alt?: string;
    caption?: string;
    kind: ImageKind;
};

export default function ProjectImagesManager({ projectId, initialImages }: Props) {
    const [images, setImages] = useState<ProjectImageDTO[]>(initialImages);
    const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
    const [selectedImage, setSelectedImage] = useState<ProjectImageDTO | null>(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const [formData, setFormData] = useState<ImageFormData>({
        url: "",
        alt: "",
        caption: "",
        kind: IMAGE_KINDS[1],
    });

    // Función para refrescar imágenes del servidor
    const refreshImages = useCallback(async () => {
        if (refreshing) return;

        setRefreshing(true);
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            if (!res.ok) {
                const errText = await res.text().catch(() => res.statusText || "Unknown error");
                console.error("Failed to refresh images:", res.status, errText);
                return;
            }

            const project = await res.json();
            setImages(project.images);
        } catch (error) {
            console.error("Error refreshing images:", error);
        } finally {
            setRefreshing(false);
        }
    }, [projectId, refreshing]);

    // Auto-refresh cuando la página vuelve a estar visible
    usePageVisibility(() => {
        if (!modalMode) {
            refreshImages();
        }
    });

    // Sincronizar con initialImages cuando cambian
    useEffect(() => {
        setImages(initialImages);
    }, [initialImages]);

    const openCreate = () => {
        setFormData({ url: "", alt: "", caption: "", kind: IMAGE_KINDS[1] });
        setSelectedImage(null);
        setModalMode("create");
    };

    const openEdit = (image: ProjectImageDTO) => {
        setFormData({
            url: image.url,
            alt: image.alt || "",
            caption: image.caption || "",
            kind: image.kind,
        });
        setSelectedImage(image);
        setModalMode("edit");
    };

    const closeModal = () => {
        if (submitting) return;
        setModalMode(null);
        setSelectedImage(null);
    };

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errText = await res.text().catch(() => res.statusText || "Unknown error");
                console.error("Failed to upload image:", res.status, errText);
                return;
            }

            const data = await res.json();
            setFormData((prev) => ({ ...prev, url: data.url }));
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        try {
            const isCreate = modalMode === "create";
            const url = isCreate
                ? `/api/projects/${projectId}/images`
                : `/api/projects/${projectId}/images/${selectedImage?.id}`;

            const method = isCreate ? "POST" : "PATCH";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errText = await res.text().catch(() => res.statusText || "Unknown error");
                console.error(`Failed to ${isCreate ? "create" : "update"} image:`, res.status, errText);
                return;
            }

            const savedImage = await res.json();

            if (isCreate) {
                setImages((prev) => [...prev, savedImage]);
            } else {
                setImages((prev) =>
                    prev.map((img) => (img.id === savedImage.id ? savedImage : img))
                );
            }

            closeModal();
        } catch (error) {
            console.error("Error saving image:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (imageId: string) => {
        try {
            const res = await fetch(`/api/projects/${projectId}/images/${imageId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errText = await res.text().catch(() => res.statusText || "Unknown error");
                console.error("Failed to delete image:", res.status, errText);
                return;
            }

            setImages((prev) => prev.filter((img) => img.id !== imageId));
            setDeleteConfirm(null);
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    const handleReorder = async (newOrder: ProjectImageDTO[]) => {
        const oldOrder = images;
        setImages(newOrder);

        try {
            const res = await fetch(`/api/projects/${projectId}/images/reorder`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageIds: newOrder.map((img) => img.id) }),
            });

            if (!res.ok) {
                const errText = await res.text().catch(() => res.statusText || "Unknown error");
                console.error("Failed to reorder images:", res.status, errText);
                setImages(oldOrder);
                return;
            }
        } catch (error) {
            console.error("Error reordering images:", error);
            setImages(oldOrder);
        }
    };

    const getKindBadgeColor = (kind: ImageKind) => {
        const colors: Record<ImageKind, string> = {
            COVER: "bg-purple-100 text-purple-700 border-purple-200",
            GALLERY: "bg-blue-100 text-blue-700 border-blue-200",
            RENDER: "bg-green-100 text-green-700 border-green-200",
            PLAN: "bg-amber-100 text-amber-700 border-amber-200",
            SECTION: "bg-orange-100 text-orange-700 border-orange-200",
            DETAIL: "bg-pink-100 text-pink-700 border-pink-200",
            BEFORE_AFTER: "bg-cyan-100 text-cyan-700 border-cyan-200",
        };
        return colors[kind];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Project Images
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                            {images.length} {images.length === 1 ? "image" : "images"} • Drag to reorder
                        </p>
                    </div>

                    {/* Botón de refresh manual */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={refreshImages}
                        disabled={refreshing}
                        className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50"
                        title="Refresh images"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </motion.button>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-lg transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add Image
                </motion.button>
            </div>

            {/* Images List */}
            {images.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50"
                >
                    <ImageIcon className="w-16 h-16 text-slate-400 mb-4" />
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">No images yet</h4>
                    <p className="text-sm text-slate-600 text-center mb-6 max-w-sm">
                        Add images to showcase different aspects of your project: renders, plans, details, and more.
                    </p>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add First Image
                    </button>
                </motion.div>
            ) : (
                <Reorder.Group axis="y" values={images} onReorder={handleReorder} className="space-y-3">
                    <AnimatePresence>
                        {images.map((image) => (
                            <Reorder.Item key={image.id} value={image} className="group">
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="relative flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg transition-all"
                                >
                                    <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 transition-colors">
                                        <GripVertical className="w-5 h-5" />
                                    </div>

                                    <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100">
                                        <Image
                                            src={image.url}
                                            alt={image.alt || "Project image"}
                                            fill
                                            sizes="96px"
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getKindBadgeColor(image.kind)}`}>
                                                {String(image.kind).replace("_", " ")}
                                            </span>
                                            <span className="text-xs text-slate-500">Order: {image.order}</span>
                                        </div>
                                        {image.alt && (
                                            <p className="text-sm font-medium text-slate-900 truncate mb-1">
                                                {image.alt}
                                            </p>
                                        )}
                                        {image.caption && (
                                            <p className="text-xs text-slate-600 truncate">{image.caption}</p>
                                        )}
                                        {!image.alt && !image.caption && (
                                            <p className="text-xs text-slate-400 italic">No description</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => openEdit(image)}
                                            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setDeleteConfirm(image.id)}
                                            className="p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </Reorder.Item>
                        ))}
                    </AnimatePresence>
                </Reorder.Group>
            )}

            {/* Modal: Create/Edit */}
            <Modal
                open={modalMode !== null}
                onCloseAction={closeModal}
                title={modalMode === "create" ? "Add New Image" : "Edit Image"}
                maxWidth="lg"
                preventClose={submitting}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Upload Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Image Upload <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file);
                                }}
                                disabled={uploading || submitting}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className={`flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                                    uploading || submitting
                                        ? "border-slate-300 bg-slate-50 cursor-not-allowed"
                                        : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
                                }`}
                            >
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                                        <span className="text-sm text-slate-600">Uploading...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="w-8 h-8 text-slate-400" />
                                        <span className="text-sm font-medium text-slate-600">
                                            Click to upload image
                                        </span>
                                        <span className="text-xs text-slate-500">PNG, JPG up to 10MB</span>
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-white text-slate-500 uppercase tracking-wider font-semibold">
                                    Or enter URL
                                </span>
                            </div>
                        </div>

                        <input
                            type="text"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            required
                            disabled={uploading || submitting}
                            className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                        />

                        <AnimatePresence>
                            {formData.url && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative w-full h-48 rounded-xl border-2 border-slate-200 shadow-md overflow-hidden">
                                        <Image
                                            src={formData.url}
                                            alt="Preview"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Image Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.kind}
                            onChange={(e) => setFormData({ ...formData, kind: e.target.value as any })}
                            required
                            disabled={submitting}
                            className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all bg-white disabled:bg-slate-50"
                        >
                            {Object.values(IMAGE_KINDS).map((kind) => (
                                <option key={kind} value={kind}>
                                    {String(kind).toLowerCase().replace("_", " ")}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Alt Text (for accessibility)
                        </label>
                        <input
                            type="text"
                            value={formData.alt}
                            onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                            placeholder="e.g. Exterior render showing main facade"
                            disabled={submitting}
                            className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all disabled:bg-slate-50"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Caption
                        </label>
                        <textarea
                            value={formData.caption}
                            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                            placeholder="Optional description or context for this image..."
                            rows={3}
                            disabled={submitting}
                            className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all resize-none disabled:bg-slate-50"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <motion.button
                            whileHover={submitting ? {} : { scale: 1.05 }}
                            whileTap={submitting ? {} : { scale: 0.95 }}
                            type="submit"
                            disabled={submitting || !formData.url}
                            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg transition-all ${
                                submitting || !formData.url
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    {modalMode === "create" ? "Add Image" : "Save Changes"}
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteConfirm !== null}
                onCloseAction={() => setDeleteConfirm(null)}
                onConfirmAction={() => deleteConfirm && handleDelete(deleteConfirm)}
                title="Delete Image?"
                message="This action cannot be undone. The image will be permanently removed from this project."
                confirmText="Delete"
                variant="danger"
                icon={<Trash2 className="w-6 h-6" />}
            />
        </div>
    );
}
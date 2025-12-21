"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit3,
  GripVertical,
  FileText,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  Calendar,
  RefreshCw
} from "lucide-react";
import type { ProjectPostDTO } from "@/types/ProjectDTO";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";
import { usePageVisibility } from "@/hooks/usePageVisibility";

type Props = {
  projectId: string;
  initialPosts: ProjectPostDTO[];
};

type PostFormData = {
  slug: string;
  title: string;
  content: string;
  published: boolean;
};

export default function ProjectPostsManager({ projectId, initialPosts }: Props) {
  const [posts, setPosts] = useState<ProjectPostDTO[]>(initialPosts);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedPost, setSelectedPost] = useState<ProjectPostDTO | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState<PostFormData>({
    slug: "",
    title: "",
    content: "",
    published: true,
  });

  // Función para refrescar posts del servidor
  const refreshPosts = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText || "Unknown error");
        console.error("Failed to fetch project:", res.status, errText);
        return;
      }

      const project = await res.json();
      setPosts(project.posts);
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setRefreshing(false);
    }
  }, [projectId, refreshing]);

  // Auto-refresh cuando la página vuelve a estar visible
  usePageVisibility(() => {
    if (!modalMode) {
      refreshPosts();
    }
  });

  // Sincronizar con initialPosts cuando cambian
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const openCreate = () => {
    setFormData({ slug: "", title: "", content: "", published: true });
    setSelectedPost(null);
    setModalMode("create");
  };

  const openEdit = (post: ProjectPostDTO) => {
    setFormData({
      slug: post.slug,
      title: post.title,
      content: post.content,
      published: post.published,
    });
    setSelectedPost(post);
    setModalMode("edit");
  };

  const closeModal = () => {
    if (submitting) return;
    setModalMode(null);
    setSelectedPost(null);
  };

  const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const isCreate = modalMode === "create";
      const url = isCreate
          ? `/api/projects/${projectId}/posts`
          : `/api/projects/${projectId}/posts/${selectedPost?.id}`;

      const method = isCreate ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText || "Unknown error");
        console.error("Failed to save post:", res.status, errText);
        return;
      }

      const savedPost = await res.json();

      if (isCreate) {
        setPosts((prev) => [...prev, savedPost]);
      } else {
        setPosts((prev) =>
            prev.map((post) => (post.id === savedPost.id ? savedPost : post))
        );
      }

      closeModal();
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/posts/${postId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText || "Unknown error");
        console.error("Failed to delete post:", res.status, errText);
        return;
      }

      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const togglePublished = async (post: ProjectPostDTO) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText || "Unknown error");
        console.error("Failed to update post:", res.status, errText);
        return;
      }

      const updatedPost = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updatedPost : p)));
    } catch (error) {
      console.error("Error toggling published:", error);
    }
  };

  const handleReorder = async (newOrder: ProjectPostDTO[]) => {
    const oldOrder = posts;
    setPosts(newOrder);

    try {
      const res = await fetch(`/api/projects/${projectId}/posts/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postIds: newOrder.map((post) => post.id) }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText || "Unknown error");
        console.error("Failed to reorder posts:", res.status, errText);
        setPosts(oldOrder);
        return;
      }
    } catch (error) {
      console.error("Error reordering posts:", error);
      setPosts(oldOrder);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Project Posts
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {posts.length} {posts.length === 1 ? "post" : "posts"} • Drag to reorder
              </p>
            </div>

            {/* Botón de refresh manual */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshPosts}
                disabled={refreshing}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50"
                title="Refresh posts"
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
            Add Post
          </motion.button>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50"
            >
              <FileText className="w-16 h-16 text-slate-400 mb-4" />
              <h4 className="text-lg font-semibold text-slate-900 mb-2">No posts yet</h4>
              <p className="text-sm text-slate-600 text-center mb-6 max-w-sm">
                Create posts to document design decisions, share insights, or tell the story behind this project.
              </p>
              <button
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add First Post
              </button>
            </motion.div>
        ) : (
            <Reorder.Group axis="y" values={posts} onReorder={handleReorder} className="space-y-3">
              <AnimatePresence>
                {posts.map((post) => (
                    <Reorder.Item key={post.id} value={post} className="group">
                      <motion.div
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="relative flex items-start gap-4 p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg transition-all"
                      >
                        <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 transition-colors pt-1">
                          <GripVertical className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-bold text-slate-900 mb-1 truncate">
                                {post.title}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="font-mono">/{post.slug}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(post.createdAt)}
                                </span>
                                <span>•</span>
                                <span>Order: {post.order}</span>
                              </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => togglePublished(post)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                                    post.published
                                        ? "bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-200"
                                        : "bg-slate-100 text-slate-600 border-2 border-slate-200 hover:bg-slate-200"
                                }`}
                            >
                              {post.published ? (
                                  <>
                                    <Eye className="w-3 h-3" />
                                    Published
                                  </>
                              ) : (
                                  <>
                                    <EyeOff className="w-3 h-3" />
                                    Draft
                                  </>
                              )}
                            </motion.button>
                          </div>

                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {post.content}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                          <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEdit(post)}
                              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Edit post"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setDeleteConfirm(post.id)}
                              className="p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Delete post"
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
            title={modalMode === "create" ? "Create New Post" : "Edit Post"}
            maxWidth="3xl"
            preventClose={submitting}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      ...(modalMode === "create" ? { slug: generateSlug(e.target.value) } : {})
                    });
                  }}
                  placeholder="e.g. Design Concept and Approach"
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-base font-semibold focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. design-concept-and-approach"
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all disabled:bg-slate-50 disabled:text-slate-400"
              />
              <p className="text-xs text-slate-500">
                URL-friendly identifier. Auto-generated from title, but you can edit it.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your post content here. You can describe design decisions, technical details, or share insights about the project..."
                  rows={12}
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all resize-none disabled:bg-slate-50 disabled:text-slate-400"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{formData.content.length} characters</span>
                <span className="text-slate-400">Markdown is not supported yet</span>
              </div>
            </div>

            <motion.div
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => setFormData({ ...formData, published: !formData.published })}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${formData.published ? "bg-green-100" : "bg-slate-200"}`}>
                  {formData.published ? (
                      <Eye className="w-5 h-5 text-green-700" />
                  ) : (
                      <EyeOff className="w-5 h-5 text-slate-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formData.published ? "Published" : "Draft"}
                  </p>
                  <p className="text-xs text-slate-600">
                    {formData.published
                        ? "This post will be visible to the public"
                        : "This post will be hidden from the public"}
                  </p>
                </div>
              </div>
              <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-2 border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900/20 cursor-pointer"
              />
            </motion.div>

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
                  disabled={submitting || !formData.title || !formData.slug || !formData.content}
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg transition-all ${
                      submitting || !formData.title || !formData.slug || !formData.content
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
                      {modalMode === "create" ? "Create Post" : "Save Changes"}
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
            title="Delete Post?"
            message="This action cannot be undone. The post will be permanently removed from this project."
            confirmText="Delete"
            variant="danger"
            icon={<Trash2 className="w-6 h-6" />}
        />
      </div>
  );
}
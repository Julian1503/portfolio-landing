"use client";

import React from "react";
import type { FooterSectionDTO, SocialLinkDTO } from "@/lib/cms/schemas";

export function FooterAdminSection() {
  const [footer, setFooter] = React.useState<FooterSectionDTO | null>(null);
  const [links, setLinks] = React.useState<SocialLinkDTO[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  
  // New link form state
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newLink, setNewLink] = React.useState({ platform: "", url: "" });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [footerRes, linksRes] = await Promise.all([
          fetch("/api/admin/footer"),
          fetch("/api/admin/footer/social"),
        ]);
        
        if (!footerRes.ok) throw new Error("Failed to fetch footer section");
        if (!linksRes.ok) throw new Error("Failed to fetch social links");
        
        const footerData = await footerRes.json();
        const linksData = await linksRes.json();
        
        setFooter(footerData);
        setLinks(linksData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load footer section");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!footer) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(footer),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update footer section");
      }

      const updated = await res.json();
      setFooter(updated);
      setSuccessMessage("Footer section updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update footer section");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof FooterSectionDTO, value: string) => {
    if (!footer) return;
    setFooter({ ...footer, [field]: value });
  };

  const handleAddLink = async () => {
    if (!newLink.platform || !newLink.url) return;

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/footer/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: newLink.platform,
          url: newLink.url,
          order: links.length,
          isVisible: true,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add social link");
      }

      const created = await res.json();
      setLinks([...links, created]);
      setNewLink({ platform: "", url: "" });
      setShowAddForm(false);
      setSuccessMessage("Social link added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add social link");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/footer/social/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete social link");
      }

      setLinks(links.filter((link) => link.id !== id));
      setSuccessMessage("Social link deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete social link");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (link: SocialLinkDTO) => {
    if (!link.id) return;

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/footer/social/${link.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !link.isVisible }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update social link");
      }

      const updated = await res.json();
      setLinks(links.map((l) => (l.id === link.id ? updated : l)));
      setSuccessMessage("Social link visibility updated!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update social link");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (!footer) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error || "Footer section not found"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Footer Section</h2>
        <p className="mt-1 text-sm text-slate-500">
          Edit footer settings and manage social media links.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      {/* Footer Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="copyrightText" className="block text-sm font-medium text-slate-700">
            Copyright Text (optional)
          </label>
          <input
            type="text"
            id="copyrightText"
            value={footer.copyrightText || ""}
            onChange={(e) => handleChange("copyrightText", e.target.value)}
            placeholder="© 2024 Maria Lourdes Ynigo. All rights reserved."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="flex justify-end space-x-3 border-t pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className={`rounded-lg px-6 py-2 text-sm font-semibold text-white ${
              isSaving
                ? "cursor-not-allowed bg-slate-400"
                : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Social Links Management */}
      <div className="space-y-4 border-t pt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Social Media Links</h3>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200"
          >
            {showAddForm ? "Cancel" : "+ Add Link"}
          </button>
        </div>

        {showAddForm && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="newPlatform" className="block text-sm font-medium text-slate-700">
                  Platform Name
                </label>
                <input
                  type="text"
                  id="newPlatform"
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                  placeholder="e.g., instagram, linkedin"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label htmlFor="newUrl" className="block text-sm font-medium text-slate-700">
                  URL
                </label>
                <input
                  type="url"
                  id="newUrl"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddLink}
                disabled={isSaving || !newLink.platform || !newLink.url}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                Add Link
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {links.length === 0 ? (
            <p className="text-sm text-slate-500">No social links yet. Add one above.</p>
          ) : (
            links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-slate-900 capitalize">
                    {link.platform}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-slate-900 truncate max-w-xs"
                  >
                    {link.url}
                  </a>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      link.isVisible
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {link.isVisible ? "Visible" : "Hidden"}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(link)}
                    disabled={isSaving}
                    className="text-sm text-slate-600 hover:text-slate-900 disabled:text-slate-400"
                  >
                    {link.isVisible ? "Hide" : "Show"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (link.id) {
                        handleDeleteLink(link.id);
                      }
                    }}
                    disabled={isSaving}
                    className="text-sm text-red-600 hover:text-red-800 disabled:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

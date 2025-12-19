"use client";

import React from "react";
import type { AboutSectionDTO } from "@/lib/cms/schemas";

export function AboutAdminSection() {
  const [about, setAbout] = React.useState<AboutSectionDTO | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAbout = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/about");
        if (!res.ok) throw new Error("Failed to fetch about section");
        const data = await res.json();
        setAbout(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load about section");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!about) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update about section");
      }

      const updated = await res.json();
      setAbout(updated);
      setSuccessMessage("About section updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update about section");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof AboutSectionDTO, value: string) => {
    if (!about) return;
    setAbout({ ...about, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (!about) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error || "About section not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">About Me Section</h2>
        <p className="mt-1 text-sm text-slate-500">
          Edit the About Me section content including bio, stats, and CTAs.
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="eyebrow" className="block text-sm font-medium text-slate-700">
              Eyebrow Text
            </label>
            <input
              type="text"
              id="eyebrow"
              value={about.eyebrow}
              onChange={(e) => handleChange("eyebrow", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Section Title
            </label>
            <input
              type="text"
              id="title"
              value={about.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>
        </div>

        {/* Biography Paragraphs */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Biography</h3>
          
          <div>
            <label htmlFor="paragraph1" className="block text-sm font-medium text-slate-700">
              Paragraph 1
            </label>
            <textarea
              id="paragraph1"
              value={about.paragraph1}
              onChange={(e) => handleChange("paragraph1", e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          <div>
            <label htmlFor="paragraph2" className="block text-sm font-medium text-slate-700">
              Paragraph 2
            </label>
            <textarea
              id="paragraph2"
              value={about.paragraph2}
              onChange={(e) => handleChange("paragraph2", e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          <div>
            <label htmlFor="paragraph3" className="block text-sm font-medium text-slate-700">
              Paragraph 3
            </label>
            <textarea
              id="paragraph3"
              value={about.paragraph3}
              onChange={(e) => handleChange("paragraph3", e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>
        </div>

        {/* Image */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">
              Image URL (optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              value={about.imageUrl || ""}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label htmlFor="imageAlt" className="block text-sm font-medium text-slate-700">
              Image Alt Text
            </label>
            <input
              type="text"
              id="imageAlt"
              value={about.imageAlt}
              onChange={(e) => handleChange("imageAlt", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Statistics</h3>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="stat1Value" className="block text-sm font-medium text-slate-700">
                Stat 1 Value
              </label>
              <input
                type="text"
                id="stat1Value"
                value={about.stat1Value}
                onChange={(e) => handleChange("stat1Value", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="stat1Label" className="block text-sm font-medium text-slate-700">
                Stat 1 Label
              </label>
              <input
                type="text"
                id="stat1Label"
                value={about.stat1Label}
                onChange={(e) => handleChange("stat1Label", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="stat2Value" className="block text-sm font-medium text-slate-700">
                Stat 2 Value
              </label>
              <input
                type="text"
                id="stat2Value"
                value={about.stat2Value}
                onChange={(e) => handleChange("stat2Value", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="stat2Label" className="block text-sm font-medium text-slate-700">
                Stat 2 Label
              </label>
              <input
                type="text"
                id="stat2Label"
                value={about.stat2Label}
                onChange={(e) => handleChange("stat2Label", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="stat3Value" className="block text-sm font-medium text-slate-700">
                Stat 3 Value
              </label>
              <input
                type="text"
                id="stat3Value"
                value={about.stat3Value}
                onChange={(e) => handleChange("stat3Value", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="stat3Label" className="block text-sm font-medium text-slate-700">
                Stat 3 Label
              </label>
              <input
                type="text"
                id="stat3Label"
                value={about.stat3Label}
                onChange={(e) => handleChange("stat3Label", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Call-to-Action Buttons</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="cta1Label" className="block text-sm font-medium text-slate-700">
                CTA 1 Label
              </label>
              <input
                type="text"
                id="cta1Label"
                value={about.cta1Label}
                onChange={(e) => handleChange("cta1Label", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>

            <div>
              <label htmlFor="cta1Url" className="block text-sm font-medium text-slate-700">
                CTA 1 URL
              </label>
              <input
                type="text"
                id="cta1Url"
                value={about.cta1Url}
                onChange={(e) => handleChange("cta1Url", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="cta2Label" className="block text-sm font-medium text-slate-700">
                CTA 2 Label
              </label>
              <input
                type="text"
                id="cta2Label"
                value={about.cta2Label}
                onChange={(e) => handleChange("cta2Label", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>

            <div>
              <label htmlFor="cta2Url" className="block text-sm font-medium text-slate-700">
                CTA 2 URL
              </label>
              <input
                type="url"
                id="cta2Url"
                value={about.cta2Url}
                onChange={(e) => handleChange("cta2Url", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
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
    </div>
  );
}

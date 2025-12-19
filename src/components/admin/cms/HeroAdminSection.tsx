"use client";

import React from "react";
import type { HeroSectionDTO } from "@/lib/cms/schemas";

export function HeroAdminSection() {
  const [hero, setHero] = React.useState<HeroSectionDTO | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Fetch hero data
  React.useEffect(() => {
    const fetchHero = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/hero");
        if (!res.ok) throw new Error("Failed to fetch hero section");
        const data = await res.json();
        setHero(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load hero section");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHero();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hero) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update hero section");
      }

      const updated = await res.json();
      setHero(updated);
      setSuccessMessage("Hero section updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update hero section");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof HeroSectionDTO, value: string) => {
    if (!hero) return;
    setHero({ ...hero, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error || "Hero section not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Hero Section</h2>
        <p className="mt-1 text-sm text-slate-500">
          Edit the main hero section content that appears on the home page.
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
        <div className="grid gap-6 md:grid-cols-2">
          {/* Eyebrow */}
          <div>
            <label htmlFor="eyebrow" className="block text-sm font-medium text-slate-700">
              Eyebrow Text
            </label>
            <input
              type="text"
              id="eyebrow"
              value={hero.eyebrow}
              onChange={(e) => handleChange("eyebrow", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={hero.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>
        </div>

        {/* Tagline */}
        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-slate-700">
            Tagline
          </label>
          <textarea
            id="tagline"
            value={hero.tagline}
            onChange={(e) => handleChange("tagline", e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Badge 1 */}
          <div>
            <label htmlFor="badge1" className="block text-sm font-medium text-slate-700">
              Badge 1
            </label>
            <input
              type="text"
              id="badge1"
              value={hero.badge1}
              onChange={(e) => handleChange("badge1", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          {/* Badge 2 */}
          <div>
            <label htmlFor="badge2" className="block text-sm font-medium text-slate-700">
              Badge 2
            </label>
            <input
              type="text"
              id="badge2"
              value={hero.badge2}
              onChange={(e) => handleChange("badge2", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Projects Label */}
          <div>
            <label htmlFor="projectsLabel" className="block text-sm font-medium text-slate-700">
              Projects Button Label
            </label>
            <input
              type="text"
              id="projectsLabel"
              value={hero.projectsLabel}
              onChange={(e) => handleChange("projectsLabel", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          {/* Contact Label */}
          <div>
            <label htmlFor="contactLabel" className="block text-sm font-medium text-slate-700">
              Contact Button Label
            </label>
            <input
              type="text"
              id="contactLabel"
              value={hero.contactLabel}
              onChange={(e) => handleChange("contactLabel", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>
        </div>

        {/* Background Image/Video URLs */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="backgroundImage" className="block text-sm font-medium text-slate-700">
              Background Image URL (optional)
            </label>
            <input
              type="url"
              id="backgroundImage"
              value={hero.backgroundImage || ""}
              onChange={(e) => handleChange("backgroundImage", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label htmlFor="backgroundVideo" className="block text-sm font-medium text-slate-700">
              Background Video URL (optional)
            </label>
            <input
              type="url"
              id="backgroundVideo"
              value={hero.backgroundVideo || ""}
              onChange={(e) => handleChange("backgroundVideo", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
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

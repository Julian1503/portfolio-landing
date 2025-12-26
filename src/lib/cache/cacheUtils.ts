// src/lib/cache/cacheUtils.ts
import {revalidateTag, revalidatePath, updateTag} from 'next/cache';

/**
 * Invalidates the entire projects cache
 *
 * Use it after:
 * - Creating a project
 * - Updating a project
 * - Deleting a project
 * - Modifying project images
 * - Modifying project posts
 *
 * Example:
 * ```ts
 * await createProject(data);
 * invalidateProjectsCache(); // ✅ Cache invalidated
 * ```
 */
export function invalidateProjectsCache() {
    updateTag('projects');
    console.log('[CACHE] ♻️  Invalidated all projects cache');
}

/**
 * Invalidates the cache for a specific project by its slug
 *
 * Use it after:
 * - Updating details of a specific project
 *
 * Example:
 * ```ts
 * await updateProject(id, data);
 * invalidateProjectCache(data.slug);
 * ```
 */
export function invalidateProjectCache(slug: string) {
    revalidatePath(`/projects/${slug}`);
    console.log(`[CACHE] ♻️  Invalidated project: ${slug}`);
}

/**
 * Invalidates the homepage cache
 *
 * Use it when:
 * - Featured projects change (isFeatured)
 * - Projects are reordered
 * - Data affecting the homepage changes
 *
 * Example:
 * ```ts
 * await updateProject(id, { isFeatured: true });
 * invalidateHomepageCache();
 * ```
 */
export function invalidateHomepageCache() {
    revalidatePath('/');
    console.log('[CACHE] ♻️  Invalidated homepage cache');
}

/**
 * Invalidates the entire site cache
 *
 * Use it only when:
 * - You are in development and want to force a full refresh
 * - You make massive structural changes
 * - You have cache issues and need a full "reset"
 *
 * ⚠️  Use with caution in production
 *
 * Example:
 * ```ts
 * // In development
 * if (process.env.NODE_ENV === 'development') {
 *   invalidateAllCache();
 * }
 * ```
 */
export function invalidateAllCache() {
    updateTag('projects');
    revalidatePath('/projects/[slug]', 'page');
    console.log('[CACHE] ♻️  Invalidated ALL cache');
}

/**
 * Invalidates the admin cache
 *
 * Use it when:
 * - Data is updated from the admin panel
 *
 * Example:
 * ```ts
 * await updateProjectFromAdmin(data);
 * invalidateAdminCache();
 * ```
 */
export function invalidateAdminCache() {
    revalidatePath('/admin');
    revalidatePath('/admin/projects/[id]', 'page');
    console.log('[CACHE] ♻️  Invalidated admin cache');
}

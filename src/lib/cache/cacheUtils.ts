// src/lib/cache/cacheUtils.ts
import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Invalida todo el caché de proyectos
 *
 * Úsalo después de:
 * - Crear un proyecto
 * - Actualizar un proyecto
 * - Eliminar un proyecto
 * - Modificar imágenes de un proyecto
 * - Modificar posts de un proyecto
 *
 * Ejemplo:
 * ```ts
 * await createProject(data);
 * invalidateProjectsCache(); // ✅ Caché invalidado
 * ```
 */
export function invalidateProjectsCache() {
    revalidateTag(`projects`,'projects');
    console.log('[CACHE] ♻️  Invalidated all projects cache');
}

/**
 * Invalida el caché de un proyecto específico por su slug
 *
 * Úsalo después de:
 * - Actualizar detalles de un proyecto específico
 *
 * Ejemplo:
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
 * Invalida el caché de la homepage
 *
 * Úsalo cuando:
 * - Cambien proyectos destacados (isFeatured)
 * - Se reordenen proyectos
 * - Cambien datos que afecten la homepage
 *
 * Ejemplo:
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
 * Invalida todo el caché del sitio
 *
 * Úsalo solo cuando:
 * - Estés en desarrollo y quieras forzar refresh total
 * - Hagas cambios estructurales masivos
 * - Tengas problemas de caché y necesites "reset"
 *
 * ⚠️  Usar con precaución en producción
 *
 * Ejemplo:
 * ```ts
 * // En desarrollo
 * if (process.env.NODE_ENV === 'development') {
 *   invalidateAllCache();
 * }
 * ```
 */
export function invalidateAllCache() {
    revalidateTag('projects', 'projects');
    revalidatePath('/');
    revalidatePath('/projects/[slug]', 'page');
    console.log('[CACHE] ♻️  Invalidated ALL cache');
}

/**
 * Invalida el caché de admin
 *
 * Úsalo cuando:
 * - Se actualicen datos desde el panel de admin
 *
 * Ejemplo:
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
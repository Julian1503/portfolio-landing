# Theme / Design System Migration Guide

This guide helps you migrate an existing installation to use the new theme/design system.

## Overview

The theme system allows you to customize the visual appearance of your portfolio through the admin panel. All styling is now controlled via design tokens stored in the database.

## Migration Steps

### 1. Run Database Migration

```bash
# Generate Prisma client
npm run prisma:generate

# Run the migration
npx prisma migrate deploy

# OR if in development
npx prisma migrate dev
```

### 2. Seed Default Theme

If you're migrating an existing installation, you can seed the default theme that matches your current design:

```bash
npm run prisma:seed
```

This will create a `ThemeTokens` record with values matching the current design in `globals.css`.

### 3. Verify Theme is Active

1. Navigate to the admin panel: `/admin`
2. Click on "Theme / Design" in the sidebar
3. You should see the theme editor with default values loaded

### 4. Customize Your Theme

You can now customize:

- **Colors**: Background, text, primary/secondary actions, semantic colors
- **Typography**: Font families, sizes, weights, line heights
- **Layout**: Border radii, spacing scales
- **Presets**: Load Dark, Warm, or Minimal themes

### 5. Preview Changes

The theme editor includes a live preview panel showing how your changes will look. Changes are applied site-wide immediately after saving.

## Backwards Compatibility

The system is designed to be backwards compatible:

- **CSS Variables**: Theme tokens are injected as CSS variables (e.g., `--theme-primary`)
- **Fallback**: If no theme exists in the database, the default theme is used
- **No Flash**: Theme is loaded server-side to prevent unstyled content flash
- **Tailwind**: Existing Tailwind classes continue to work alongside theme variables

## Default Theme Values

The default theme matches your current design:

### Colors
- Background: `#FAFAF9` (Stone-50)
- Surface: `#FFFFFF`
- Text: `#1C1917` (Stone-900)
- Primary: `#65816A` (Sage green)
- Secondary: `#1C1917` (Stone-900)

### Typography
- Font Family: Montserrat
- Base Size: 16px
- Line Height: 1.6

### Layout
- Border Radius (lg): 1rem
- Spacing (md): 1rem

## Troubleshooting

### Theme not loading

1. Check database connection is working
2. Verify migration ran successfully: `npx prisma migrate status`
3. Check console for errors in `/api/admin/theme`

### Changes not appearing

1. Clear browser cache
2. Verify theme was saved (check for success message)
3. Refresh the page to see server-side changes

### Validation errors

All theme tokens are validated:
- Colors must be valid hex codes (e.g., `#FFFFFF`)
- Font sizes must be between 12-22px
- Spacing/radii must use `rem` or `px` units
- Font families are whitelisted for security

## API Endpoints

You can also manage themes programmatically:

```bash
# Get current theme
GET /api/admin/theme

# Update theme (partial updates supported)
PUT /api/admin/theme
Content-Type: application/json
{
  "colors": {
    "primary": "#FF0000"
  }
}

# List presets
GET /api/admin/theme/presets

# Load a preset
POST /api/admin/theme/presets
Content-Type: application/json
{
  "preset": "dark"
}
```

## Advanced: Section Overrides

You can override theme tokens for specific sections (Hero, Projects, About, Contact, Footer). This allows different parts of your site to have different color schemes while maintaining a cohesive design system.

Example:
```json
{
  "sectionOverrides": {
    "hero": {
      "background": "#000000",
      "text": "#FFFFFF"
    }
  }
}
```

## Security Notes

- Only whitelisted font families can be used
- Colors must be valid hex codes
- No arbitrary CSS/HTML can be injected
- All values are validated by Zod schemas

## Support

If you encounter issues, check:
1. Database is accessible
2. Prisma client is generated
3. Migration has run successfully
4. No JavaScript errors in console

For more help, see the project documentation or open an issue on GitHub.

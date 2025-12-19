# Theme / Design System Documentation

## Overview

The theme system provides a centralized way to manage the visual design of your portfolio through an admin interface. It uses a **design token** approach to ensure consistency and maintainability across all components.

## Architecture

### Design Tokens

Design tokens are the atomic units of the design system. They represent design decisions (colors, typography, spacing) in a structured, reusable format.

**Token Categories:**
- **Colors**: Background, surface, text, borders, actions, semantic colors
- **Typography**: Font families, sizes, weights, line heights
- **Radii**: Border radius values for different component sizes
- **Spacing**: Consistent spacing scale for margins and padding
- **Shadows**: Shadow presets for depth and elevation

### SOLID Principles

The implementation follows SOLID principles:

1. **Single Responsibility**: Each layer has a clear purpose
   - Repository: Database operations
   - Service: Business logic
   - API Routes: HTTP handling
   - Components: UI rendering

2. **Open/Closed**: Extensible through interfaces
   - New repositories can implement `IThemeRepository`
   - New services can implement `IThemeService`

3. **Liskov Substitution**: Interfaces ensure contract compliance

4. **Interface Segregation**: Focused interfaces
   - `IThemeRepository` handles persistence
   - `IThemeService` handles business logic

5. **Dependency Inversion**: Depends on abstractions
   - Services depend on repository interfaces
   - Easy to mock for testing

### Data Flow

```
Admin UI (React)
    ↓
API Routes (/api/admin/theme)
    ↓
ThemeService
    ↓
ThemeRepository
    ↓
Prisma / PostgreSQL
    ↓
Public Pages (via getTheme())
    ↓
CSS Variables (injected in layout)
```

## Implementation Details

### Database Schema

```prisma
model ThemeTokens {
  id              String   @id @default("theme_singleton")
  colors          Json     // Structured color tokens
  typography      Json     // Typography tokens
  radii           Json     // Border radius tokens
  spacing         Json     // Spacing scale tokens
  shadows         Json     // Shadow presets
  sectionOverrides Json?   // Section-specific overrides
  name            String   @default("Default")
  isDark          Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

**Design Decision**: We use a singleton pattern (single row with ID `theme_singleton`) since only one theme is active at a time. JSON fields provide flexibility while Zod schemas ensure type safety.

### Validation Layer

All theme data is validated using Zod schemas:

```typescript
// Example: Color validation
const hexColorSchema = z.string().regex(
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/,
  "Must be a valid hex color"
);

// Example: Typography validation
const TypographyTokensSchema = z.object({
  fontFamily: z.enum(["Montserrat", "Inter", ...]), // Whitelisted
  baseFontSize: z.number().min(12).max(22),         // Clamped
  // ...
});
```

**Security Features:**
- No arbitrary CSS/HTML injection
- Whitelisted font families
- Validated color formats
- Clamped numeric values

### CSS Variable Generation

Tokens are converted to CSS variables at runtime:

```typescript
// Theme tokens
{
  colors: {
    primary: "#65816A",
    text: "#1C1917"
  }
}

// Generates
:root {
  --theme-primary: #65816A;
  --theme-text: #1C1917;
}
```

These variables can be used in components:

```css
.button {
  background-color: var(--theme-primary);
  color: var(--theme-primary-text);
}
```

### Server-Side Injection

Theme CSS is injected server-side in the root layout to prevent flash of unstyled content:

```tsx
export default async function RootLayout({ children }) {
  const theme = await getTheme();
  const themeCSS = generateThemeCSS(theme);

  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## API Reference

### GET /api/admin/theme

Retrieve the current active theme.

**Response:**
```json
{
  "id": "theme_singleton",
  "name": "Default",
  "isDark": false,
  "colors": { ... },
  "typography": { ... },
  "radii": { ... },
  "spacing": { ... },
  "shadows": { ... }
}
```

### PUT /api/admin/theme

Update theme tokens. Supports partial updates.

**Request:**
```json
{
  "colors": {
    "primary": "#FF0000"
  },
  "typography": {
    "baseFontSize": 18
  }
}
```

**Response:** Updated theme object

**Errors:**
- `400`: Validation error (with details)
- `500`: Server error

### GET /api/admin/theme/presets

List available theme presets.

**Response:**
```json
{
  "presets": [
    { "key": "default", "name": "Default", "isDark": false },
    { "key": "dark", "name": "Dark", "isDark": true },
    { "key": "warm", "name": "Warm", "isDark": false },
    { "key": "minimal", "name": "Minimal", "isDark": false }
  ]
}
```

### POST /api/admin/theme/presets

Load a preset theme.

**Request:**
```json
{
  "preset": "dark"
}
```

**Response:** Updated theme object

## Admin UI

The theme admin panel (`/admin` → Theme / Design) provides:

### Color Panel
- Visual color pickers for all color tokens
- Hex code inputs for precise control
- Organized by category (background, text, actions, semantic)

### Typography Panel
- Font family selector (whitelisted options)
- Base font size slider (12-22px)
- Heading size inputs (H1-H6)
- Line height and weight controls

### Layout Panel
- Border radius controls (sm, md, lg, xl)
- Spacing scale inputs (xs, sm, md, lg, xl, 2xl, 3xl)

### Preview Panel
- Live preview of theme changes
- Sample card with buttons and text
- Updates in real-time as you edit

### Presets
- One-click loading of predefined themes
- Confirmation before overwriting current theme

## Extending the System

### Adding New Token Categories

1. Update Prisma schema:
```prisma
model ThemeTokens {
  // ...
  animations Json // New token category
}
```

2. Create Zod schema:
```typescript
export const AnimationTokensSchema = z.object({
  durationFast: z.string(),
  durationNormal: z.string(),
  // ...
});
```

3. Update DTO and services to handle new tokens

4. Add UI controls in `ThemeAdminSection`

### Adding New Presets

Edit `src/lib/theme/defaults.ts`:

```typescript
export const CUSTOM_THEME: ThemeTokensDTO = {
  name: "Custom",
  isDark: false,
  colors: { ... },
  // ...
};

export const THEME_PRESETS = {
  default: DEFAULT_THEME,
  custom: CUSTOM_THEME, // Add here
};
```

### Section Overrides

Override tokens for specific sections:

```typescript
{
  sectionOverrides: {
    hero: {
      background: "#000000",
      text: "#FFFFFF",
      primary: "#FFD700"
    }
  }
}
```

Only these tokens can be overridden per section:
- background
- surface
- text
- textSecondary
- border
- primary
- primaryText

## Testing

### Validation Testing

Test Zod schemas with edge cases:

```typescript
// Valid
ColorTokensSchema.parse({ primary: "#FF0000" });

// Invalid - throws ZodError
ColorTokensSchema.parse({ primary: "red" });
ColorTokensSchema.parse({ primary: "not-a-color" });
```

### Repository Testing

Mock Prisma client:

```typescript
const mockPrisma = {
  themeTokens: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
  }
};
```

### Integration Testing

Test API endpoints:

```typescript
const response = await fetch('/api/admin/theme', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ colors: { primary: '#FF0000' } })
});

expect(response.status).toBe(200);
```

## Performance Considerations

- **Server-Side Rendering**: Theme loaded once per request, cached by Next.js
- **CSS Variables**: Native browser performance, no runtime overhead
- **Fallback**: Default theme loaded if database query fails
- **No Flash**: Theme injected before initial paint

## Best Practices

1. **Use Design Tokens**: Reference `--theme-*` variables instead of hardcoded values
2. **Validate Early**: Use Zod schemas at API boundaries
3. **Type Safety**: Use DTO types throughout the application
4. **Fail Gracefully**: Always provide fallback to default theme
5. **Test Changes**: Use preview panel before saving
6. **Document Decisions**: Comment complex color choices or token relationships

## Future Enhancements

Potential improvements:

- [ ] Theme versioning (rollback to previous themes)
- [ ] A/B testing different themes
- [ ] User-specific themes (dark mode preference)
- [ ] Export/import themes as JSON
- [ ] More granular section overrides
- [ ] Animation token support
- [ ] Font file uploads (not just whitelisted fonts)

## Troubleshooting

See [THEME_MIGRATION_GUIDE.md](./THEME_MIGRATION_GUIDE.md) for common issues and solutions.

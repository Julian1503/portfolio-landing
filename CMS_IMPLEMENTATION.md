# CMS Implementation Documentation

This document describes the implementation of the Content Management System (CMS) for making all public site sections editable from the Admin panel.

## Overview

The CMS allows administrators to edit:
- **Hero Section**: Eyebrow text, name, tagline, badges, button labels, background media
- **About Section**: Header, biography paragraphs, image, statistics, CTA buttons
- **Contact Section**: Header, description, email, location, availability, Calendly URL
- **Footer Section**: Copyright text and social media links

## Architecture

The implementation follows **SOLID principles** and **Clean Code** practices:

### 1. Database Layer (Prisma Schema)

**Location**: `prisma/schema.prisma`

**Models**:
- `HeroSection`: Singleton model (id="hero_singleton") for hero content
- `AboutSection`: Singleton model (id="about_singleton") for about content
- `ContactSection`: Singleton model (id="contact_singleton") for contact content
- `FooterSection`: Singleton model (id="footer_singleton") for footer settings
- `SocialLink`: One-to-many relation with FooterSection

**Singleton Strategy**: Each section uses a fixed ID to ensure only one record exists. This is suitable for a single-portfolio site.

### 2. Service Layer (Business Logic)

**Location**: `src/lib/cms/`

**Components**:
- **Schemas** (`schemas.ts`): Zod validation schemas for type-safe data validation
- **Interfaces** (`interfaces.ts`): Service and Repository interfaces (Dependency Inversion)
- **Repositories** (`repositories.ts`): Prisma-based data access implementations
- **Services** (`services.ts`): Business logic implementations
- **Public API** (`public.ts`): Public-facing service functions for server components

**Key Principles**:
- **Single Responsibility**: Each service handles one section
- **Dependency Inversion**: Services depend on interfaces, not concrete implementations
- **Open/Closed**: Easy to add new sections without modifying existing code

### 3. API Routes (HTTP Layer)

**Location**: `src/app/api/admin/`

**Endpoints**:
- `GET /api/admin/hero` - Get hero section
- `PUT /api/admin/hero` - Update hero section
- `GET /api/admin/about` - Get about section
- `PUT /api/admin/about` - Update about section
- `GET /api/admin/contact` - Get contact section
- `PUT /api/admin/contact` - Update contact section
- `GET /api/admin/footer` - Get footer section
- `PUT /api/admin/footer` - Update footer section
- `GET /api/admin/footer/social` - List social links
- `POST /api/admin/footer/social` - Create social link
- `PUT /api/admin/footer/social/[id]` - Update social link
- `DELETE /api/admin/footer/social/[id]` - Delete social link

**Error Handling**:
- 400: Validation errors (with Zod error details)
- 404: Resource not found
- 500: Server errors

### 4. Admin UI Components

**Location**: `src/components/admin/cms/`

**Components**:
- `HeroAdminSection.tsx`: Form for editing hero content
- `AboutAdminSection.tsx`: Form for editing about content
- `ContactAdminSection.tsx`: Form for editing contact content
- `FooterAdminSection.tsx`: Form for editing footer and social links

**Features**:
- Real-time form state management
- Success/error message display
- Loading states
- Optimistic UI updates

### 5. Public Site Integration

**Updated Components**:
- `Hero/Hero.tsx`: Accepts content prop from database
- `Hero/HeroContentCard.tsx`: Renders dynamic content
- `Hero/HeroBackground.tsx`: Supports custom background media
- `AboutMe/AboutMe.tsx`: Passes content to child components
- `AboutMe/AboutBio.tsx`: Renders dynamic biography
- `AboutMe/AboutStats.tsx`: Renders dynamic statistics
- `AboutMe/AboutActions.tsx`: Renders dynamic CTA buttons
- `AboutMe/AboutImagePanel.tsx`: Supports custom image
- `Contact/Contact.tsx`: Renders dynamic contact info
- `Contact/ContactEmailCard.tsx`: Dynamic email display
- `Contact/ContactDetails.tsx`: Dynamic location and availability
- `Footer/Footer.tsx`: Renders dynamic footer
- `Footer/SocialLinks.tsx`: Renders dynamic social links

**Data Flow**:
1. Server component (`app/page.tsx`) fetches data using public service functions
2. Data is passed as props to client components
3. Client components render dynamic content

## Database Migration

### Initial Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure database** (in `.env`):
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
   ```

3. **Generate Prisma client**:
   ```bash
   npm run prisma:generate
   ```

4. **Create migration**:
   ```bash
   npx prisma migrate dev --name add_cms_models
   ```

5. **Seed initial data**:
   ```bash
   npm run prisma:seed
   ```

### Seed Data

The seed file (`prisma/seed.ts`) populates:
- Hero section with current hardcoded values
- About section with current hardcoded values
- Contact section with current hardcoded values
- Footer section with existing social links (Instagram, LinkedIn)

This ensures a smooth migration from hardcoded content to database-driven content.

## Usage

### Admin Panel

1. Navigate to `/admin`
2. Select a section from the sidebar (Hero, About, Contact, Footer)
3. Edit fields as needed
4. Click "Save Changes"

### Adding New Sections

To add a new editable section (e.g., "Testimonials"):

1. **Add Prisma model** in `schema.prisma`:
   ```prisma
   model TestimonialsSection {
     id        String @id @default("testimonials_singleton")
     title     String
     items     TestimonialItem[]
     // ... other fields
   }
   ```

2. **Create schema** in `src/lib/cms/schemas.ts`:
   ```typescript
   export const TestimonialsSectionSchema = z.object({
     // ... field definitions
   });
   ```

3. **Create interfaces** in `src/lib/cms/interfaces.ts`:
   ```typescript
   export interface ITestimonialsRepository {
     findUnique(): Promise<TestimonialsSectionDTO | null>;
     upsert(data: TestimonialsSectionUpdateDTO): Promise<TestimonialsSectionDTO>;
   }
   ```

4. **Implement repository** in `src/lib/cms/repositories.ts`

5. **Implement service** in `src/lib/cms/services.ts`

6. **Create API routes** in `src/app/api/admin/testimonials/route.ts`

7. **Create admin UI** in `src/components/admin/cms/TestimonialsAdminSection.tsx`

8. **Update public component** to fetch and render data

No changes needed to existing code!

## Security Considerations

### Authentication

Currently, no authentication is implemented for admin routes. **Before deploying to production**, implement:

1. **NextAuth.js** or similar authentication library
2. **Role-based access control** (RBAC) for admin routes
3. **Middleware** to protect `/api/admin/*` and `/admin` routes

### Input Validation

- All API routes validate input using **Zod schemas**
- Type safety enforced at compile time with TypeScript
- SQL injection prevented by Prisma's parameterized queries

### Content Security

- Escape user input when rendering HTML
- Validate URLs to prevent XSS attacks
- Sanitize file uploads (if implemented)

## Testing

### Unit Tests (Recommended)

Test each layer independently:

```typescript
// Example: Testing HeroService
describe('HeroService', () => {
  it('should get hero content', async () => {
    const mockRepo = {
      findUnique: jest.fn().mockResolvedValue(mockHeroData)
    };
    const service = new HeroService(mockRepo);
    const result = await service.getHero();
    expect(result).toEqual(mockHeroData);
  });
});
```

### Integration Tests (Recommended)

Test API routes:

```typescript
// Example: Testing /api/admin/hero
describe('GET /api/admin/hero', () => {
  it('should return hero content', async () => {
    const response = await fetch('/api/admin/hero');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('name');
  });
});
```

### Manual Testing Checklist

- [ ] Create new content in admin panel
- [ ] Update existing content
- [ ] Verify changes appear on public site
- [ ] Test validation errors (empty fields, invalid URLs)
- [ ] Test error states (server errors, network failures)
- [ ] Test loading states
- [ ] Test responsive design on mobile
- [ ] Test accessibility (keyboard navigation, screen readers)

## Performance Considerations

1. **Caching**: Consider adding cache headers to API responses
2. **Revalidation**: Use Next.js ISR (Incremental Static Regeneration) for public pages
3. **Memoization**: Used in components to prevent unnecessary re-renders
4. **Database Indexing**: Singleton queries are already optimized with unique IDs

## Future Enhancements

1. **Image Upload**: Replace URL inputs with file upload + Cloudinary integration
2. **Rich Text Editor**: Use a WYSIWYG editor for biography and description fields
3. **Preview Mode**: Preview changes before publishing
4. **Version History**: Track content changes over time
5. **Multi-language Support**: Add i18n for multiple languages
6. **SEO Metadata**: Add editable meta tags for each section
7. **A/B Testing**: Test different versions of content
8. **Analytics Integration**: Track which content performs best

## Troubleshooting

### Build Errors

- **Font loading errors**: Network issue, not related to CMS implementation
- **TypeScript errors**: Ensure all Prisma types are generated (`npm run prisma:generate`)

### Runtime Errors

- **"Section not found"**: Run seed script to populate initial data
- **Validation errors**: Check Zod schema constraints match form inputs
- **Database errors**: Verify `DATABASE_URL` is correct in `.env`

## Contributing

When adding new features:

1. Follow existing code structure and naming conventions
2. Add TypeScript types for all new data structures
3. Add Zod validation for all API inputs
4. Write tests for new functionality
5. Update this documentation

## References

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev/)
- [Next.js Documentation](https://nextjs.org/docs)

# Component Architecture

This document describes the component organization and structure for the portfolio landing page.

## Overview

The components are organized following Clean Code and SOLID principles, with each major feature having its own folder containing related sub-components.

## Folder Structure

```
src/components/
├── Hero/                    # Landing hero section
│   ├── Hero.tsx            # Main container component
│   ├── HeroBackground.tsx  # Background video component
│   ├── HeroContentCard.tsx # Content card with name and actions
│   ├── ScrollCue.tsx       # Scroll indicator animation
│   └── index.ts            # Public exports
│
├── AboutMe/                 # About section
│   ├── AboutMe.tsx         # Main container component
│   ├── AboutBio.tsx        # Biography text component
│   ├── AboutStats.tsx      # Statistics display component
│   ├── AboutActions.tsx    # CTA buttons component
│   ├── AboutImagePanel.tsx # Image display component
│   └── index.ts            # Public exports
│
├── Projects/                # Projects section
│   ├── Projects.tsx        # Main container with grid
│   ├── ProjectCard.tsx     # Individual project card
│   └── index.ts            # Public exports
│
├── ProjectDetail/           # Project detail page
│   ├── ProjectDetailClient.tsx  # Main page component
│   ├── ProjectHeader.tsx        # Navigation header
│   ├── ProjectGallery.tsx       # Image carousel
│   ├── ProjectContent.tsx       # Project description and posts
│   ├── ProjectSidebar.tsx       # Project metadata sidebar
│   ├── ThumbnailGallery.tsx     # Thumbnail navigation
│   └── index.ts                 # Public exports
│
├── Contact/                 # Contact section
│   ├── Contact.tsx         # Main container component
│   ├── ContactEmailCard.tsx # Email information card
│   ├── ContactDetails.tsx  # Location and availability
│   ├── ContactForm.tsx     # Contact form component
│   └── index.ts            # Public exports
│
├── Navbar/                  # Navigation bar
│   ├── Navbar.tsx          # Main navigation component
│   ├── DesktopMenu.tsx     # Desktop menu items
│   ├── MobileMenu.tsx      # Mobile menu drawer
│   └── index.ts            # Public exports
│
├── Footer/                  # Footer section
│   ├── Footer.tsx          # Main footer component
│   ├── SocialLinks.tsx     # Social media links
│   └── index.ts            # Public exports
│
├── admin/                   # Admin panel components
│   ├── AdminLayout.tsx
│   ├── DataTable.tsx
│   ├── EntityModalForm.tsx
│   ├── CellWithTooltip.tsx
│   └── projects/           # Project admin components
│
└── [shared components]      # Shared UI components
    ├── Button.tsx
    ├── Section.tsx
    ├── SectionHeader.tsx
    ├── InfoCard.tsx
    ├── CustomCursor.tsx
    └── SmoothScroll.tsx
```

## Design Principles

### Single Responsibility Principle (SRP)
Each component has a single, well-defined responsibility:
- Container components manage state and coordinate sub-components
- Presentational components focus on rendering UI
- Sub-components handle specific pieces of functionality

### Component Organization
- **Folder per Feature**: Each major feature has its own folder
- **Index Files**: Each folder exports its public API through index.ts
- **Co-location**: Related components are kept together
- **Clear Naming**: Component names clearly indicate their purpose

### Import Strategy
```typescript
// External imports - Import from the folder index
import Hero from "@/components/Hero";

// Internal imports - Import from relative path
import { HeroBackground } from "./HeroBackground";
```

## Component Types

### Container Components
Manage state and orchestrate sub-components:
- `Hero.tsx`
- `AboutMe.tsx`
- `Projects.tsx`
- `Contact.tsx`
- `ProjectDetailClient.tsx`

### Presentational Components
Focus on rendering UI with props:
- `HeroContentCard.tsx`
- `ProjectCard.tsx`
- `ContactForm.tsx`
- `SocialLinks.tsx`

### Shared Components
Reusable across the application:
- `Button.tsx`
- `Section.tsx`
- `SectionHeader.tsx`
- `InfoCard.tsx`

## Benefits

1. **Better Maintainability**: Easy to locate and modify specific functionality
2. **Improved Readability**: Clear structure makes code easier to understand
3. **Scalability**: Easy to add new features or components
4. **Reusability**: Components can be easily imported and reused
5. **Testing**: Isolated components are easier to test
6. **Collaboration**: Clear boundaries make team collaboration easier

## Migration Guide

If you need to import a component:

```typescript
// Old way (if components were flat)
import Hero from "@/components/Hero";
import HeroBackground from "@/components/HeroBackground";

// New way
import Hero from "@/components/Hero";
import { HeroBackground } from "@/components/Hero";
```

## Future Improvements

Consider these enhancements as the project grows:
- Add unit tests for each component
- Create Storybook stories for component documentation
- Add PropTypes or TypeScript interfaces for better type safety
- Consider creating a design system folder for design tokens
- Add component composition patterns for more flexibility

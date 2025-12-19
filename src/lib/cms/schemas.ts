import { z } from "zod";

// ============================================
// Hero Section
// ============================================

export const HeroSectionSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().min(1, "Eyebrow is required"),
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  badge1: z.string().min(1, "Badge 1 is required"),
  badge2: z.string().min(1, "Badge 2 is required"),
  projectsLabel: z.string().min(1, "Projects label is required"),
  contactLabel: z.string().min(1, "Contact label is required"),
  backgroundImage: z.string().url().optional().nullable(),
  backgroundVideo: z.string().url().optional().nullable(),
});

export type HeroSectionDTO = z.infer<typeof HeroSectionSchema>;

export const HeroSectionUpdateSchema = HeroSectionSchema.partial().required({
  id: false,
});

export type HeroSectionUpdateDTO = z.infer<typeof HeroSectionUpdateSchema>;

// ============================================
// About Section
// ============================================

export const AboutSectionSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().min(1, "Eyebrow is required"),
  title: z.string().min(1, "Title is required"),
  paragraph1: z.string().min(1, "Paragraph 1 is required"),
  paragraph2: z.string().min(1, "Paragraph 2 is required"),
  paragraph3: z.string().min(1, "Paragraph 3 is required"),
  imageUrl: z.string().url().optional().nullable(),
  imageAlt: z.string().min(1, "Image alt text is required"),
  stat1Value: z.string().min(1, "Stat 1 value is required"),
  stat1Label: z.string().min(1, "Stat 1 label is required"),
  stat2Value: z.string().min(1, "Stat 2 value is required"),
  stat2Label: z.string().min(1, "Stat 2 label is required"),
  stat3Value: z.string().min(1, "Stat 3 value is required"),
  stat3Label: z.string().min(1, "Stat 3 label is required"),
  cta1Label: z.string().min(1, "CTA 1 label is required"),
  cta1Url: z.string().min(1, "CTA 1 URL is required"),
  cta2Label: z.string().min(1, "CTA 2 label is required"),
  cta2Url: z.string().url("CTA 2 URL must be valid"),
});

export type AboutSectionDTO = z.infer<typeof AboutSectionSchema>;

export const AboutSectionUpdateSchema = AboutSectionSchema.partial().required({
  id: false,
});

export type AboutSectionUpdateDTO = z.infer<typeof AboutSectionUpdateSchema>;

// ============================================
// Contact Section
// ============================================

export const ContactSectionSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().min(1, "Eyebrow is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  email: z.string().email("Must be a valid email"),
  location: z.string().min(1, "Location is required"),
  availability: z.string().min(1, "Availability is required"),
  calendlyUrl: z.string().url().optional().nullable(),
});

export type ContactSectionDTO = z.infer<typeof ContactSectionSchema>;

export const ContactSectionUpdateSchema = ContactSectionSchema.partial().required({
  id: false,
});

export type ContactSectionUpdateDTO = z.infer<typeof ContactSectionUpdateSchema>;

// ============================================
// Footer Section
// ============================================

export const SocialLinkSchema = z.object({
  id: z.string().optional(),
  footerId: z.string().optional(),
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
  order: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export type SocialLinkDTO = z.infer<typeof SocialLinkSchema>;

export const FooterSectionSchema = z.object({
  id: z.string().optional(),
  copyrightText: z.string().optional().nullable(),
  socialLinks: z.array(SocialLinkSchema).optional(),
});

export type FooterSectionDTO = z.infer<typeof FooterSectionSchema>;

export const FooterSectionUpdateSchema = FooterSectionSchema.partial().required({
  id: false,
});

export type FooterSectionUpdateDTO = z.infer<typeof FooterSectionUpdateSchema>;

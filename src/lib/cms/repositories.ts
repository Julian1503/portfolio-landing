import prisma from "@/lib/prisma";
import type {
  IHeroRepository,
  IAboutRepository,
  IContactRepository,
  IFooterRepository,
  ISocialLinkRepository,
} from "./interfaces";
import type {
  HeroSectionDTO,
  HeroSectionUpdateDTO,
  AboutSectionDTO,
  AboutSectionUpdateDTO,
  ContactSectionDTO,
  ContactSectionUpdateDTO,
  FooterSectionDTO,
  FooterSectionUpdateDTO,
  SocialLinkDTO,
} from "./schemas";

const HERO_ID = "hero_singleton";
const ABOUT_ID = "about_singleton";
const CONTACT_ID = "contact_singleton";
const FOOTER_ID = "footer_singleton";

// ============================================
// Hero Repository Implementation
// ============================================

export class HeroRepository implements IHeroRepository {
  async findUnique(): Promise<HeroSectionDTO | null> {
    const hero = await prisma.heroSection.findUnique({
      where: { id: HERO_ID },
    });
    return hero;
  }

  async upsert(data: HeroSectionUpdateDTO): Promise<HeroSectionDTO> {
    const hero = await prisma.heroSection.upsert({
      where: { id: HERO_ID },
      update: data,
      create: {
        id: HERO_ID,
        eyebrow: data.eyebrow ?? "Portfolio",
        name: data.name ?? "Your Name",
        tagline: data.tagline ?? "Your tagline here",
        badge1: data.badge1 ?? "Badge 1",
        badge2: data.badge2 ?? "Badge 2",
        projectsLabel: data.projectsLabel ?? "View Projects",
        contactLabel: data.contactLabel ?? "Get in Touch",
        backgroundImage: data.backgroundImage,
        backgroundVideo: data.backgroundVideo,
      },
    });
    return hero;
  }
}

// ============================================
// About Repository Implementation
// ============================================

export class AboutRepository implements IAboutRepository {
  async findUnique(): Promise<AboutSectionDTO | null> {
    const about = await prisma.aboutSection.findUnique({
      where: { id: ABOUT_ID },
    });
    return about;
  }

  async upsert(data: AboutSectionUpdateDTO): Promise<AboutSectionDTO> {
    const about = await prisma.aboutSection.upsert({
      where: { id: ABOUT_ID },
      update: data,
      create: {
        id: ABOUT_ID,
        eyebrow: data.eyebrow ?? "About",
        title: data.title ?? "Title",
        paragraph1: data.paragraph1 ?? "",
        paragraph2: data.paragraph2 ?? "",
        paragraph3: data.paragraph3 ?? "",
        imageUrl: data.imageUrl,
        imageAlt: data.imageAlt ?? "Profile image",
        stat1Value: data.stat1Value ?? "1",
        stat1Label: data.stat1Label ?? "Label 1",
        stat2Value: data.stat2Value ?? "2",
        stat2Label: data.stat2Label ?? "Label 2",
        stat3Value: data.stat3Value ?? "3",
        stat3Label: data.stat3Label ?? "Label 3",
        cta1Label: data.cta1Label ?? "CTA 1",
        cta1Url: data.cta1Url ?? "#",
        cta2Label: data.cta2Label ?? "CTA 2",
        cta2Url: data.cta2Url ?? "#",
      },
    });
    return about;
  }
}

// ============================================
// Contact Repository Implementation
// ============================================

export class ContactRepository implements IContactRepository {
  async findUnique(): Promise<ContactSectionDTO | null> {
    const contact = await prisma.contactSection.findUnique({
      where: { id: CONTACT_ID },
    });
    return contact;
  }

  async upsert(data: ContactSectionUpdateDTO): Promise<ContactSectionDTO> {
    const contact = await prisma.contactSection.upsert({
      where: { id: CONTACT_ID },
      update: data,
      create: {
        id: CONTACT_ID,
        eyebrow: data.eyebrow ?? "Contact",
        title: data.title ?? "Get in Touch",
        description: data.description ?? "",
        email: data.email ?? "email@example.com",
        location: data.location ?? "Location",
        availability: data.availability ?? "Available",
        calendlyUrl: data.calendlyUrl,
      },
    });
    return contact;
  }
}

// ============================================
// Footer Repository Implementation
// ============================================

export class FooterRepository implements IFooterRepository {
  async findUnique(): Promise<FooterSectionDTO | null> {
    const footer = await prisma.footerSection.findUnique({
      where: { id: FOOTER_ID },
      include: {
        socialLinks: {
          where: { isVisible: true },
          orderBy: { order: "asc" },
        },
      },
    });
    return footer;
  }

  async upsert(data: FooterSectionUpdateDTO): Promise<FooterSectionDTO> {
    const { socialLinks, ...footerData } = data;
    
    const footer = await prisma.footerSection.upsert({
      where: { id: FOOTER_ID },
      update: footerData,
      create: {
        id: FOOTER_ID,
        copyrightText: footerData.copyrightText,
      },
      include: {
        socialLinks: {
          where: { isVisible: true },
          orderBy: { order: "asc" },
        },
      },
    });
    
    return footer;
  }
}

// ============================================
// Social Link Repository Implementation
// ============================================

export class SocialLinkRepository implements ISocialLinkRepository {
  async findMany(footerId: string): Promise<SocialLinkDTO[]> {
    const links = await prisma.socialLink.findMany({
      where: { footerId },
      orderBy: { order: "asc" },
    });
    return links;
  }

  async create(data: Omit<SocialLinkDTO, "id">): Promise<SocialLinkDTO> {
    const link = await prisma.socialLink.create({
      data: {
        footerId: data.footerId ?? FOOTER_ID,
        platform: data.platform,
        url: data.url,
        order: data.order ?? 0,
        isVisible: data.isVisible ?? true,
      },
    });
    return link;
  }

  async update(id: string, data: Partial<SocialLinkDTO>): Promise<SocialLinkDTO> {
    const link = await prisma.socialLink.update({
      where: { id },
      data,
    });
    return link;
  }

  async delete(id: string): Promise<void> {
    await prisma.socialLink.delete({
      where: { id },
    });
  }

  async reorder(footerId: string, linkIds: string[]): Promise<void> {
    // Update order for each link in a transaction
    await prisma.$transaction(
      linkIds.map((id, index) =>
        prisma.socialLink.update({
          where: { id },
          data: { order: index },
        })
      )
    );
  }
}

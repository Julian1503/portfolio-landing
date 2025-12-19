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
        ...data,
      } as never,
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
        ...data,
      } as never,
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
        ...data,
      } as never,
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
        ...footerData,
      } as never,
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

  async create(data: Omit<SocialLinkDTO, "id" | "createdAt">): Promise<SocialLinkDTO> {
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

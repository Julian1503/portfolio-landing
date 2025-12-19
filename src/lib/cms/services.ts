import type {
  IHeroService,
  IAboutService,
  IContactService,
  IFooterService,
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
import {
  HeroRepository,
  AboutRepository,
  ContactRepository,
  FooterRepository,
  SocialLinkRepository,
} from "./repositories";

const FOOTER_ID = "footer_singleton";

// ============================================
// Hero Service Implementation
// ============================================

export class HeroService implements IHeroService {
  constructor(private repository: IHeroRepository = new HeroRepository()) {}

  async getHero(): Promise<HeroSectionDTO> {
    const hero = await this.repository.findUnique();
    if (!hero) {
      throw new Error("Hero section not found");
    }
    return hero;
  }

  async updateHero(data: HeroSectionUpdateDTO): Promise<HeroSectionDTO> {
    return await this.repository.upsert(data);
  }
}

// ============================================
// About Service Implementation
// ============================================

export class AboutService implements IAboutService {
  constructor(private repository: IAboutRepository = new AboutRepository()) {}

  async getAbout(): Promise<AboutSectionDTO> {
    const about = await this.repository.findUnique();
    if (!about) {
      throw new Error("About section not found");
    }
    return about;
  }

  async updateAbout(data: AboutSectionUpdateDTO): Promise<AboutSectionDTO> {
    return await this.repository.upsert(data);
  }
}

// ============================================
// Contact Service Implementation
// ============================================

export class ContactService implements IContactService {
  constructor(private repository: IContactRepository = new ContactRepository()) {}

  async getContact(): Promise<ContactSectionDTO> {
    const contact = await this.repository.findUnique();
    if (!contact) {
      throw new Error("Contact section not found");
    }
    return contact;
  }

  async updateContact(data: ContactSectionUpdateDTO): Promise<ContactSectionDTO> {
    return await this.repository.upsert(data);
  }
}

// ============================================
// Footer Service Implementation
// ============================================

export class FooterService implements IFooterService {
  constructor(
    private footerRepository: IFooterRepository = new FooterRepository(),
    private socialLinkRepository: ISocialLinkRepository = new SocialLinkRepository()
  ) {}

  async getFooter(): Promise<FooterSectionDTO> {
    const footer = await this.footerRepository.findUnique();
    if (!footer) {
      throw new Error("Footer section not found");
    }
    return footer;
  }

  async updateFooter(data: FooterSectionUpdateDTO): Promise<FooterSectionDTO> {
    return await this.footerRepository.upsert(data);
  }

  async getSocialLinks(): Promise<SocialLinkDTO[]> {
    return await this.socialLinkRepository.findMany(FOOTER_ID);
  }

  async createSocialLink(data: Omit<SocialLinkDTO, "id" | "createdAt">): Promise<SocialLinkDTO> {
    return await this.socialLinkRepository.create({
      ...data,
      footerId: FOOTER_ID,
    });
  }

  async updateSocialLink(id: string, data: Partial<SocialLinkDTO>): Promise<SocialLinkDTO> {
    return await this.socialLinkRepository.update(id, data);
  }

  async deleteSocialLink(id: string): Promise<void> {
    await this.socialLinkRepository.delete(id);
  }

  async reorderSocialLinks(linkIds: string[]): Promise<void> {
    await this.socialLinkRepository.reorder(FOOTER_ID, linkIds);
  }
}

// ============================================
// Service Factory (for dependency injection)
// ============================================

export function createHeroService(): IHeroService {
  return new HeroService();
}

export function createAboutService(): IAboutService {
  return new AboutService();
}

export function createContactService(): IContactService {
  return new ContactService();
}

export function createFooterService(): IFooterService {
  return new FooterService();
}

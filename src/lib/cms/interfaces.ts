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

// ============================================
// Repository Interfaces (Data Access Layer)
// ============================================

export interface IHeroRepository {
  findUnique(): Promise<HeroSectionDTO | null>;
  upsert(data: HeroSectionUpdateDTO): Promise<HeroSectionDTO>;
}

export interface IAboutRepository {
  findUnique(): Promise<AboutSectionDTO | null>;
  upsert(data: AboutSectionUpdateDTO): Promise<AboutSectionDTO>;
}

export interface IContactRepository {
  findUnique(): Promise<ContactSectionDTO | null>;
  upsert(data: ContactSectionUpdateDTO): Promise<ContactSectionDTO>;
}

export interface IFooterRepository {
  findUnique(): Promise<FooterSectionDTO | null>;
  upsert(data: FooterSectionUpdateDTO): Promise<FooterSectionDTO>;
}

export interface ISocialLinkRepository {
  findMany(footerId: string): Promise<SocialLinkDTO[]>;
  create(data: Omit<SocialLinkDTO, "id" | "createdAt">): Promise<SocialLinkDTO>;
  update(id: string, data: Partial<SocialLinkDTO>): Promise<SocialLinkDTO>;
  delete(id: string): Promise<void>;
  reorder(footerId: string, linkIds: string[]): Promise<void>;
}

// ============================================
// Service Interfaces (Business Logic Layer)
// ============================================

export interface IHeroService {
  getHero(): Promise<HeroSectionDTO>;
  updateHero(data: HeroSectionUpdateDTO): Promise<HeroSectionDTO>;
}

export interface IAboutService {
  getAbout(): Promise<AboutSectionDTO>;
  updateAbout(data: AboutSectionUpdateDTO): Promise<AboutSectionDTO>;
}

export interface IContactService {
  getContact(): Promise<ContactSectionDTO>;
  updateContact(data: ContactSectionUpdateDTO): Promise<ContactSectionDTO>;
}

export interface IFooterService {
  getFooter(): Promise<FooterSectionDTO>;
  updateFooter(data: FooterSectionUpdateDTO): Promise<FooterSectionDTO>;
  getSocialLinks(): Promise<SocialLinkDTO[]>;
  createSocialLink(data: Omit<SocialLinkDTO, "id" | "createdAt">): Promise<SocialLinkDTO>;
  updateSocialLink(id: string, data: Partial<SocialLinkDTO>): Promise<SocialLinkDTO>;
  deleteSocialLink(id: string): Promise<void>;
  reorderSocialLinks(linkIds: string[]): Promise<void>;
}

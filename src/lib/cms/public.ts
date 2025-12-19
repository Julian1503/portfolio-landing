import {
  createHeroService,
  createAboutService,
  createContactService,
  createFooterService,
} from "./services";
import type {
  HeroSectionDTO,
  AboutSectionDTO,
  ContactSectionDTO,
  FooterSectionDTO,
} from "./schemas";

/**
 * Public-facing service functions for fetching CMS content
 * These can be called from Next.js server components
 */

export async function getHeroContent(): Promise<HeroSectionDTO> {
  const service = createHeroService();
  return await service.getHero();
}

export async function getAboutContent(): Promise<AboutSectionDTO> {
  const service = createAboutService();
  return await service.getAbout();
}

export async function getContactContent(): Promise<ContactSectionDTO> {
  const service = createContactService();
  return await service.getContact();
}

export async function getFooterContent(): Promise<FooterSectionDTO> {
  const service = createFooterService();
  return await service.getFooter();
}

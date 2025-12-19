"use client"
import { SocialLinks } from "./SocialLinks";
import type { FooterSectionDTO } from "@/lib/cms/schemas";

type FooterProps = {
    content: FooterSectionDTO;
};

const Footer = ({ content }: FooterProps) => {
    return(
        <footer className="flex flex-col justify-between items-center w-full px-10 py-6 bg-[var(--theme-bg-secondary)]">
            <div className="w-full border-1 border-[var(--theme-border)]"/>
            <SocialLinks links={content.socialLinks || []} />
            {content.copyrightText && (
                <p className="mt-4 text-xs text-[var(--theme-text-muted)]">{content.copyrightText}</p>
            )}
        </footer>
    )
};
export default Footer;
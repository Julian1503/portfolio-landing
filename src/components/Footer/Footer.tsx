"use client"
import { SocialLinks } from "./SocialLinks";
import type { FooterSectionDTO } from "@/lib/cms/schemas";

type FooterProps = {
    content: FooterSectionDTO;
};

const Footer = ({ content }: FooterProps) => {
    return(
        <footer className="flex flex-col justify-between items-center w-full px-10 py-6">
            <div className="w-full border-1 text-gray-200"/>
            <SocialLinks links={content.socialLinks || []} />
            {content.copyrightText && (
                <p className="mt-4 text-xs text-slate-500">{content.copyrightText}</p>
            )}
        </footer>
    )
};
export default Footer;
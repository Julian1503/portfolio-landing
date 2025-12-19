import React from "react";
import { PiFacebookLogo, PiInstagramLogo, PiLinkedinLogo } from "react-icons/pi";
import type { SocialLinkDTO } from "@/lib/cms/schemas";

type SocialIconProps = {
    href: string;
    Icon: React.ComponentType<{ size: number; className: string; onClick: () => void }>;
    hoverColor: string;
};

const SocialIcon: React.FC<SocialIconProps> = ({ href, Icon, hoverColor }) => (
    <Icon
        size={22}
        onClick={() => window.open(href, '_blank')}
        className={`text-[var(--theme-text-muted)] transition-all duration-300 cursor-pointer hover:scale-110 ${hoverColor}`}
    />
);

const platformIcons: Record<string, {
    Icon: typeof PiInstagramLogo;
    hoverColor: string;
}> = {
    instagram: { Icon: PiInstagramLogo, hoverColor: "hover:text-[#E1306C]" },
    linkedin: { Icon: PiLinkedinLogo, hoverColor: "hover:text-[#0077B5]" },
    facebook: { Icon: PiFacebookLogo, hoverColor: "hover:text-[#1877F2]" },
};

type SocialLinksProps = {
    links: SocialLinkDTO[];
};

export const SocialLinks = ({ links }: SocialLinksProps) => {
    const visibleLinks = links.filter(link => link.isVisible);
    
    return (
        <div className="flex flex-row gap-2">
            {visibleLinks.map((link) => {
                const platformConfig = platformIcons[link.platform.toLowerCase()];
                if (!platformConfig) return null;
                
                return (
                    <SocialIcon
                        key={link.id}
                        href={link.url}
                        Icon={platformConfig.Icon}
                        hoverColor={platformConfig.hoverColor}
                    />
                );
            })}
        </div>
    );
};

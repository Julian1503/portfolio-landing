import React from "react";
import { PiFacebookLogo, PiInstagramLogo, PiLinkedinLogo } from "react-icons/pi";

type SocialIconProps = {
    href: string;
    Icon: React.ComponentType<{ size: number; className: string; onClick: () => void }>;
    hoverColor: string;
};

const SocialIcon: React.FC<SocialIconProps> = ({ href, Icon, hoverColor }) => (
    <Icon
        size={22}
        onClick={() => window.open(href, '_blank')}
        className={`text-slate-400 transition-all duration-300 cursor-pointer hover:scale-110 ${hoverColor}`}
    />
);

export const SocialLinks = () => {
    return (
        <div className="flex flex-row gap-2">
            <SocialIcon
                href="https://www.instagram.com/mlourdes.arch/"
                Icon={PiInstagramLogo}
                hoverColor="hover:text-[#E1306C]"
            />
            <SocialIcon
                href="https://www.linkedin.com/in/mlourdesynigo/"
                Icon={PiLinkedinLogo}
                hoverColor="hover:text-[#0077B5]"
            />
            {/* TODO: Update with correct Facebook profile URL */}
            {/* <SocialIcon
                href="https://www.facebook.com/mlourdes.arch/"
                Icon={PiFacebookLogo}
                hoverColor="hover:text-[#1877F2]"
            /> */}
        </div>
    );
};

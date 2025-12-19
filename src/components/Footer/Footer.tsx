"use client"
import { SocialLinks } from "./SocialLinks";

const Footer = () => {
    return(
        <footer className="flex flex-col justify-between items-center w-full px-10">
            <div className="w-full border-1 text-gray-200"/>
            <SocialLinks />
        </footer>
    )
};
export default Footer;
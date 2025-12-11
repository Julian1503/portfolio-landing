import {PiFacebookLogo, PiInstagramLogo, PiLinkedinLogo} from "react-icons/pi";
import {Instagram} from "lucide-react";

const Footer = () => {
    return(
        <footer className="flex flex-col justify-between items-center w-full px-10">
            <div className="w-full border-1 text-gray-200"/>
            <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:justify-between w-full px-10 py-4">
                <div className="flex flex-row gap-2">
                    <PiInstagramLogo size={22}
                                     className="text-gray-500 transition-colors duration-300 cursor-pointer hover:text-[#E1306C]" />
                    <PiLinkedinLogo size={22}
                                    className="text-gray-500 transition-colors duration-300 cursor-pointer hover:text-[#0077B5]" />
                    <PiFacebookLogo size={22}
                                    className="text-gray-500 transition-colors duration-300 cursor-pointer hover:text-[#1877F2]" />
                </div>
                <p className="text-[13px] md:text-sm text-gray-500">
                    Website by <a className="hover:text-[#A35FF2] cursor-pointer" href="https://www.linkedin.com/in/julianedelgado/">Julian Delgado</a>
                </p>
            </div>
        </footer>
    )
};
export default Footer;
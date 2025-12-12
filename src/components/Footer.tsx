import {PiFacebookLogo, PiInstagramLogo, PiLinkedinLogo} from "react-icons/pi";
import {Instagram} from "lucide-react";

const Footer = () => {
    return(
        <footer className="flex flex-col justify-between items-center w-full px-10">
            <div className="w-full border-1 text-gray-200"/>
            <div className="flex flex-row gap-2">
                <PiInstagramLogo
                    size={22}
                    className="text-slate-400 transition-all duration-300 cursor-pointer hover:text-[#E1306C] hover:scale-110"
                />
                <PiLinkedinLogo
                    size={22}
                    className="text-slate-400 transition-all duration-300 cursor-pointer hover:text-[#0077B5] hover:scale-110"
                />
                <PiFacebookLogo
                    size={22}
                    className="text-slate-400 transition-all duration-300 cursor-pointer hover:text-[#1877F2] hover:scale-110"
                />
            </div>
        </footer>
    )
};
export default Footer;
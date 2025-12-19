import React from "react";
import type { NavigationItem } from "@/lib/config/navigation";

type DesktopMenuProps = {
    options: NavigationItem[];
    onNavigate: (targetId: string) => void;
};

export const DesktopMenu: React.FC<DesktopMenuProps> = ({ options, onNavigate }) => {
    return (
        <ul className="hidden md:flex flex-row gap-10">
            {options.map((option) => (
                <li
                    key={option.targetId}
                    onClick={() => onNavigate(option.targetId)}
                    className="group flex flex-col items-center text-xs font-semibold tracking-wide cursor-pointer text-[var(--theme-text)]"
                >
                    {option.label.toUpperCase()}
                    <span className="mt-1 h-[2px] w-0 bg-[var(--theme-primary)] transition-all duration-300 ease-in-out group-hover:w-full" />
                </li>
            ))}
        </ul>
    );
};

import React from "react";
import type { NavigationItem } from "@/lib/config/navigation";

type MobileMenuButtonProps = {
    isOpen: boolean;
    onClick: () => void;
};

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onClick }) => {
    return (
        <button
            className="md:hidden inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm text-gray-800"
            onClick={onClick}
            aria-label="Toggle navigation"
        >
            <div className="space-y-1">
                <span className={`block h-0.5 w-5 bg-gray-800 transition ${isOpen ? "translate-y-1.5 rotate-45" : ""}`} />
                <span className={`block h-0.5 w-5 bg-gray-800 transition ${isOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-gray-800 transition ${isOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </div>
        </button>
    );
};

type MobileMenuProps = {
    isOpen: boolean;
    options: NavigationItem[];
    onNavigate: (targetId: string) => void;
};

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, options, onNavigate }) => {
    return (
        <div
            className={`md:hidden border-t bg-white/95 transition-all overflow-hidden ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
            <ul className="flex flex-col gap-4 px-6 py-6 text-sm font-semibold">
                {options.map((option) => (
                    <li key={option.targetId}>
                        <button
                            type="button"
                            className="cursor-pointer text-gray-800"
                            onClick={() => onNavigate(option.targetId)}
                        >
                            {option.label.toUpperCase()}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

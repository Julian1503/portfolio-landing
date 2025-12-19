export type NavigationItem = {
    label: string;
    targetId: string;
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
    { label: "Home", targetId: "home" },
    { label: "About Me", targetId: "about" },
    { label: "Projects", targetId: "projects" },
    { label: "Contact", targetId: "contact" },
];

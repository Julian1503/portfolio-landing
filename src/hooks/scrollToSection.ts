export function scrollToSection(sectionId: string): boolean {
    const element = document.getElementById(sectionId);

    if (!element) {
        return false;
    }

    element.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
}

export function scrollToSection (sectionId: string) {
    const element = document.getElementById(sectionId);
    console.log(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
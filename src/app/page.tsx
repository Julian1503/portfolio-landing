import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import AboutMe from "@/components/AboutMe";
import ContactSection from "@/components/Contact";
import {getProjects} from "@/lib/project/projects.service";
import {ProjectsClient} from "@/components/Projects";
import {NAVIGATION_ITEMS} from "@/lib/config/navigation";
import {
    getHeroContent,
    getAboutContent,
    getContactContent,
    getFooterContent,
} from "@/lib/cms/public";

export default async function Home() {
    // Fetch all content in parallel
    const [projects, heroContent, aboutContent, contactContent, footerContent] = await Promise.all([
        getProjects(),
        getHeroContent(),
        getAboutContent(),
        getContactContent(),
        getFooterContent(),
    ]);

    return (
    <>
        <div className="relative flex flex-col items-center w-full m-auto overscroll-y-contain">
            <div className="flex flex-col items-center w-full min-h-screen max-h-screen" >
                <Navbar options={NAVIGATION_ITEMS} />
                <Hero content={heroContent} />
            </div>
            <AboutMe content={aboutContent} />
            <ProjectsClient projects={projects} />
            <ContactSection content={contactContent} />
            <Footer content={footerContent} />
        </div>
    </>
  );
}

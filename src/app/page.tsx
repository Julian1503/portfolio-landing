import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import AboutMe from "@/components/AboutMe";
import ContactSection from "@/components/Contact";
import {getProjects} from "@/lib/project/projects.service";
import {ProjectsClient} from "@/components/Projects";
import {NAVIGATION_ITEMS} from "@/lib/config/navigation";

export default async function Home() {
    const projects = await getProjects();

    return (
    <>
        <div className="relative flex flex-col items-center w-full m-auto overscroll-y-contain">
            <div className="flex flex-col items-center w-full min-h-screen max-h-screen" >
                <Navbar options={NAVIGATION_ITEMS} />
                <Hero />
            </div>
            <AboutMe/>
            <ProjectsClient projects={projects} />
            <ContactSection/>
            <Footer/>
        </div>
    </>
  );
}

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    // Seed CMS sections with current hardcoded content
    console.log('Seeding CMS sections...');
    
    // Hero section
    await prisma.heroSection.upsert({
        where: { id: 'hero_singleton' },
        update: {},
        create: {
            id: 'hero_singleton',
            eyebrow: 'Portfolio',
            name: 'Maria Lourdes Ynigo',
            tagline: 'Residential and commercial design with a focus on context, light and everyday life.',
            badge1: 'Architect',
            badge2: 'Architecture Technician',
            projectsLabel: 'View Projects',
            contactLabel: 'Get in Touch',
        },
    });
    
    // About section
    await prisma.aboutSection.upsert({
        where: { id: 'about_singleton' },
        update: {},
        create: {
            id: 'about_singleton',
            eyebrow: 'Meet the Architect',
            title: 'Design with purpose, built with care',
            paragraph1: "I'm Maria Lourdes Ynigo, an architect with over 5 years of experience creating thoughtful spaces that balance functionality, aesthetics, and human connection.",
            paragraph2: "Trained in Argentina and now based in Queensland, Australia, I bring a unique perspective to every project—combining Latin American warmth with Australian pragmatism.",
            paragraph3: "My approach is simple: listen deeply, design intentionally, and deliver spaces that feel timeless rather than trendy.",
            imageAlt: 'Maria Lourdes Ynigo',
            stat1Value: '5+',
            stat1Label: 'Years of Experience',
            stat2Value: '20+',
            stat2Label: 'Projects Completed',
            stat3Value: '100%',
            stat3Label: 'Client Satisfaction',
            cta1Label: 'Download Resume',
            cta1Url: '#',
            cta2Label: 'View LinkedIn',
            cta2Url: 'https://www.linkedin.com/in/mlourdesynigo/',
        },
    });
    
    // Contact section
    await prisma.contactSection.upsert({
        where: { id: 'contact_singleton' },
        update: {},
        create: {
            id: 'contact_singleton',
            eyebrow: 'Contact',
            title: "Let's work together",
            description: 'For collaborations, job opportunities or project enquiries, feel free to reach out by email or schedule a short call.',
            email: 'mlourdes.ynigo@example.com',
            location: 'Queensland, Australia',
            availability: 'Available for projects',
        },
    });
    
    // Footer section with social links
    const footer = await prisma.footerSection.upsert({
        where: { id: 'footer_singleton' },
        update: {},
        create: {
            id: 'footer_singleton',
        },
    });
    
    // Add social links
    await prisma.socialLink.deleteMany({ where: { footerId: footer.id } });
    await prisma.socialLink.createMany({
        data: [
            {
                footerId: footer.id,
                platform: 'instagram',
                url: 'https://www.instagram.com/mlourdes.arch/',
                order: 1,
                isVisible: true,
            },
            {
                footerId: footer.id,
                platform: 'linkedin',
                url: 'https://www.linkedin.com/in/mlourdesynigo/',
                order: 2,
                isVisible: true,
            },
        ],
    });
    
    console.log('CMS sections seeded successfully!');
    
    // Seed projects
    console.log('Seeding projects...');
    await prisma.project.create({
        data: {
            slug: "lucas-cordoba",
            title: "Lucas Córdoba",
            tag: "Residential Development",
            location: "San Miguel de Tucumán, Argentina",
            year: "2020–2022",

            coverImage: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1765447811/portfolio/slqkqsr8ajxijwaj8vzx.png",
            excerpt:
                "Residential development combining housing and commercial spaces with shared amenities.",
            description:
                "Mixed-use residential project with commercial ground floor, coworking space and shared amenities. Focused on modular design, sustainability and community spaces.",

            status: "BUILT",
            type: "MIXED_USE",
            role: "Architectural Draftsperson",
            tools: ["Revit", "Enscape", "Photoshop"],

            images: {
                create: [
                    {
                        url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1765447811/portfolio/slqkqsr8ajxijwaj8vzx.png",
                        alt: "Exterior render",
                        kind: "RENDER",
                        order: 1,
                    },
                    {
                        url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1765447811/portfolio/slqkqsr8ajxijwaj8vzx.png",
                        alt: "Interior render",
                        kind: "RENDER",
                        order: 2,
                    },
                    {
                        url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1765447811/portfolio/slqkqsr8ajxijwaj8vzx.png",
                        alt: "Ground floor plan",
                        kind: "PLAN",
                        order: 3,
                    },
                ],
            },

            posts: {
                create: [
                    {
                        slug: "concept-and-approach",
                        title: "Concept and Design Approach",
                        content:
                            "The project explores modular housing solutions combined with commercial activity at ground level, encouraging interaction and flexible use of space.",
                        order: 1,
                    },
                    {
                        slug: "documentation-and-tools",
                        title: "Documentation and Tools",
                        content:
                            "The project was fully documented in Revit, with visualization developed using Enscape and post-production in Photoshop.",
                        order: 2,
                    },
                ],
            },
        },
    });

    await prisma.project.create({
        data: {
            slug: "coastal-house",
            title: "Coastal House",
            tag: "Hospitality Architecture",
            location: "Queensland, Australia",
            year: "2023",

            coverImage: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1765453600/portfolio/fuaguxvdfq5lvvfbp6r2.png",
            excerpt:
                "Coastal residential project focused on climate-responsive design.",
            description:
                "Single-family coastal house designed to maximize cross ventilation, shading and connection with the surrounding landscape.",

            status: "DOCUMENTATION",
            type: "RESIDENTIAL",
            role: "Architectural Draftsperson",
            tools: ["Revit", "Enscape"],

            images: {
                create: [
                    {
                        url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1765453600/portfolio/fuaguxvdfq5lvvfbp6r2.png",
                        alt: "Coastal house exterior",
                        kind: "RENDER",
                        order: 1,
                    },
                    {
                        url: "https://res.cloudinary.com/dpnkr4r6w/image/upload/v1765453600/portfolio/fuaguxvdfq5lvvfbp6r2.png",
                        alt: "Living area interior",
                        kind: "RENDER",
                        order: 2,
                    },
                ],
            },
        },
    });
    
    console.log('Projects seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

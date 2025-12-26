import { PrismaClient } from "@/generated/prisma/client";
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
    
    // Seed default theme
    console.log('Seeding default theme...');
    await prisma.themeTokens.upsert({
        where: { id: 'theme_singleton' },
        update: {},
        create: {
            id: 'theme_singleton',
            name: 'Default',
            isDark: false,
            colors: {
                background: '#FAFAF9',
                backgroundSecondary: '#FFFFFF',
                surface: '#FFFFFF',
                surfaceHover: '#F5F5F4',
                text: '#1C1917',
                textSecondary: '#57534E',
                textMuted: '#78716C',
                border: '#D6D3D1',
                borderLight: '#E7E5E4',
                primary: '#65816A',
                primaryHover: '#527258',
                primaryText: '#FFFFFF',
                secondary: '#1C1917',
                secondaryHover: '#292524',
                secondaryText: '#FFFFFF',
                tertiary: '#F5F5F4',
                tertiaryHover: '#E7E5E4',
                accent1: '#9BB19F',
                accent2: '#92400E',
                link: '#65816A',
                linkHover: '#527258',
                danger: '#DC2626',
                success: '#16A34A',
                warning: '#EA580C',
            },
            typography: {
                fontFamily: 'Montserrat',
                fontFamilyHeading: 'Montserrat',
                fontFamilyMono: 'Geist Mono',
                baseFontSize: 16,
                h1Size: '3rem',
                h2Size: '2.5rem',
                h3Size: '2rem',
                h4Size: '1.5rem',
                h5Size: '1.25rem',
                h6Size: '1rem',
                lineHeightBase: 1.6,
                lineHeightHeading: 1.2,
                fontWeightNormal: 400,
                fontWeightMedium: 500,
                fontWeightBold: 700,
            },
            radii: {
                none: '0',
                sm: '0.25rem',
                md: '0.5rem',
                lg: '1rem',
                xl: '1.5rem',
                xxl: '2rem',
                round: '50%',
                full: '9999px',
            },
            spacing: {
                xs: '0.25rem',
                sm: '0.5rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                '2xl': '3rem',
                '3xl': '4rem',
            },
            shadows: {
                sm: 'sm',
                md: 'md',
                lg: 'lg',
                xl: 'xl',
                xxl: '2xl',
            },
            layout: {
                containerSmall: '48rem',
                containerMedium: '64rem',
                containerLarge: '80rem',
                gridGutters: '1.5rem',
                flexGap: '1rem',
            },
            breakpoints: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
            },
            animations: {
                fast: '150ms',
                default: '300ms',
                slow: '500ms',
            },
        },
    });
    
    console.log('Default theme seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

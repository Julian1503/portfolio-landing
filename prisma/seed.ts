import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
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
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

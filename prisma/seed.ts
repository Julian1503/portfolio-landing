import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
    adapter,
});

const projects: Prisma.ProjectCreateManyInput[] = [
    {
        slug: "lucas-cordoba",
        title: "Lucas Córdoba",
        tag: "Residential Development",
        location: "San Miguel de Tucumán, Argentina",
        year: "2020–2022",
        image: "/images/projects/lucas-cordoba.jpg",
    },
    {
        slug: "coastal-house",
        title: "Coastal House",
        tag: "Hospitality Architecture",
        location: "Queensland, Australia",
        year: "2023",
        image: "/images/projects/coastal-house.jpg",
    }, 
];

async function main() {
    for (const p of projects) {
        await prisma.project.create({ data: p });
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

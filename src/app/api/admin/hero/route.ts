import { NextRequest, NextResponse } from "next/server";
import { createHeroService } from "@/lib/cms/services";
import { HeroSectionUpdateSchema } from "@/lib/cms/schemas";
import { ZodError } from "zod";

/**
 * GET /api/admin/hero
 * Retrieve hero section content
 */
export async function GET() {
  try {
    const service = createHeroService();
    const hero = await service.getHero();
    
    return NextResponse.json(hero, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/hero]", error);
    
    if (error instanceof Error && error.message === "Hero section not found") {
      return NextResponse.json(
        { error: "Hero section not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch hero section" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/hero
 * Update hero section content
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = HeroSectionUpdateSchema.parse(body);
    
    const service = createHeroService();
    const updatedHero = await service.updateHero(validatedData);
    
    return NextResponse.json(updatedHero, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/admin/hero]", error);
    
    // Validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update hero section" },
      { status: 500 }
    );
  }
}

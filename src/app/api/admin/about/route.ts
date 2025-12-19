import { NextRequest, NextResponse } from "next/server";
import { createAboutService } from "@/lib/cms/services";
import { AboutSectionUpdateSchema } from "@/lib/cms/schemas";
import { ZodError } from "zod";

/**
 * GET /api/admin/about
 * Retrieve about section content
 */
export async function GET() {
  try {
    const service = createAboutService();
    const about = await service.getAbout();
    
    return NextResponse.json(about, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/about]", error);
    
    if (error instanceof Error && error.message === "About section not found") {
      return NextResponse.json(
        { error: "About section not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch about section" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/about
 * Update about section content
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = AboutSectionUpdateSchema.parse(body);
    
    const service = createAboutService();
    const updatedAbout = await service.updateAbout(validatedData);
    
    return NextResponse.json(updatedAbout, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/admin/about]", error);
    
    // Validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update about section" },
      { status: 500 }
    );
  }
}

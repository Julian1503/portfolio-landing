import { NextRequest, NextResponse } from "next/server";
import { createFooterService } from "@/lib/cms/services";
import { FooterSectionUpdateSchema } from "@/lib/cms/schemas";
import { ZodError } from "zod";

/**
 * GET /api/admin/footer
 * Retrieve footer section content
 */
export async function GET() {
  try {
    const service = createFooterService();
    const footer = await service.getFooter();
    
    return NextResponse.json(footer, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/footer]", error);
    
    if (error instanceof Error && error.message === "Footer section not found") {
      return NextResponse.json(
        { error: "Footer section not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch footer section" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/footer
 * Update footer section content
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = FooterSectionUpdateSchema.parse(body);
    
    const service = createFooterService();
    const updatedFooter = await service.updateFooter(validatedData);
    
    return NextResponse.json(updatedFooter, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/admin/footer]", error);
    
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
      { error: "Failed to update footer section" },
      { status: 500 }
    );
  }
}

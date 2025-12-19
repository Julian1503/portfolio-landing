import { NextRequest, NextResponse } from "next/server";
import { createFooterService } from "@/lib/cms/services";
import { SocialLinkSchema } from "@/lib/cms/schemas";
import { ZodError } from "zod";

/**
 * GET /api/admin/footer/social
 * Retrieve all social links
 */
export async function GET() {
  try {
    const service = createFooterService();
    const links = await service.getSocialLinks();
    
    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/footer/social]", error);
    
    return NextResponse.json(
      { error: "Failed to fetch social links" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/footer/social
 * Create a new social link
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = SocialLinkSchema.parse(body);
    
    const service = createFooterService();
    const newLink = await service.createSocialLink(validatedData);
    
    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/footer/social]", error);
    
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
      { error: "Failed to create social link" },
      { status: 500 }
    );
  }
}

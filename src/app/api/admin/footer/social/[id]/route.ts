import { NextRequest, NextResponse } from "next/server";
import { createFooterService } from "@/lib/cms/services";
import { SocialLinkSchema } from "@/lib/cms/schemas";
import { ZodError } from "zod";

/**
 * PUT /api/admin/footer/social/[id]
 * Update a social link
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Validate request body (partial update)
    const validatedData = SocialLinkSchema.partial().parse(body);
    
    const service = createFooterService();
    const updatedLink = await service.updateSocialLink(id, validatedData);
    
    return NextResponse.json(updatedLink, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/admin/footer/social/[id]]", error);
    
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
      { error: "Failed to update social link" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/footer/social/[id]
 * Delete a social link
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const service = createFooterService();
    await service.deleteSocialLink(id);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/admin/footer/social/[id]]", error);
    
    return NextResponse.json(
      { error: "Failed to delete social link" },
      { status: 500 }
    );
  }
}

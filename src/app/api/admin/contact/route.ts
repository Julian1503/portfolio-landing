import { NextRequest, NextResponse } from "next/server";
import { createContactService } from "@/lib/cms/services";
import { ContactSectionUpdateSchema } from "@/lib/cms/schemas";
import { ZodError } from "zod";

/**
 * GET /api/admin/contact
 * Retrieve contact section content
 */
export async function GET() {
  try {
    const service = createContactService();
    const contact = await service.getContact();
    
    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/contact]", error);
    
    if (error instanceof Error && error.message === "Contact section not found") {
      return NextResponse.json(
        { error: "Contact section not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch contact section" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/contact
 * Update contact section content
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = ContactSectionUpdateSchema.parse(body);
    
    const service = createContactService();
    const updatedContact = await service.updateContact(validatedData);
    
    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/admin/contact]", error);
    
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
      { error: "Failed to update contact section" },
      { status: 500 }
    );
  }
}

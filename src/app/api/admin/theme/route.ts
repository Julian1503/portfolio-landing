import { NextRequest, NextResponse } from "next/server";
import { createThemeService } from "@/lib/theme/services";
import { ThemeTokensUpdateSchema } from "@/lib/theme/schemas";
import { ZodError } from "zod";

/**
 * GET /api/admin/theme
 * Retrieve current theme tokens
 */
export async function GET() {
  try {
    const service = createThemeService();
    const theme = await service.getTheme();
    
    return NextResponse.json(theme, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/theme]", error);
    
    return NextResponse.json(
      { error: "Failed to fetch theme" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/theme
 * Update theme tokens (partial update supported)
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = ThemeTokensUpdateSchema.parse(body);
    
    const service = createThemeService();
    const updatedTheme = await service.updateTheme(validatedData);
    
    return NextResponse.json(updatedTheme, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/admin/theme]", error);
    
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
      { error: "Failed to update theme" },
      { status: 500 }
    );
  }
}

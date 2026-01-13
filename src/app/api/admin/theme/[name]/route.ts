import { NextRequest, NextResponse } from "next/server";
import { createThemeService } from "@/lib/theme/services";

type Params = {
  params: Promise<{ name: string }>
};

/**
 * GET /api/admin/theme/:name
 * Get theme by name for admin pages
 */
export async function GET(
  req: NextRequest, { params } : Params
) {
  const { name } = await params;
  try {
    const service = createThemeService();
    const theme = await service.getThemeByName(name);
    if (!theme) {
      return NextResponse.json(
        { error: "Theme not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(theme, { status: 200 });
  } catch (error) {
    console.error(`[GET /api/admin/theme/${name}]`, error);

    return NextResponse.json(
      { error: "Failed to retrieve theme" },
      { status: 500 }
    );
  }
}
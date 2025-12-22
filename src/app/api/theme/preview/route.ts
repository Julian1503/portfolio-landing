import { NextRequest, NextResponse } from "next/server";
import { THEME_PRESETS, type ThemePresetKey } from "@/lib/theme/defaults";
import { generateThemeCSS } from "@/lib/theme/utils";

/**
 * GET /api/theme/preview
 * Get CSS for a specific theme preset (for client-side theme switching)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const preset = searchParams.get("preset") || "default";
    
    // Validate preset key
    if (!["default", "dark", "warm", "minimal"].includes(preset)) {
      return NextResponse.json(
        { error: "Invalid preset key" },
        { status: 400 }
      );
    }
    
    const theme = THEME_PRESETS[preset as ThemePresetKey];
    const css = generateThemeCSS(theme);
    
    return NextResponse.json({ css, theme }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/theme/preview]", error);
    
    return NextResponse.json(
      { error: "Failed to generate theme CSS" },
      { status: 500 }
    );
  }
}

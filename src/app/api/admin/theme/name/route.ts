/**
 * GET /api/admin/theme?name={themeName}
 * Retrieve theme tokens by name (for presets)
 */
import {NextRequest, NextResponse} from "next/server";
import {createThemeService, IThemeService} from "@/lib/theme";

export async function GET(req: NextRequest) {
    try {
        const service : IThemeService = createThemeService();
        const theme : string[] = await service.getThemesNames();

        if (theme && theme.length === 0) {
            return NextResponse.json(
                { error: "Themes not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(theme, { status: 200 });
    } catch( error) {
        console.error("[GET /api/admin/theme/name]", error);

        return NextResponse.json(
            { error: "Failed to fetch themes names" },
            { status: 500 }
        );
    }
}
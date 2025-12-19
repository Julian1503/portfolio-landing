-- CreateTable
CREATE TABLE "ThemeTokens" (
    "id" TEXT NOT NULL,
    "colors" JSONB NOT NULL,
    "typography" JSONB NOT NULL,
    "radii" JSONB NOT NULL,
    "spacing" JSONB NOT NULL,
    "shadows" JSONB NOT NULL,
    "sectionOverrides" JSONB,
    "name" TEXT NOT NULL DEFAULT 'Default',
    "isDark" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThemeTokens_pkey" PRIMARY KEY ("id")
);

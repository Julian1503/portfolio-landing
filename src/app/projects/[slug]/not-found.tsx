import Link from "next/link";
import { Button } from "@/components/Button";
import { Home, ArrowLeft } from "lucide-react";

export default function ProjectNotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-stone-50 via-white to-amber-50/30 px-4">
            <div className="w-full max-w-md text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-3xl font-bold text-slate-400">?</span>
                </div>

                <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Project Not Found
                </h1>

                <p className="mb-8 text-base text-slate-600">
                    The project you're looking for doesn't exist or may have been removed.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button asChild>
                        <Link href="/#projects" className="inline-flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Projects</span>
                        </Link>
                    </Button>

                    <Button variant="secondary" asChild>
                        <Link href="/" className="inline-flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span>Go Home</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
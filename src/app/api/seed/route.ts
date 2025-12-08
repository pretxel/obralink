import { NextResponse } from "next/server";
import { createDemoProject } from "@/app/actions";

export async function GET() {
    try {
        const project = await createDemoProject();
        return NextResponse.json({
            success: true,
            message: "Seed completed successfully",
            project
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

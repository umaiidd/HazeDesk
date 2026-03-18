import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";

export async function POST(req: NextRequest) {
    try {

await connectDb()

        const { ownerId, businessName, supportEmail, knowledge } = await req.json()

        // Basic validation
        if (!ownerId || !businessName || !supportEmail) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            )
        }

        const settings = await Settings.findOneAndUpdate(
            { ownerId },
            { ownerId, businessName, supportEmail, knowledge },
            { upsert: true, new: true }
        )

        return NextResponse.json(
            { message: "Settings saved", data: settings },
            { status: 200 }
        )

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
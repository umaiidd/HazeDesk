import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";

export async function POST(req: NextRequest) {
    try {
        await connectDb()

        const { ownerId } = await req.json()

        if (!ownerId) {
            return NextResponse.json(
                { message: "ownerId is required" },
                { status: 400 }
            )
        }

        const settings = await Settings.findOne({ ownerId })

        if (!settings) {
            return NextResponse.json(
                { message: "Settings not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            businessName: settings.businessName,
            supportEmail: settings.supportEmail,
            knowledge: settings.knowledge
        }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
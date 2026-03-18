import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Groq from "groq-sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders, status: 204 })
}

export async function POST(req: NextRequest) {
  try {
    const { message, ownerId } = await req.json()

    if (!message || !ownerId) {
      return NextResponse.json(
        { message: "Message and Owner Id is required." },
        { status: 400, headers: corsHeaders }
      )
    }

    await connectDb()

    const setting = await Settings.findOne({ ownerId })

    if (!setting) {
      return NextResponse.json(
        { message: "ChatBot is not configured yet." },
        { status: 400, headers: corsHeaders }
      )
    }

    const prompt = `
You are a professional customer support assistant for this business.

Use ONLY the information provided below to answer the customer's question.
You may rephrase, summarize, or interpret the information if needed.
Do NOT invent new policies, prices, or promises.

If the customer's question is completely unrelated to the information,
or cannot be reasonably answered from it, reply exactly with:
"Please contact support."

--------------------
BUSINESS INFORMATION
--------------------
Business Name: ${setting.businessName}
Support Email: ${setting.supportEmail}

${setting.knowledge}

--------------------
CUSTOMER QUESTION
--------------------
${message}

--------------------
ANSWER
--------------------
`

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    })

    const reply = response.choices[0]?.message?.content ?? "Please contact support."

    return NextResponse.json(
      { reply },
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}
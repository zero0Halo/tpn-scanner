// src/app/api/open-ai/read-scan/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Agent, run } from "@openai/agents";

export async function POST(req: NextRequest) {
  const API_KEY = process.env.OPENAI_API_KEY || "";
  const { image, data } = await req.json();

  if (!API_KEY) {
    return NextResponse.json(
      { error: "Missing OpenAI API key" },
      { status: 500 },
    );
  }

  const agent = new Agent({
    name: "Analyze TPN Label",
    // outputType: "",
    instructions: ``,
  });

  const result = await run(agent, ``);

  return NextResponse.json({});
}

// src/app/api/open-ai/read-scan/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Agent, run } from "@openai/agents";
import { TpnLabelObj } from "@/lib/types";

export async function POST(req: NextRequest) {
  const API_KEY = process.env.OPENAI_API_KEY || "";
  const formdata = await req.formData();
  const image = formdata.get("image") as File;
  const paddleData = formdata.get("paddleData");

  if (!API_KEY || !image || !paddleData) {
    return NextResponse.json(
      { error: "Missing OpenAI API key or form data" },
      { status: 500 },
    );
  }

  const arrayBuffer = await image.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const imageDataUrl = `data:${image.type};base64,${base64}`;

  const agent = new Agent({
    name: "Analyze TPN Label",
    outputType: TpnLabelObj,
    instructions: `
You analyze photographs of TPN medication labels.

You will be given:
- An image of the original TPN label.
- OCR data produced from that same image.

Use both sources together to extract the information from the label. The OCR data may contain recognition errors, incorrect ordering, or missing relationships between labels and values. Use the image to verify and correct the OCR data.

Do not invent information that cannot be reasonably determined from the image or OCR data.

Preserve medication names, quantities, units, concentrations, dates, and other medical information exactly as shown on the label.

When information is unclear or cannot be determined confidently, indicate that it is uncertain rather than guessing.
`,
  });

  const result = await run(agent, [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `
Analyze the attached TPN label.

The OCR system extracted the following data:

${paddleData}

Use the image and OCR data together to extract the label information.
        `,
        },
        {
          type: "input_image",
          image: imageDataUrl,
        },
      ],
    },
  ]);

  return NextResponse.json({ result: result.finalOutput });
}

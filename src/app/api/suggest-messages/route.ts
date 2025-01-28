import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // API endpoint for Google's LLM
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: { text: prompt },
          maxOutputTokens: 400,
        }),
      }
    );

    console.log(response);

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        {
          success: false,
          errorData,
          message: "error while llm response",
        },
        { status: 400 }
      );
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.output || "No response generated";

    console.log(resultText);
    

    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        details: error,
      },
      { status: 500 }
    );
  }
}

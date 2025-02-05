import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(_req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Hugging Face API endpoint for GPT-2 or GPT-Neo
    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2", // You can change to another model like gpt-neo
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
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
          message: "Error while getting response from Hugging Face model",
        },
        { status: 400 }
      );
    }

    const data = await response.json();
    const resultText = data[0]?.generated_text || "No response generated";
    console.log("*******************************88");
    
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

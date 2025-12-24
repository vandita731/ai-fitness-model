import { NextRequest, NextResponse } from "next/server";
import { generateFitnessPrompt } from "@/lib/prompts";

// Helper to extract text from OpenAI's response structure
function extractText(data: any): string | null {
  // Try different response structures
  
  // 1. Check for direct text in choices (standard chat completion)
  if (data.choices && Array.isArray(data.choices)) {
    const firstChoice = data.choices[0];
    if (firstChoice?.message?.content) {
      return firstChoice.message.content;
    }
    if (firstChoice?.text) {
      return firstChoice.text;
    }
  }

  // 2. Check for output_text field
  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  // 3. Check for output array (responses API)
  if (Array.isArray(data.output)) {
    for (const item of data.output) {
      // Check reasoning output
      if (item.type === "reasoning" && item.content) {
        return item.content;
      }
      
      // Check content array
      if (Array.isArray(item.content)) {
        for (const block of item.content) {
          if (block.type === "output_text" && block.text) {
            return block.text;
          }
          if (block.type === "text" && block.text) {
            return block.text;
          }
        }
      }
    }
  }

  // 4. Check for direct content field
  if (data.content && typeof data.content === "string") {
    return data.content;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();
    const prompt = generateFitnessPrompt(userData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased to 60s

    // Use Chat Completions API instead of Responses API
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Use a reliable model
        messages: [
          {
            role: "system",
            content: "You are a professional fitness coach and nutritionist. Always respond with valid JSON only, no markdown formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000, // Increased for complete response
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.text();
      console.error("OPENAI API ERROR:", err);
      return NextResponse.json(
        { error: "OpenAI API error: " + err },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("OpenAI Response Status:", data.choices?.[0]?.finish_reason);

    const text = extractText(data);

    if (!text) {
      console.error("RAW OPENAI RESPONSE:", JSON.stringify(data, null, 2));
      throw new Error("OpenAI returned no readable text");
    }

    console.log("Extracted text length:", text.length);

    // Clean up the response - remove markdown code blocks if present
    let cleanText = text.trim();
    
    // Remove markdown JSON formatting
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/```\n?/g, "");
    }

    // Find JSON object
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in text:", cleanText.substring(0, 500));
      throw new Error("No JSON found in model output");
    }

    const fitnessPlan = JSON.parse(jsonMatch[0]);
    
    // Validate the response has required fields
    if (!fitnessPlan.workoutPlan || !fitnessPlan.dietPlan) {
      throw new Error("Invalid fitness plan structure");
    }

    return NextResponse.json(fitnessPlan);

  } catch (err: any) {
    console.error("SERVER ERROR:", err.message || err);
    
    // Provide more specific error messages
    if (err.name === 'AbortError') {
      return NextResponse.json(
        { error: "Request timed out. Please try again." },
        { status: 408 }
      );
    }
    
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Failed to generate plan. Please try again." },
      { status: 500 }
    );
  }
}
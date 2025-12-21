"use server";

import Replicate from "replicate";

export async function generateTattoo(prompt: string, aspectRatio: string = "1:1") {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("❌ Replicate API token is missing");
    return { success: false, error: "Replicate API token is missing" };
  }

  console.log("🚀 Tattty Generation started with prompt:", prompt);

  // Clean and enhance the prompt for the custom LoRA model
  const fullPrompt = `${prompt}, white background, clean lines, stencil style`;

  // Map aspect ratio to Replicate format
  const aspectMap: Record<string, string> = {
    "1:1": "1:1",
    "3:4": "3:4", 
    "4:3": "4:3",
    "16:9": "16:9"
  };
  const replicateAspectRatio = aspectMap[aspectRatio] || "1:1";

  try {
    console.log("⏳ Running custom LoRA model on Replicate...");

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const result = await replicate.run("tattzy25/tattty_4_all:4e8f6c1dc77db77dabaf98318cde3679375a399b434ae2db0e698804ac84919c", {
      input: {
        prompt: fullPrompt,
        aspect_ratio: replicateAspectRatio,
        model: "dev", // Use dev model for best quality
        guidance_scale: 3,
        num_inference_steps: 28,
        num_outputs: 1,
        output_format: "webp",
        output_quality: 80,
        disable_safety_checker: true,
        go_fast: false,
        megapixels: "1"
      }
    });

    console.log("✅ Generation succeeded:", result);

    // Handle Replicate output - result is an array of file objects
    const output = result as any[];
    if (output && output.length > 0) {
      // Each item has a url() method
      const imageUrl = output[0].url();
      return { success: true, output: imageUrl };
    } else {
      return { success: false, error: "No image generated" };
    }

  } catch (error: any) {
    console.error("❌ Error generating tattoo:", error);
    const errorMessage = error?.message || "Unknown error";
    if (errorMessage.includes("API key") || errorMessage.includes("auth")) {
      return { success: false, error: "🚨 REPLICATE API KEY INVALID! Check your .env.local file for REPLICATE_API_TOKEN." };
    }
    if (errorMessage.includes("model")) {
      return { success: false, error: "🚨 CUSTOM LORA MODEL UNAVAILABLE! Check Replicate for model status." };
    }
    if (errorMessage.includes("rate limit")) {
      return { success: false, error: "🚨 REPLICATE RATE LIMIT EXCEEDED! Try again later." };
    }
    return { success: false, error: `🚨 TATTOO GENERATION FAILED: ${errorMessage}. Check API key and model.` };
  }
}

"use server";

import { fal } from "@fal-ai/client";

export async function generateTattoo(prompt: string, aspectRatio: string = "1:1") {
  if (!process.env.FAL_KEY) {
    console.error("❌ Fal API key is missing");
    return { success: false, error: "Fal API key is missing" };
  }

  console.log("🚀 Tattty Generation started with prompt:", prompt);

  const fullPrompt = `${prompt}, white background`;

  // Map aspect ratio to Fal image_size
  const aspectMap: Record<string, "square" | "portrait_4_3" | "landscape_4_3" | "landscape_16_9"> = {
    "1:1": "square",
    "3:4": "portrait_4_3",
    "4:3": "landscape_4_3",
    "16:9": "landscape_16_9",
  };
  const imageSize = aspectMap[aspectRatio] || "square";

  try {
    console.log("⏳ Running Fal model...");

    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: fullPrompt, // The prompt with white background
        image_size: imageSize,
        num_inference_steps: 4,
        output_format: "png",
        num_images: 1,
        enable_safety_checker: false,
      },
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("⏳ Generation in progress...");
        }
      },
    });

    console.log("✅ Generation succeeded:", result);

    // Handle Fal output
    if (result.data && result.data.images && result.data.images.length > 0) {
      const imageUrl = result.data.images[0].url;
      return { success: true, output: imageUrl };
    } else {
      return { success: false, error: "No image generated" };
    }

  } catch (error: any) {
    console.error("❌ Error generating tattoo:", error);
    const errorMessage = error?.message || "Unknown error";
    if (errorMessage.includes("API key") || errorMessage.includes("auth")) {
      return { success: false, error: "🚨 FAL API KEY INVALID! Check your .env.local file for FAL_KEY." };
    }
    if (errorMessage.includes("model")) {
      return { success: false, error: "🚨 FAL MODEL UNAVAILABLE! Check Fal for model status." };
    }
    if (errorMessage.includes("rate limit")) {
      return { success: false, error: "🚨 FAL RATE LIMIT EXCEEDED! Try again later." };
    }
    return { success: false, error: `🚨 TATTOO GENERATION FAILED: ${errorMessage}. Check API key and model.` };
  }
}

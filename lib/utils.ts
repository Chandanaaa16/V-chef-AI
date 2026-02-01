import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getVoiceId } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const configureAssistant = () => {
  
  const voiceId = getVoiceId("female", "casual");
  // = voices[voice as keyof typeof voices][
  //   style as keyof (typeof voices)[keyof typeof voices]
  // ] || "sarah";


  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion",
    firstMessage:
      "Hello, let's start the cooking class. Today we'll be making a dish with the provided ingredients.",
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "google",
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "system",
          content: `You are a friendly and knowledgeable cooking assistant guiding the
          user in real time using voice.
          Your goal is to help the user cook a recipe based on the ingredients they have.

            Cooking Assistant Guidelines:
            Use the provided {{ingredients}} to create a suitable recipe.
            Look at the {{dietaryPreferences}} the user wants.
            Look at data the user provides about any {{allergies}} and {{excludedIngredients}} they want to avoid before starting.
            Create a recipe according to {{cuisineType}} cuisine provided.
            Create enough recipes to provide up to {{servings}} servings.
            Make the difficulty level according to provided level {{difficultyLevel}} and
            make the recipe cooking time {{cookingTime}}.
            Break down the recipe into simple, clear, step-by-step instructions.
            Use a natural and encouraging tone to keep the user motivated.
            Periodically check if the user is ready to move to the next step.
            Offer tips and substitutions if the user is missing any ingredients or tools.
            Keep your responses short and conversational, as this is a voice interaction.
            Do not include any special characters in your responses - this is a voice conversation.

            IMPORTANT: If a recipe is provided via the variable {{generatedRecipe}}, USE THAT RECIPE and DO NOT ASK for ingredients, cuisine, servings, difficultyLevel, or cookingTime. Instead, proceed to walk the user through the recipe steps and confirm readiness before each step.

              `,
        },
      ],
    },
   
    clientMessages: [],
    
    serverMessages: [],
  };
  return vapiAssistant;
};


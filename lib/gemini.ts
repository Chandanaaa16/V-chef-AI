'use server';
import { GoogleGenAI } from "@google/genai";  // ✅ CORRECT NEW SDK

export interface Recipe {
  title: string;
  description: string;
  image: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: Array<{ instruction: string }>;
}

interface FormData {
  ingredients: string;
  dietaryPreferences?: string[] | undefined;
  allergies?: string[] | undefined;
  cuisineType: string;
  difficultyLevel: string;
  cookingTime: string;
  servings: string;
}

export const generateRecipe = async ({
  ingredients,
  dietaryPreferences,
  allergies,
  cuisineType,
  difficultyLevel,
  cookingTime,
  servings,
}: FormData): Promise<Recipe> => {
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GOOGLE_GEMINI_API_KEY!  // ✅ CORRECT apiKey format
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a friendly and knowledgeable cooking assistant guiding the user in real time using voice.

Cooking Assistant Guidelines:
Use the provided ${ingredients} to create a suitable recipe.
Look at the ${dietaryPreferences} the user wants.
Look at data the user provides about any ${allergies} and excluded ingredients they want to avoid before starting.
Create a recipe according to ${cuisineType} cuisine provided.
Create enough recipes to provide up to ${servings} servings.
Make the difficulty level according to provided level ${difficultyLevel} and make the recipe cooking time ${cookingTime}.
Break down the recipe into simple, clear, step-by-step instructions.
Use a natural and encouraging tone to keep the user motivated.
Periodically check if the user is ready to move to the next step.
Offer tips and substitutions if the user is missing any ingredients or tools.
Keep your responses short and conversational, as this is a voice interaction.
Do not include any special characters in your responses - this is a voice conversation.

Generate a recipe in the following object format. Respond ONLY with valid object— no commentary or text outside the object.
{
  "title": "Recipe Title",
  "description": "Short tasty description of the recipe",
  "image": "Public domain image URL (Unsplash, Pexels, etc.)",
  "prepTime": "15 min",
  "cookTime": "30 min",
  "servings": 4,
  "difficulty": "Medium",
  "ingredients": [
    "List of ingredients as strings"
  ],
  "instructions": [
    {"instruction": "Step-by-step instructions as strings"}
  ]
}

Base the recipe on:
- Ingredients: ${ingredients}
- Dietary Preferences: ${dietaryPreferences}
- Allergies: ${allergies}
- Cuisine Type: ${cuisineType}
- Difficulty Level: ${difficultyLevel}
- Cooking Time: ${cookingTime}
- Servings: ${servings}

Return only the object. Do not include any explanation or commentary.`
  });

  const text = response.text?.replace(/```json|```/g, '').trim() || '';
  
  let recipe: Recipe;
  try {
    recipe = JSON.parse(text) as Recipe;
    // ✅ Convert instructions to voice format
    recipe.instructions = (recipe.instructions || []).map((step: any) => ({
      instruction: typeof step === 'string' ? step : step.instruction || String(step)
    }));
  } catch {
    // ✅ Dynamic fallback using YOUR parameters
    recipe = {
      title: `${ingredients} ${cuisineType} Recipe`,
      description: `Delicious ${cuisineType} recipe using ${ingredients}`,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
      prepTime: "10 min",
      cookTime: cookingTime || "20 min",
      servings: parseInt(servings) || 2,
      difficulty: difficultyLevel || "Easy",
      ingredients: [ingredients],
      instructions: [{ instruction: `Create delicious ${cuisineType} dish with ${ingredients} for ${servings} servings` }]
    };
  }

  return recipe;
};

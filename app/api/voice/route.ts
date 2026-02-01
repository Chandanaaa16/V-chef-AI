// app/api/voice/route.ts - FULLY TYPED CONVERSATIONAL COOKING GUIDE
import { NextRequest, NextResponse } from 'next/server';
import { generateRecipe } from '@/lib/gemini';

// ✅ PROPER TYPES
interface Recipe {
  title: string;
  instructions: { instruction: string }[];
}

interface CookingState {
  recipe: Recipe | null;
  currentStep: number;
  ingredientsReady: boolean;
}

// ✅ PERSISTENT STATE (use your preferred method)
let cookingState: CookingState = {
  recipe: null,
  currentStep: 0,
  ingredientsReady: false,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = (body.message || '').toLowerCase().trim();
    
    // First time - generate recipe
    if (!cookingState.recipe) {
      const recipe = await generateRecipe(body.message);
      cookingState.recipe = recipe;
      cookingState.currentStep = 0;
      cookingState.ingredientsReady = false;
      
      return NextResponse.json({ 
        speech: `Got it! ${recipe.title}. First, check you have all ingredients ready. Say "ingredients ready" when prepared.`,
        endCall: false 
      } as const);
    }
    
    // Handle cooking flow
    const steps = cookingState.recipe.instructions;
    const currentInstruction = steps[cookingState.currentStep];
    
    if (message.includes('ingredients ready') || message.includes('ready')) {
      cookingState.ingredientsReady = true;
      return NextResponse.json({ 
        speech: `Great! Step ${cookingState.currentStep + 1}: ${currentInstruction.instruction}. Say "next step" when done.`,
        endCall: false 
      } as const);
    }
    
    if (message.includes('next') || message.includes('done')) {
      cookingState.currentStep++;
      
      if (cookingState.currentStep >= steps.length) {
        return NextResponse.json({ 
          speech: `Perfect! Your ${cookingState.recipe.title} is ready. Enjoy your meal! Say "new recipe" for another.`,
          endCall: true 
        } as const);
      }
      
      const nextInstruction = steps[cookingState.currentStep];
      return NextResponse.json({ 
        speech: `Step ${cookingState.currentStep + 1}: ${nextInstruction.instruction}. Ready? Say "next step" when done.`,
        endCall: false 
      } as const);
    }
    
    // Help commands
    if (message.includes('help') || message.includes('repeat')) {
      return NextResponse.json({ 
        speech: cookingState.ingredientsReady 
          ? `Current step ${cookingState.currentStep + 1}: ${currentInstruction.instruction}`
          : `Please say "ingredients ready" to start cooking!`,
        endCall: false 
      } as const);
    }
    
    // Reset
    if (message.includes('new') || message.includes('reset')) {
      cookingState = { recipe: null, currentStep: 0, ingredientsReady: false };
      return NextResponse.json({ 
        speech: "Say any ingredients like 'paneer noodles' to start a new recipe!",
        endCall: false 
      } as const);
    }
    
    return NextResponse.json({ 
      speech: "Say 'ingredients ready' to start, 'next step' to continue, 'repeat' for current step, or 'new recipe' to restart.",
      endCall: false 
    } as const);
    
  } catch (error) {
    console.error('Voice API Error:', error);
    return NextResponse.json({ 
      speech: "Say your ingredients to start! Or use 'next step', 'repeat', 'ingredients ready'.",
      endCall: false 
    } as const);
  }
}

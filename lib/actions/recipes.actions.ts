'use server';
import { createSupabaseClient } from "../supabase";

export interface RecipeData {
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

export const createRecipe = async (formData: RecipeData) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('recipes')
    .insert({ ...formData })
    .select();

  if (error || !data) throw new Error(error?.message || 'failed to create recipe');
  return data[0];
};

export const getRecipe = async (id: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('recipes')
    .select()
    .eq('id', id);

  if (error) {
    console.error(error);
    return null;
  }
  return data[0];
};

export const createdGeneratedRecipe = async (recipeId: string, Recipes: RecipeData) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('recipes')
    .insert({
      ...Recipes,
      recipe_id: recipeId
    })
    .select();

  if (error || !data) throw new Error(error?.message || 'failed to create recipe');
  return data[0];
};

export const getRecipeWithGeneratedData = async (id: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('recipes')
    .select()
    .eq('recipe_id', id)
    .single();

  if (error) {
    console.error("Error fetching joined data:", error.message);
    return null;
  }
  return data;
};

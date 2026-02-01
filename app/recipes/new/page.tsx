'use client'
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createdGeneratedRecipe, createRecipe } from "@/lib/actions/recipes.actions";
import { useRouter } from "next/navigation";
import { generateRecipe } from "@/lib/gemini";

const formSchema = z.object({
    ingredients: z.string().min(1, "Please enter at least one ingredient"),
    dietaryPreferences: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    excludedIngredients: z.string().optional(),
    cuisineType: z.string().min(1, "Please select a cuisine type"),
    servings: z.string().min(1, "Please specify number of servings"),
    difficultyLevel: z.string().min(1, "Please select difficulty level"),
    cookingTime: z.string().min(1, "Please specify cooking time"),
});

type FormData = z.infer<typeof formSchema>;

const RecipeForm = () => {
    const router = useRouter();
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ingredients: "",
            dietaryPreferences: [],
            allergies: [],
            excludedIngredients: "",
            cuisineType: "",
            servings: "",
            difficultyLevel: "",
            cookingTime: "",
        },
    });

    const onSubmit = async (data: FormData) => {
       
        // Build a minimal RecipeData payload expected by createRecipe
        const payload = {
            title: data.ingredients.split(',')[0]?.trim() || 'Generated Recipe',
            description: `Recipe generated from ingredients: ${data.ingredients}`,
            image: '',
            prepTime: '10 min',
            cookTime: data.cookingTime || '20 min',
            servings: parseInt(data.servings) || 1,
            difficulty: data.difficultyLevel,
            ingredients: data.ingredients.split(',').map((i) => i.trim()).filter(Boolean),
            instructions: [],
        };

        const recipe = await createRecipe(payload);
        const gemini = await generateRecipe(data);
       
        if (gemini) {
            // gemini is already a parsed Recipe object from the server helper
            await createdGeneratedRecipe(recipe.id, gemini);
        }
        
        if (recipe) {
            router.push(`/recipes/${recipe.id}`);
        } else {
            console.log('failed to create a recipe');
            router.push('/');
        }
    };

    const dietaryOptions = [
        "Vegetarian",
        "Vegan",
        "Keto",
        "Paleo",
        "Mediterranean",
        "Low-carb",
        "Gluten-free",
        "Dairy-free",
    ];

    const allergyOptions = [
        "Nuts",
        "Dairy",
        "Gluten",
        "Eggs",
        "Soy",
        "Shellfish",
        "Fish",
        "Sesame",
    ];

    return (
        <div className="bg-white min-h-screen py-16 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                        Generate Your Perfect Recipe
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Tell us what you have and what you like, and our AI will create
                        personalized recipes just for you.
                    </p>
                </div>

                <Card className="shadow-lg border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-green-50 rounded-t-lg">
                        <CardTitle className="text-2xl text-center text-gray-800">
                            Recipe Generator Form
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                {/* Ingredients */}
                                <FormField
                                    control={form.control}
                                    name="ingredients"

                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-semibold text-gray-700">
                                                What ingredients do you have?
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="e.g., chicken breast, tomatoes, onions, garlic, rice..."
                                                    className="min-h-[100px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                List all the ingredients you currently have available.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Dietary Preferences */}
                                <FormField
                                    control={form.control}
                                    name="dietaryPreferences"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-semibold text-gray-700">
                                                Dietary Preferences
                                            </FormLabel>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                                {dietaryOptions.map((option) => (
                                                    <FormField
                                                        key={option}
                                                        control={form.control}
                                                        name="dietaryPreferences"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={option}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(option)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([
                                                                                        ...(field.value || []),
                                                                                        option,
                                                                                    ])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== option,
                                                                                        ),
                                                                                    );
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal">
                                                                        {option}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <FormDescription>
                                                Select any dietary preferences that apply to you.
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />

                                {/* Food Allergies */}
                                <FormField
                                    control={form.control}
                                    name="allergies"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-semibold text-gray-700">
                                                Food Allergies
                                            </FormLabel>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                                {allergyOptions.map((option) => (
                                                    <FormField
                                                        key={option}
                                                        control={form.control}
                                                        name="allergies"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={option}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(option)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([
                                                                                        ...(field.value || []),
                                                                                        option,
                                                                                    ])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== option,
                                                                                        ),
                                                                                    );
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal">
                                                                        {option}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <FormDescription>
                                                Select any food allergies we should avoid.
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />

                                {/* Excluded Ingredients */}
                                <FormField
                                    control={form.control}
                                    name="excludedIngredients"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-semibold text-gray-700">
                                                Ingredients to Exclude
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., mushrooms, cilantro, spicy peppers..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                List any ingredients you do not want in your recipes.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Cuisine Type */}
                                    <FormField
                                        control={form.control}
                                        name="cuisineType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold text-gray-700">
                                                    Preferred Cuisine
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select cuisine type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="italian">Italian</SelectItem>
                                                        <SelectItem value="chinese">Chinese</SelectItem>
                                                        <SelectItem value="indian">Indian</SelectItem>
                                                        <SelectItem value="mexican">Mexican</SelectItem>
                                                        <SelectItem value="japanese">Japanese</SelectItem>
                                                        <SelectItem value="french">French</SelectItem>
                                                        <SelectItem value="thai">Thai</SelectItem>
                                                        <SelectItem value="mediterranean">
                                                            Mediterranean
                                                        </SelectItem>
                                                        <SelectItem value="american">American</SelectItem>
                                                        <SelectItem value="korean">Korean</SelectItem>
                                                        <SelectItem value="any">Any Cuisine</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Choose your preferred cuisine style.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Number of Servings */}
                                    <FormField
                                        control={form.control}
                                        name="servings"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold text-gray-700">
                                                    Number of Servings
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select servings" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="1">1 person</SelectItem>
                                                        <SelectItem value="2">2 people</SelectItem>
                                                        <SelectItem value="3">3 people</SelectItem>
                                                        <SelectItem value="4">4 people</SelectItem>
                                                        <SelectItem value="5">5 people</SelectItem>
                                                        <SelectItem value="6">6 people</SelectItem>
                                                        <SelectItem value="8">8 people</SelectItem>
                                                        <SelectItem value="10">10+ people</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    How many people will you be serving?
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Difficulty Level */}
                                    <FormField
                                        control={form.control}
                                        name="difficultyLevel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold text-gray-700">
                                                    Difficulty Level
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select difficulty" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="easy">
                                                            Easy (Beginner)
                                                        </SelectItem>
                                                        <SelectItem value="medium">
                                                            Medium (Intermediate)
                                                        </SelectItem>
                                                        <SelectItem value="advanced">
                                                            Advanced (Expert)
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Choose your cooking skill level.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Cooking Time */}
                                    <FormField
                                        control={form.control}
                                        name="cookingTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-semibold text-gray-700">
                                                    Available Cooking Time
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select time" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="15">15 minutes</SelectItem>
                                                        <SelectItem value="30">30 minutes</SelectItem>
                                                        <SelectItem value="45">45 minutes</SelectItem>
                                                        <SelectItem value="60">1 hour</SelectItem>
                                                        <SelectItem value="90">1.5 hours</SelectItem>
                                                        <SelectItem value="120">2 hours</SelectItem>
                                                        <SelectItem value="180">3+ hours</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    How much time do you have for cooking?
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="pt-6">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-semibold"
                                    >
                                        Generate Recipes
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RecipeForm;

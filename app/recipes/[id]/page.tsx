// 'use client'
// import React, { useState } from "react";
// import Link from 'next/link';
// import { ArrowLeft, Clock, Users, Play, CheckCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { SearchParams } from "next/dist/server/request/search-params";
// import { getRecipe } from "@/lib/actions/recipes.actions";



// interface Recipe {
//     id: string;
//     name: string;
//     description: string;
//     imageUrl: string;
//     prepTime: string;
//     cookTime: string;
//     servings: number;
//     ingredients: string[];
//     instructions: string[];
// }
// interface RecipeSessionPageProps {
//     params: Promise<{ id: string}>;
// }

// const RecipeDetailPage = ({params} : RecipeSessionPageProps) => {
//     const { id } = await params;

//     const recipeDetails = await getRecipe(id);

//     console.log("recipe",recipeDetails)

//     //const { id } = useParams<{ id: string }>();
//     const [showVoiceGuide, setShowVoiceGuide] = useState(false);
//     const [currentStep, setCurrentStep] = useState(0);
//     const [completedSteps, setCompletedSteps] = useState<number[]>([]);
//     const [isCallActive, setIsCallActive] = useState(false);

//     // Mock recipe data - in a real app, this would be fetched based on the ID
//     const recipe: Recipe = {
//         id: "1",
//         name: "Garlic Butter Shrimp Pasta",
//         description:
//             "Creamy pasta with garlic butter shrimp, ready in just 20 minutes. Perfect for a quick weeknight dinner.",
//         imageUrl:
//             "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80",
//         prepTime: "10 mins",
//         cookTime: "15 mins",
//         servings: 4,
//         ingredients: [
//             "1 lb large shrimp, peeled and deveined",
//             "12 oz linguine or spaghetti",
//             "4 cloves garlic, minced",
//             "4 tbsp butter",
//             "1/2 cup heavy cream",
//             "1/2 cup grated Parmesan cheese",
//             "2 tbsp olive oil",
//             "1/4 cup white wine (optional)",
//             "2 tbsp fresh parsley, chopped",
//             "Salt and pepper to taste",
//             "Red pepper flakes (optional)",
//         ],
//         instructions: [
//             "Bring a large pot of salted water to boil. Cook pasta according to package directions until al dente.",
//             "While pasta cooks, heat olive oil in a large skillet over medium-high heat.",
//             "Season shrimp with salt and pepper. Add to skillet and cook 2-3 minutes per side until pink.",
//             "Remove shrimp from skillet and set aside.",
//             "In the same skillet, add butter and minced garlic. Cook for 1 minute until fragrant.",
//             "Add white wine (if using) and let it reduce for 1 minute.",
//             "Pour in heavy cream and bring to a gentle simmer.",
//             "Add cooked pasta to the skillet and toss to coat.",
//             "Return shrimp to the skillet and add Parmesan cheese.",
//             "Toss everything together and cook for 1-2 minutes until cheese melts.",
//             "Remove from heat, add fresh parsley, and season with salt, pepper, and red pepper flakes.",
//             "Serve immediately with extra Parmesan cheese if desired.",
//         ],
//     };

//     const startVoiceGuide = () => {
//         setShowVoiceGuide(true);
//         setIsCallActive(true);
//         setCurrentStep(0);
//         // In a real app, this would call the startCall() function
//         console.log("Starting voice cooking guide...");
//     };

//     const nextStep = () => {
//         if (currentStep < recipe.instructions.length - 1) {
//             setCompletedSteps([...completedSteps, currentStep]);
//             setCurrentStep(currentStep + 1);
//         }
//     };

//     const previousStep = () => {
//         if (currentStep > 0) {
//             setCurrentStep(currentStep - 1);
//             setCompletedSteps(
//                 completedSteps.filter((step) => step !== currentStep - 1),
//             );
//         }
//     };

//     const repeatStep = () => {
//         // In a real app, this would trigger text-to-speech for the current step
//         console.log(
//             `Repeating step ${currentStep + 1}: ${recipe.instructions[currentStep]}`,
//         );
//     };

//     const endCall = () => {
//         setIsCallActive(false);
//         setShowVoiceGuide(false);
//         setCurrentStep(0);
//         setCompletedSteps([]);
//     };

//     if (showVoiceGuide) {
//         return (
//             <div className="min-h-screen bg-gray-50">

//                 <main className="container mx-auto px-4 py-8">
//                     <div className="mb-6">
//                         <Button
//                             variant="outline"
//                             onClick={() => setShowVoiceGuide(false)}
//                             className="mb-4"
//                         >
//                             <ArrowLeft className="mr-2 h-4 w-4" />
//                             Back to Recipe
//                         </Button>
//                         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                             Voice Cooking Guide: {recipe.name}
//                         </h1>
//                         <div className="flex items-center gap-4 text-sm text-gray-600">
//                             <span>
//                                 Step {currentStep + 1} of {recipe.instructions.length}
//                             </span>
//                             <div className="flex-1 bg-gray-200 rounded-full h-2">
//                                 <div
//                                     className="bg-primary h-2 rounded-full transition-all duration-300"
//                                     style={{
//                                         width: `${((currentStep + 1) / recipe.instructions.length) * 100}%`,
//                                     }}
//                                 ></div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                         {/* Current Step */}
//                         <div className="lg:col-span-2">
//                             <Card className="bg-white">
//                                 <CardHeader>
//                                     <CardTitle className="flex items-center gap-2">
//                                         <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
//                                             {currentStep + 1}
//                                         </span>
//                                         Current Step
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <p className="text-lg leading-relaxed mb-6">
//                                         {recipe.instructions[currentStep]}
//                                     </p>

//                                     <div className="flex flex-wrap gap-3">
//                                         <Button
//                                             onClick={previousStep}
//                                             disabled={currentStep === 0}
//                                             variant="outline"
//                                         >
//                                             Previous Step
//                                         </Button>
//                                         <Button onClick={repeatStep} variant="secondary">
//                                             Repeat Step
//                                         </Button>
//                                         <Button
//                                             onClick={nextStep}
//                                             disabled={currentStep === recipe.instructions.length - 1}
//                                         >
//                                             Next Step
//                                         </Button>
//                                         <Button onClick={endCall} variant="destructive">
//                                             End Call
//                                         </Button>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>

//                         {/* All Steps Overview */}
//                         <div>
//                             <Card className="bg-white">
//                                 <CardHeader>
//                                     <CardTitle>All Steps</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="space-y-3">
//                                         {recipe.instructions.map((instruction, index) => (
//                                             <div
//                                                 key={index}
//                                                 className={`p-3 rounded-lg border cursor-pointer transition-all ${index === currentStep
//                                                         ? "border-primary bg-primary/5"
//                                                         : completedSteps.includes(index)
//                                                             ? "border-green-500 bg-green-50"
//                                                             : "border-gray-200 hover:border-gray-300"
//                                                     }`}
//                                                 onClick={() => setCurrentStep(index)}
//                                             >
//                                                 <div className="flex items-start gap-2">
//                                                     <span
//                                                         className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ${index === currentStep
//                                                                 ? "bg-primary text-primary-foreground"
//                                                                 : completedSteps.includes(index)
//                                                                     ? "bg-green-500 text-white"
//                                                                     : "bg-gray-200 text-gray-600"
//                                                             }`}
//                                                     >
//                                                         {completedSteps.includes(index) ? (
//                                                             <CheckCircle className="w-3 h-3" />
//                                                         ) : (
//                                                             index + 1
//                                                         )}
//                                                     </span>
//                                                     <p className="text-sm leading-relaxed">
//                                                         {instruction}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>
//                     </div>
//                 </main>

//             </div>
//         );
//     }


//     return (
//         <div className="min-h-screen bg-gray-50">

//             <main className="container mx-auto px-4 py-8">
//                 <div className="mb-6">
//                     <Link
//                         href={`/recipes`}
//                         className="inline-flex items-center text-gray-600 hover:text-primary mb-4"
//                     >
//                         <ArrowLeft className="mr-2 h-4 w-4" />
//                         Back to Recipes
//                     </Link>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Recipe Image and Basic Info */}
//                     <div className="lg:col-span-2">
//                         <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
//                             <img
//                                 src={recipe.imageUrl}
//                                 alt={recipe.name}
//                                 className="w-full h-64 md:h-80 object-cover"
//                             />
//                         </div>

//                         <Card className="bg-white mb-6">
//                             <CardHeader>
//                                 <CardTitle className="text-3xl">{recipe.name}</CardTitle>
//                                 <p className="text-gray-600 text-lg">{recipe.description}</p>
//                                 <div className="flex items-center gap-4 mt-4">
//                                     <Badge
//                                         variant="secondary"
//                                         className="flex items-center gap-1"
//                                     >
//                                         <Clock className="w-4 h-4" />
//                                         Prep: {recipe.prepTime}
//                                     </Badge>
//                                     <Badge
//                                         variant="secondary"
//                                         className="flex items-center gap-1"
//                                     >
//                                         <Clock className="w-4 h-4" />
//                                         Cook: {recipe.cookTime}
//                                     </Badge>
//                                     <Badge
//                                         variant="secondary"
//                                         className="flex items-center gap-1"
//                                     >
//                                         <Users className="w-4 h-4" />
//                                         Serves {recipe.servings}
//                                     </Badge>
//                                 </div>
//                             </CardHeader>
//                         </Card>

//                         {/* Instructions */}
//                         <Card className="bg-white">
//                             <CardHeader>
//                                 <CardTitle>Instructions</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <ol className="space-y-4">
//                                     {recipe.instructions.map((instruction, index) => (
//                                         <li key={index} className="flex gap-4">
//                                             <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
//                                                 {index + 1}
//                                             </span>
//                                             <p className="leading-relaxed">{instruction}</p>
//                                         </li>
//                                     ))}
//                                 </ol>
//                             </CardContent>
//                         </Card>
//                     </div>

//                     {/* Sidebar */}
//                     <div className="space-y-6">
//                         {/* Voice Assistant CTA */}
//                         <Card className="bg-white">
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     <Play className="w-5 h-5" />
//                                     Voice Cooking Guide
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <p className="text-gray-600 mb-4">
//                                     Get step-by-step voice guidance while you cook. Perfect for
//                                     hands-free cooking!
//                                 </p>
//                                 <Button onClick={startVoiceGuide} className="w-full" size="lg">
//                                     <Play className="mr-2 h-4 w-4" />
//                                     Start Cooking with Voice Assistant
//                                 </Button>
//                             </CardContent>
//                         </Card>

//                         {/* Ingredients */}
//                         <Card className="bg-white">
//                             <CardHeader>
//                                 <CardTitle>Ingredients</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <ul className="space-y-2">
//                                     {recipe.ingredients.map((ingredient, index) => (
//                                         <li key={index} className="flex items-start gap-2">
//                                             <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
//                                             <span>{ingredient}</span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </main>

//         </div>
//     );
// };

// export default RecipeDetailPage;
import { getRecipe } from '@/lib/actions/recipes.actions';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RecipeGuide from "@/components/RecipeGuide";
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link'
import { generateRecipe } from '@/lib/gemini';
import { getRecipeWithGeneratedData } from '@/lib/actions/recipes.actions'

// Mock recipe data - in a real app, this would come from an API

interface RecipeSessionPageProps {
    params: Promise<{ id: string }>;
}
export default async function RecipeDetails({ params }: RecipeSessionPageProps) {
    const { id } = await params;

    const recipeData = await getRecipe(id);
    // console.log(recipeData);

    const recipe = await getRecipeWithGeneratedData(id);

    // console.log(recipe);

    const { title, image, cookTime, prepTime,
        description, servings, difficulty } = recipe;

    const ingredients = Array.isArray(recipe?.ingredients)
        ? recipe.ingredients
        : JSON.parse(recipe?.ingredients || '[]');

    // console.log(ingredients)
    const instructions = Array.isArray(recipe?.instructions)
        ? recipe.instructions
        : JSON.parse(recipe?.instructions || '[]');
    // console.log(instructions)


    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Recipes
                        </Button>
                    </Link>
                </div>

                {/* Recipe Header */}
                <Card className="mb-6 bg-white">
                    <CardContent className="p-0">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* <div className="relative h-64 md:h-80">
                                <Image
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover rounded-l-xl"
                                    width={350} height={350}
                                />
                            </div> */}
                            <div className="p-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {title}
                                </h1>
                                <p className="text-gray-600 mb-4">{description}</p>

                                <div className="flex flex-wrap gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm text-gray-600">
                                            {prepTime} prep
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ChefHat className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm text-gray-600">
                                            {cookTime} cook
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm text-gray-600">
                                            {servings} servings
                                        </span>
                                    </div>
                                </div>

                                <Badge
                                    variant={
                                        difficulty === "Easy"
                                            ? "secondary"
                                            : difficulty === "Medium"
                                                ? "default"
                                                : "destructive"
                                    }
                                    className="mb-4"
                                >
                                    {difficulty}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Ingredients */}
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-900">
                                Ingredients
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {ingredients?.map((ingredient: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                                        <span className="text-gray-700">{ingredient}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Voice Guide */}
                    <RecipeGuide
                        {...recipeData}
                        instructions={instructions}
                        className="h-fit"
                    />
                </div>
            </div>
        </div>
    );
}
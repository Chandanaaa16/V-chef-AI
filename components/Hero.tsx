'use client'
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRight, ChefHat, Utensils } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
    onGetRecipes?: (ingredients: string) => void;
}

const Hero = ({ onGetRecipes = () => { } }: HeroSectionProps) => {
    const [ingredients, setIngredients] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGetRecipes(ingredients);
    };

    return (
        <section className="relative w-full bg-gradient-to-b from-amber-50 to-white py-8 md:py-32 px-4 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-20 right-10 text-amber-200 opacity-30">
                <ChefHat size={120} />
            </div>
            <div className="absolute bottom-10 left-10 text-sage-200 opacity-20">
                <Utensils size={100} />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Left content */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 flex items-center gap-3 whitespace-nowrap">
                            <ChefHat className="text-amber-500" />
                            <span className="text-amber-500">V-Chef — Cook Smart with AI</span>
                        </h1>
                        {/* Lead paragraph removed by request */}

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto md:mx-0"
                        >
                            <Input
                                type="text"
                                placeholder="Enter ingredients (e.g., eggs, spinach, cheese)"
                                className="flex-grow text-base py-6 border-amber-200 focus:border-amber-400 bg-white"
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                            />
                            <Button
                                //type="submit"
                                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-6 flex items-center gap-2"
                            >
                                <Link href={`/recipes/new`}>
                                Get Recipes
                                </Link>
                                
                                <ArrowRight size={18} />
                            </Button>
                        </form>

                        <div className="mt-8 text-sm text-gray-500">
                            <p>
                                Try with: "chicken, rice, bell peppers" or "pasta, tomatoes,
                                basil"
                            </p>
                        </div>
                    </div>

                    {/* Right content - Illustration */}
                    <div className="flex-1 flex justify-center md:justify-end">
                            <div className="relative w-full max-w-xl">
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
                                <img
                                    src="/rat-logo.jpg"
                                    alt="V-Chef Mascot"
                                    className="w-full h-96 rounded-lg object-cover object-center"
                                />
                                <div className="mt-4 p-3 bg-amber-50 rounded-lg text-center">
                                    <h3 className="font-poppins font-bold text-amber-800 text-lg md:text-xl tracking-tight">
                                        "Let Remy be your AI!"
                                    </h3>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-green-100 rounded-full p-4 shadow-md border border-green-200">
                                <span className="text-green-600 font-medium">Voice Guided</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

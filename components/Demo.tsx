import React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DemoVisualizationProps {
    steps?: Array<{
        title: string;
        description: string;
        image: string;
    }>;
}

const DemoVisualization = ({
    steps = defaultSteps,
}: DemoVisualizationProps) => {
    return (
        <section className="py-16 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                        See How It Works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        From ingredients to delicious meals in just a few simple steps
                    </p>
                </div>

                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-200 via-green-200 to-orange-200 transform -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index}>
                                <Card className="h-full border-2 border-gray-100 hover:border-orange-200 transition-all duration-300 shadow-md hover:shadow-lg">
                                    <CardContent className="p-6 flex flex-col items-center">
                                        <div className="relative mb-6 w-full h-64 overflow-hidden rounded-lg bg-gray-100">
                                            <img
                                                src={step.image}
                                                alt={step.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                                <span className="inline-block bg-orange-500 text-white text-sm font-medium px-2 py-1 rounded">
                                                    Step {index + 1}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 text-center">
                                            {step.description}
                                        </p>

                                        {index < steps.length - 1 && (
                                            <div className="hidden md:flex justify-center mt-6">
                                                <ArrowRight className="text-orange-500 h-6 w-6" />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const defaultSteps = [
    {
        title: "Input Your Ingredients",
        description:
            "Simply enter the ingredients you have available in your kitchen.",
        image:
            "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=800&q=80",
    },
    {
        title: "AI Generates Recipes",
        description:
            "Transform your available ingredients into delicious recipes with our AI-powered kitchen assistant. Get personalized recipes with voice guidance in seconds.",
        image:
            "/rat-logo.jpg",
    },
    {
        title: "Cook with Voice Guidance",
        description:
            "Follow along with step-by-step voice instructions as you prepare your meal.",
        image:
            "https://images.unsplash.com/photo-1556911073-a517e752729c?w=800&q=80",
    },
];

export default DemoVisualization;

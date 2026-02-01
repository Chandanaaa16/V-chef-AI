'use client'
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, Loader } from "lucide-react";
import { cn, configureAssistant } from "@/lib/utils";
import { vapi } from '@/lib/vapi.sdk';
import { toast } from 'sonner';

interface VoiceGuideProps {
    ingredients: string | string[],
    dietaryPreferences?: string[] | undefined;
    allergies?: string[] | undefined,
    cuisineType: string,
    difficultyLevel: string,
    cookingTime: string,
    servings: string | number,
    excludedIngredients?: string[] | undefined,
    instructions?: Array<string | { instruction: string }>;
    title?: string;
    description?: string;
    image?: string;
    className?: string;
}

enum CallStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    CONNECTING = 'CONNECTING',
    FINISHED = 'FINISHED'
}

export default function RecipeGuide({
    ingredients, dietaryPreferences, allergies,
    excludedIngredients, cuisineType, servings,
    difficultyLevel, cookingTime,
    instructions = [],
    title, description, image,
    className,
    }: VoiceGuideProps) {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Build a normalized generatedRecipe object so the assistant can use it directly
    const generatedRecipeObj = {
        title: title || '',
        description: description || '',
        image: image || '',
        ingredients: Array.isArray(ingredients) ? ingredients : (typeof ingredients === 'string' ? ingredients.split(',').map((i) => i.trim()).filter(Boolean) : []),
        instructions: (instructions || []).map((s) => (typeof s === 'string' ? s : s.instruction || '')),
    };


    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        // Install a lightweight console.error filter for the lifetime of this component
        const originalConsoleError = console.error;
        console.error = (...args: any[]) => {
            const hasEmptyObject = args.some((a) => typeof a === 'object' && a && Object.keys(a).length === 0);
            const firstArgIsErrorInCall = typeof args[0] === 'string' && args[0].toLowerCase().includes('error in call');
            if (hasEmptyObject || firstArgIsErrorInCall) {
                // degrade to warn to avoid Next's error overlay for VAPI's internal non-fatal logs
                console.warn(...args);
                return;
            }
            originalConsoleError.apply(console, args as any);
        };

        const onCallStart = () => {
            setCallStatus(CallStatus.ACTIVE);
        }

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
        }

        const onSpeechStart = () => {
            setIsSpeaking(true);

        }

        const onSpeechEnd = () => {
            setIsSpeaking(false);
        }
        const onError = (error: any) => {
            // Use warn to avoid Next's runtime overlay for non-fatal VAPI errors
            console.warn('Error in call:', error);
            setCallStatus(CallStatus.FINISHED);
        }

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);


        return () => {
            // restore original console.error
            console.error = originalConsoleError;

            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd)
        }
    }, [])


    const handleConnect = async () => {
        setCallStatus(CallStatus.CONNECTING);

        const assistantOverride = {
            variableValues: {
                ingredients: Array.isArray(ingredients) ? ingredients.join(', ') : (ingredients || ''),
                dietaryPreferences: (dietaryPreferences || []).join(', '),
                allergies: (allergies || []).join(', '),
                excludedIngredients: Array.isArray(excludedIngredients) ? excludedIngredients.join(', ') : (excludedIngredients || ''),
                cuisineType: cuisineType || '',
                servings: String(servings || ''),
                difficultyLevel: difficultyLevel || '',
                cookingTime: cookingTime || '',
                generatedRecipe: JSON.stringify(generatedRecipeObj),
            },
            clientMessages: ['transcript'],
            serverMessages: [],
        }

        // Validate runtime config
        if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
            toast.error('Voice guide is not configured on this environment.');
            console.warn('VAPI token not configured. Voice Guide disabled.');
            setCallStatus(CallStatus.INACTIVE);
            return;
        }

        // Check microphone permission before starting
        if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (err) {
                toast.error('Microphone access denied. Please allow microphone and try again.');
                console.warn('Microphone access denied:', err);
                setCallStatus(CallStatus.INACTIVE);
                return;
            }
        }

        try {
            // @ts-ignore - vapi typings may not include start
            await vapi.start(configureAssistant(), assistantOverride);
            // proactively set active state so UI responds immediately
            setCallStatus(CallStatus.ACTIVE);
            toast.success('Voice guide connected.');
        } catch (err) {
            toast.error('Failed to start voice guide. See console for details.');
            console.warn('VAPI start failed:', err);
            setCallStatus(CallStatus.INACTIVE);
        }

    }

    const handleDisconnect = async () => {
        try {
            // @ts-ignore - vapi typings may not include stop
            await vapi.stop();
            toast('Call ended.');
        } catch (err) {
            toast.error('Failed to stop call.');
            console.warn('VAPI stop failed:', err);
        } finally {
            setCallStatus(CallStatus.FINISHED);
            setIsMuted(false);
        }
    }

    const toggleMicrophone = () => {
        if (callStatus !== CallStatus.ACTIVE) {
            toast.error('No active call to mute/unmute.');
            console.warn('No active call to mute/unmute');
            return;
        }

        try {
            const muted = (typeof vapi.isMuted === 'function') ? vapi.isMuted() : isMuted;
            // @ts-ignore
            vapi.setMuted(!muted);
            setIsMuted(!muted);
            toast((!muted) ? 'Muted' : 'Unmuted');
        } catch (err) {
            toast.error('Failed to toggle mute.');
            console.warn('Failed to toggle mute:', err);
        }
    }

    


    return (
        <Card className={cn("bg-white", className)}>
            <CardHeader className="">
                <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-orange-500" />
                    Voice Guide
                </CardTitle>
                {/* Show a visible banner when the VAPI token is missing */}
                {!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN && (
                    <div className="mt-2 p-2 rounded bg-red-50 border border-red-100 text-red-700 text-sm">
                        Voice guide is not configured for this environment. To enable it:
                        <div className="mt-1">
                            1) Add <code className="font-mono">NEXT_PUBLIC_VAPI_WEB_TOKEN</code> to <code className="font-mono">.env.local</code>.
                        </div>
                        <div>2) Restart the dev server (npm run dev).</div>
                    </div>
                )}
                {/* <div className="flex justify-between">
                    <Button>
                        End Call
                    </Button>
                </div> */}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={callStatus === CallStatus.ACTIVE
                            ? handleDisconnect : handleConnect}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        {callStatus === CallStatus.ACTIVE ? (
                            <Pause className="h-4 w-4" /> 
                        ) : callStatus === CallStatus.CONNECTING ? (
                            <Loader className="h-4 w-4" />)
                            : (
                                <Play className="h-4 w-4" />
                            )}
                        {callStatus === CallStatus.ACTIVE ? (
                            "Pause"
                        ) : callStatus === CallStatus.CONNECTING ? (
                            "Connecting")
                            : (
                                "Play"
                            )}
                    </Button>
                    <Button
                        onClick={toggleMicrophone}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        {isMuted ? (
                            <VolumeX className="h-4 w-4" />
                        ) : (
                            <Volume2 className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">Cooking Instructions:</p>
                    {(instructions || []).map((instruction, index) => {
                        const text = typeof instruction === 'string' ? instruction : instruction?.instruction || '';
                        return (
                        <div
                            key={index}
                            className={cn(
                                "p-3 rounded-lg border cursor-pointer transition-colors",
                                currentStep === index
                                    ? "bg-orange-50 border-orange-200 text-orange-900"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100",
                            )}
                        >
                            <div className="flex items-start gap-2">
                                <span
                                    className={cn(
                                        "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                                        currentStep === index
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-300 text-gray-600",
                                    )}
                                >
                                    {index + 1}
                                </span>
                                <p className="text-sm leading-relaxed">{text}</p>
                            </div>
                        </div>
                        )
                    })}
                </div>

                {instructions.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No cooking instructions available
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

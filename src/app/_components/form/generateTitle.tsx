"use client";

import { TitleContext } from '@/app/_context/TitleContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/trpc/client';
import { ArrowRight, Brain, CheckCircle2, RotateCw, Sparkles } from 'lucide-react';
// import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

export default function GenerateTitle() {
    const { register, handleSubmit, formState: { errors }, getValues, watch } = useForm();
    const { mutate, data, isSuccess, isPending, error } = trpc.post.generateTitle.useMutation();
    const [selectedTitle, setSelectedTitle] = useState<string>("");
    const [titleArray, setTitleArray] = useState<string[]>([]);
    const [hasGenerated, setHasGenerated] = useState<boolean>(false);
    
    // const router = useRouter();
    const titleContext = useContext(TitleContext);

    if (!titleContext) {
        throw new Error("TitleContext is not provided");
    }

    const { setStep, setTitle } = titleContext;
    const prompt = watch("prompt");

    useEffect(() => {
        if (data && isSuccess && typeof data === 'string') {
            const match = (data as string).match(/\[\s*[\s\S]*\s*\]/);
            if (match) {
                try {
                    const titlesArray = JSON.parse(match[0]);
                    setTitleArray(titlesArray);
                    setHasGenerated(true);
                } catch (e) {
                    console.error("Failed to parse titles array", e);
                }
            }
        }
    }, [data, isSuccess]);

    const handleGenerateTitles = (formData: { prompt: string }) => {
        mutate({ prompt: formData.prompt });
    };

    const handleNext = () => {
        if (selectedTitle) {
            setTitle(selectedTitle);
            setStep(2);
        }
    };

    const handleUseCustomTitle = () => {
        const customTitle = getValues("prompt");
        if (customTitle) {
            setTitle(customTitle);
            setStep(2);
        }
    };

    return (
        <div className="space-y-6">
            {/* Input Card */}
            <Card className="border-2 border-dashed">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">AI Title Generator</CardTitle>
                    </div>
                    <CardDescription>
                        Enter a topic, keywords, or brief description to generate engaging titles
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handleGenerateTitles)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="prompt" className="text-sm font-medium">
                                Topic or Description
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="prompt"
                                    placeholder="e.g., The future of artificial intelligence in healthcare"
                                    {...register("prompt", { required: "Please enter a topic or description" })}
                                    className={errors.prompt ? "border-destructive" : ""}
                                />
                                <Button 
                                    type="submit" 
                                    disabled={isPending || !prompt}
                                    className="gap-2 min-w-[140px]"
                                >
                                    {isPending ? (
                                        <>
                                            <RotateCw className="h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4" />
                                            {hasGenerated ? 'Regenerate' : 'Generate Titles'}
                                        </>
                                    )}
                                </Button>
                            </div>
                            {errors.prompt && (
                                <p className="text-sm text-destructive">{errors.prompt.message as string}</p>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Generated Titles */}
            {isPending && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {titleArray.length > 0 && (
                <Card className="border-primary/20">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-full bg-primary/10">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Suggested Titles</CardTitle>
                            </div>
                            <Badge variant="secondary">{titleArray.length} titles generated</Badge>
                        </div>
                        <CardDescription>
                            Select the best title for your post
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup 
                            value={selectedTitle} 
                            onValueChange={setSelectedTitle}
                            className="space-y-3"
                        >
                            {titleArray.map((item, index) => (
                                <div
                                    key={index}
                                    className={`
                                        flex items-start space-x-3 p-4 rounded-lg border-2
                                        transition-all cursor-pointer
                                        ${selectedTitle === item 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-transparent bg-muted/50 hover:bg-muted'
                                        }
                                    `}
                                    onClick={() => setSelectedTitle(item)}
                                >
                                    <RadioGroupItem value={item} id={item} className="mt-1" />
                                    <Label 
                                        htmlFor={item} 
                                        className="flex-1 cursor-pointer font-normal text-base leading-relaxed"
                                    >
                                        {item}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                        <Button
                            variant="outline"
                            onClick={handleUseCustomTitle}
                        >
                            Use my original title
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={!selectedTitle}
                            className="gap-2"
                        >
                            Continue with selected title
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        Failed to generate titles. Please try again.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
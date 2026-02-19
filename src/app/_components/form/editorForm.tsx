"use client";

import { TitleContext } from '@/app/_context/TitleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import TextEditor from './textEditor';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Sparkles } from 'lucide-react';

export default function Form({tags,category}:{tags:{id:string,name:string}[],category:{id:string,name:string}[]}) {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const {mutate,data,isSuccess,isPending} = trpc.post.generatePosts.useMutation();
    const {mutate:savePostMutate,isSuccess:savePostIsSuccess} = trpc.post.savePost.useMutation();
    const stepContext = useContext(TitleContext);
    
    if (!stepContext) {
        throw new Error("TitleContext is not provided");
    }
    
    const { title } = stepContext;
    const [post,setPost] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        if(data && isSuccess) {
            console.log("useEffect working");
            setPost(data);
            router.replace(window.location.pathname);
        }
        if(savePostIsSuccess) {
            console.log("Post saved successfully");
            router.push("/dashboard");
        }
    }, [data,setPost,isSuccess,router,savePostIsSuccess,title]);

    if(isPending) {
        return (
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="py-16">
                    <div className="text-center space-y-6">
                        <div className="relative mx-auto w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                            <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" />
                            <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Generating Your Post
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                We&apos;re crafting something amazing based on your title. This will only take a moment...
                            </p>
                        </div>
                        <div className="flex justify-center gap-1.5">
                            {[1, 2, 3].map((i) => (
                                <div 
                                    key={i} 
                                    className="w-2 h-2 rounded-full bg-primary/30 animate-bounce" 
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            {/* Title Card */}
            <Card className="border-l-4 border-l-primary shadow-md">
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-lg bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl mb-1.5">Writing: &quot;{title}&quot;</CardTitle>
                            <CardDescription>
                                Fine-tune your content with additional instructions
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* AI Prompt Form */}
            <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-background to-muted/30">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-primary/10">
                            <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-lg">AI Content Assistant</CardTitle>
                    </div>
                    <CardDescription>
                        Provide specific instructions to customize your generated content
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit((data) => { mutate({prompt: data.prompt, title}); })} className="space-y-5">
                        <div className="space-y-2.5">
                            <Label 
                                htmlFor="prompt" 
                                className="text-sm font-medium flex items-center gap-2"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                Brief description or instructions
                            </Label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <Input
                                        id="prompt"
                                        type="text"
                                        placeholder="e.g., Focus on practical examples, include statistics, keep it conversational..."
                                        {...register("prompt", { required: true })}
                                        className={`
                                            w-full transition-all
                                            ${errors.prompt 
                                                ? 'border-destructive ring-destructive/20' 
                                                : 'focus:border-primary focus:ring-primary/20'
                                            }
                                        `}
                                    />
                                    {errors.prompt && (
                                        <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-destructive" />
                                            This field is required
                                        </p>
                                    )}
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={isPending}
                                    className="gap-2 sm:w-auto w-full"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Generate Content
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Text Editor */}
            {post && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2">
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                        <span className="text-xs font-medium text-muted-foreground px-2">
                            CONTENT GENERATED
                        </span>
                        <div className="h-0.5 flex-1 bg-gradient-to-l from-primary/50 to-transparent" />
                    </div>
                    
                    <TextEditor 
                        functions="save" 
                        post={{
                            content: post, 
                            tags: [], 
                            category: null
                        }} 
                        title={title} 
                        savePostMutate={savePostMutate} 
                        editPostMutate={undefined}
                        categories={category}
                        tags={tags}
                        postId={undefined}  
                        slug={undefined} 
                    />
                </div>
            )}
        </div>
    );
}
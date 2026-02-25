'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { handleUpload } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import Text from '@tiptap/extension-text';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ParagraphActions } from '../../../lib/tiptap';
import MediaUploader from '../mediaUploader';
import MultiTagSelect from './mutlti-input-selector';
import SingleInputSelector from './single-input-selector';
import TextEditorButtons from './TextEditorButtons';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Edit,
    FileText,
    FolderTree,
    Image as ImageIcon,
    Loader2,
    Save,
    Send,
    Tag
} from 'lucide-react';

enum status {
    draft = 'draft',
    publish = 'publish',
}

function prettifyGeminiOutput(raw: string) {
    try {
        let cleaned = raw.replace(/``html|```/g, '').trim();
        cleaned = cleaned.replace("html", "").trim();
        cleaned = cleaned.replace(/\n{2,}/g, "</p><p>");
        cleaned = `<p>${cleaned}</p>`;
        return cleaned;
    } catch {
        return raw;
    }
}

export default function TextEditor({
    post,
    title,
    savePostMutate,
    editPostMutate,
    functions,
    postId,
    slug,
    categories,
    tags
}: { 
    post: {
        content: string,
        tags: string[],
        category: string | null
    },
    title: string,
    savePostMutate?: (data: {
        userId: string,
        title: string,
        content: string,
        status: status,
        categoryId: string,
        tags: string[],
        image_url: string
    }) => void,
    editPostMutate?: (data: {
        postId: string,
        title: string,
        content: string,
        slug: string,
        categoryId: string,
        tags: string[],
        image_url: string
    }) => void,
    functions: string,
    postId?: string,
    tags: { id: string; name: string }[];
    categories: { id: string; name: string }[];
    slug?: string;
}) {
    const { userId, isLoaded } = useAuth();
    const [submitting,setIsSubmitting] = useState<boolean>(false);
    const [postStatus,setPostStatus] = useState<status>(status.draft);

    const schema = z.object({
        tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
        category: z.string().min(1, "Category is required"),
        file: z
            .instanceof(File)
            .refine((file) => file.size > 0, {
                message: "File is required",
            })
            .refine((file) => file.size <= 5 * 1024 * 1024, {
                message: "File must be less than 5MB",
            })
            .refine((file) => ["image/png", "image/jpeg"].includes(file.type), {
                message: "Only PNG and JPEG images are allowed",
            }),
    });

    const form = useForm<z.infer<typeof schema>>({
        defaultValues: {
            category: post.category || "",
            tags: post.tags || [],
            file: {} as File,
        },
        resolver: zodResolver(schema),
    })

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: false,
            }), 
            Bold, 
            Italic, 
            Heading.configure({
                levels: [1, 2, 3],
            }),
            BulletList,
            Document, 
            Text, 
            ListItem,
            ParagraphActions,
        ],
        content: `${post.content}`,
    }) as Editor | null

    useEffect(() => {
        if (editor) {
            const html = prettifyGeminiOutput(post.content);
            editor.commands.setContent(html, false);
        }
    }, [editor, post, functions, postId, editPostMutate]);

    if (!editor && !isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading editor...</p>
                </div>
            </div>
        );
    }

    const onSubmit = async (data: z.infer<typeof schema>) => {
        const imageUrl: string = await handleUpload(data.file);
        if (!imageUrl) {
            console.error("Image upload failed");
            return;
        }
        
        if (functions === "save" && savePostMutate) {
            setIsSubmitting(true);
            savePostMutate({
                userId: userId || "",
                title: title,
                content: editor?.getHTML() || "",
                status: postStatus,
                categoryId: data.category,
                tags: data.tags,
                image_url: imageUrl
            });
        } else if (postId && editPostMutate) {
            setIsSubmitting(true);
            editPostMutate({
                postId: postId,
                title: title,
                content: editor?.getHTML() || "",
                slug: slug || "",
                categoryId: data.category,
                tags: data.tags,
                image_url: imageUrl
            });
        }
    }

    return (
        <div className="space-y-6">
            {/* Title Bar */}
            <div className="flex items-center gap-3 pb-4 border-b">
                <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <p className="text-sm text-muted-foreground">
                        {functions === "save" ? "Creating new post" : "Editing post"}
                    </p>
                </div>
            </div>

            {/* Editor Card */}
            <Card className="border shadow-lg overflow-hidden">
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="p-3 bg-muted/30 border-b">
                        <TextEditorButtons editor={editor} />
                    </div>
                    
                    {/* Editor Content */}
                    <div className="p-6">
                        <EditorContent 
                            editor={editor} 
                            className="prose prose-sm sm:prose-base max-w-none dark:prose-invert focus:outline-none min-h-[400px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Post Settings Form */}
            <Card className="border shadow-md">
                <CardContent className="p-6">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Category & Tags */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <FolderTree className="h-4 w-4" />
                                    Category
                                </Label>
                                <Controller
                                    name="category"
                                    control={form.control}
                                    defaultValue={post.category || ""}
                                    render={({ field }) => (
                                        <SingleInputSelector 
                                            value={field.value} 
                                            options={categories} 
                                            valueChange={field.onChange} 
                                        />
                                    )}
                                />
                                <ErrorMessage
                                    name="category"
                                    errors={form.formState.errors}
                                    render={({ message }) => (
                                        <p className="text-sm text-destructive">{message}</p>
                                    )}
                                />
                            </div>

                            {/* Tags */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Tag className="h-4 w-4" />
                                    Tags
                                </Label>
                                <Controller
                                    name="tags"
                                    control={form.control}
                                    render={({ field }) => (
                                        <MultiTagSelect
                                            selectedTags={field.value}
                                            setValue={form.setValue}
                                            options={tags}
                                        />
                                    )}
                                />
                                <ErrorMessage
                                    name="tags"
                                    errors={form.formState.errors}
                                    render={({ message }) => (
                                        <p className="text-sm text-destructive">{message}</p>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2 text-sm font-medium">
                                <ImageIcon className="h-4 w-4" />
                                Featured Image
                            </Label>
                            <Controller
                                name="file"
                                control={form.control}
                                render={({ field }) => (
                                    <MediaUploader
                                        onFieldStateChange={(file) => field.onChange(file)}
                                    />
                                )}
                            />
                            <ErrorMessage
                                name="file"
                                errors={form.formState.errors}
                                render={({ message }) => (
                                    <p className="text-sm text-destructive">{message}</p>
                                )}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                            {functions === "save" && savePostMutate ? (
                                <>
                                    <Button 
                                        type="submit" 
                                        variant="outline"
                                        className="flex-1 gap-2 cursor-pointer"
                                        disabled={submitting}
                                        onClick={() => setPostStatus(status.draft)}
                                    >
                                        <Save className="h-4 w-4" />
                                        Save as Draft
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        className="flex-1 gap-2 cursor-pointer"
                                        disabled={submitting}
                                        onClick={() => setPostStatus(status.publish)}
                                    >
                                        <Send className="h-4 w-4r" />
                                        Publish Post
                                    </Button>
                                </>
                            ) : editPostMutate && functions === "edit" && postId && (
                                <Button 
                                    type="submit" 
                                    className="flex-1 gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    Update Post
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}



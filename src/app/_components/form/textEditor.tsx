'use client'

import { useAuth } from '@clerk/nextjs';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
// import Paragraph from '@tiptap/extension-paragraph';
import { handleUpload } from '@/lib/utils';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import Text from '@tiptap/extension-text';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ParagraphActions } from '../../../lib/tiptap';
import MediaUploader from '../mediaUploader';
import MultiTagSelect from './mutlti-input-selector';
import SingleInputSelector from './single-input-selector';
import TextEditorButtons from './TextEditorButtons';



// ADD PUBLISH BUTTON AS WELL
// ADD SAVE DRAFT BUTTON AS WELL
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


export default function TextEditor(
    {post,title,savePostMutate,editPostMutate,functions,postId,slug,categories,tags}:
    { 
        post:{
            content:string,
            tags:string[],
            category:string | null
        },
        title:string,
        savePostMutate:(
            (data:
                {
                    userId:string,
                    title:string,
                    content:string,
                    status:status,
                    categoryId:string,
                    tags:string[],
                    image_url:string
                }) => void ) | undefined,
        editPostMutate: ((data:{
            postId:string,
            title:string,
            content:string,
            slug: string,
            categoryId:string,
            tags:string[],
            image_url:string
        }) => void) | undefined,
        functions:string,
        postId:string | undefined,
        tags: { id: string; name: string }[];
        categories: { id: string; name: string }[];
        slug: string | undefined;
    }) {
    const {userId,isLoaded} = useAuth();

    const schema = z.object({
        tags: z.array(z.string().min(1)).length(1, "At least one tag is required"),
        category: z.string().min(1),
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

    //react hook form for the editor
    const form = useForm<z.infer<typeof schema>>({
        defaultValues: {
            category:"",
            tags: [],
            file: {} as File, // Initialize with an empty File object
        },
        resolver: zodResolver(schema),
    })

    console.log(post.tags)
    // Text editor setup
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: false, // Disable default paragraph extension
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



    //UseEffect to handle the success of the edit post mutation
    // This will redirect the user to the post page after editing

    //UseEffect to set the content of the editor
    useEffect(() => {
        if (editor) {
            const html = prettifyGeminiOutput(post.content);
            editor.commands.setContent(html,false);
        }
    }, [editor,post,functions,postId,editPostMutate]);

    // Condition to check if the editor is loaded
    // and if the userId is available
    // If not, it will return a loading state or throw an error
    if (!editor && !isLoaded) {
        return <p>Loading...</p>;
    }

    const onSubmit = async (data: z.infer<typeof schema>) => {
        const imageUrl:string = await handleUpload(data.file);
        if (!imageUrl) {
            console.error("Image upload failed");
            return;
        }
        if(functions === "save"){
            console.log(editor?.getHTML());
            savePostMutate!({
                userId:userId || "",
                title:title,
                content:editor?.getHTML() || "",
                status:status.draft,
                categoryId:data.category,
                tags:data.tags,
                image_url: imageUrl
            });
        } else if(postId && editPostMutate) {
            editPostMutate({
                postId:postId,
                title:title,
                content:editor?.getHTML() || "",
                slug:slug || "",
                categoryId:data.category,
                tags:data.tags,
                image_url: imageUrl
            })
        }
        console.log(data)


    }
  return (
    <div>
        <div className="max-w-3xl mx-auto p-4 border rounded-xl bg-white">
            <TextEditorButtons editor={editor} />
            <EditorContent editor={editor} className="min-h-[300px] border-t pt-2 text-base leading-relaxed text-black " />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                    name="category"
                    control={form.control}
                    defaultValue={post.category || ""}
                    render={({ field }) => (
                        <SingleInputSelector value={field.value} options={categories} valueChange={field.onChange} />
                    )}
                />       
                <ErrorMessage 
                    name='category' 
                    errors={form.formState.errors}
                    render={({message}) => <p>{message}</p>}  
                />     

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
                    name='tags' 
                    errors={form.formState.errors}
                    render={({message}) => <p>{message}</p>}  
                />     

                <Controller
                    name="file"
                    control={form.control}
                    render={({ field }) => (
                    <div>
                        <MediaUploader
                            onFieldStateChange={(file) => field.onChange(file)}
                        />
                    </div>
                    )}
                />
                <ErrorMessage 
                    name='file' 
                    errors={form.formState.errors}
                    render={({message}) => <p>{message}</p>}  
                />     

                {
                    functions === "save" && savePostMutate ? (
                        <div className="flex flex-row">
                        <button type="submit" className="flex items-center gap-2 mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm">
                                <span className="text-sm text-gray-500">Save Draft</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v7.586l-3.293-3.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 00-1.414-1.414L11 10.586V3a1 1 0 00-1-1z" clipRule="evenodd" />
                                    <path d="M4.293 9.293a1 1 0 011.414 0L10 13.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                            <button type='submit' className="flex items-center gap-2 mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm">
                                <span className="text-sm text-gray-500">Publish</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v7.586l-3.293-3.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 00-1.414-1.414L11 10.586V3a1 1 0 00-1-1z" clipRule="evenodd" />
                                    <path d="M4.293 9.293a1 1 0 011.414 0L10 13.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                        </div>

                        
                    ) :
                    editPostMutate && functions === "edit" && postId &&
                    (
                        
                        <button  type='submit'  className="flex items-center gap-2 mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm">
                            <span className="text-sm text-gray-500">Edit</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v7.586l-3.293-3.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 00-1.414-1.414L11 10.586V3a1 1 0 00-1-1z" clipRule="evenodd" />
                                <path d="M4.293 9.293a1 1 0 011.414 0L10 13.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" />
                            </svg>
                        </button>
                    )
                }
            </form>                
        </div>
    </div>
  )
}




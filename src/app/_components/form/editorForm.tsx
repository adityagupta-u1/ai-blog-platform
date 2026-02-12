"use client";

import { TitleContext } from '@/app/_context/TitleContext';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import TextEditor from './textEditor';




export default function Form({tags,category}:{tags:{id:string,name:string}[],category:{id:string,name:string}[]}) {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const trpc = useTRPC();
    const {mutate,data,isSuccess,isPending} = useMutation(trpc.post.generatePosts.mutationOptions());
    const {mutate:savePostMutate,isSuccess:savePostIsSuccess} = useMutation(trpc.post.savePost.mutationOptions());
    const stepContext = useContext(TitleContext);
    if (!stepContext) {
        throw new Error("TitleContext is not provided");
    }
    const { title } = stepContext;
    // mutate({prompt:title});
    const [post,setPost] = useState<string>("");
    const router = useRouter();
    // useEffect(() => {
    //     console.log("useEffect working");
    //     if(title){
    //         mutate({prompt:title});
    //         // setTitle("")
    //     }
    // },[mutate,title,setTitle]);
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


    if(isPending) return <p>we are generating your post, almost there 😊.</p>;
  return (
     <>
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <form action="" onSubmit={handleSubmit((data) => { mutate({prompt: data.prompt,title}); })} >
                <div>
                    <label htmlFor="prompt">Enter a brief description...</label>
                    <input type="text" id="prompt" {...register("prompt", { required: true })} />
                    {errors.prompt && <span>This field is required</span>}
                </div>
                <button type="submit">AI Prompt</button>
            </form>
        {
            post 
            && 
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
        }
     </>
  )
}

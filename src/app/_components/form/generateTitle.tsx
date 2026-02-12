"use client";

import { TitleContext } from '@/app/_context/TitleContext';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Button } from '../ui/button';



//TODO: Make the list of titles selectable


export default function GenerateTitle() {

    const { register, handleSubmit,  formState: { errors } ,getValues} = useForm();
    const trpc = useTRPC();
    // const utils = utilsTrpc
    const {mutate,data,isSuccess,isPending} = useMutation(trpc.post.generateTitle.mutationOptions());
    const [aiTitle,setAiTitle] = useState<string>("");
    const [initialLoad,setInitialLoad] = useState<boolean>(false);
    const [hasReplace,setHasReplace] = useState<boolean>(false);
    const [disable,setDisable] = useState<boolean>(false);
    const [titleArray,setTitleArray] = useState<string[]>();
    const router = useRouter();
    const titleContext = useContext(TitleContext);

    if (!titleContext) {
        throw new Error("TitleContext is not provided");
    }

    const { setStep,setTitle} = titleContext;
    useEffect(() => {
        if(data && isSuccess && !hasReplace) {
                // Extract just the array using regex
                if(!initialLoad) {
                    setInitialLoad(true);
                };
                const match = data.match(/\[\s*[\s\S]*\s*\]/);

                if (match) {
                const titlesArray = JSON.parse(match[0]);
                console.log("Title Array: ",titlesArray);
                setTitleArray(titlesArray);
                // router.replace(window.location.pathname);
                setHasReplace(true);
            } else {
                console.error("Array not found in response");
            }
            // console.log("Title Array: ",titleArray);
        }
    }, [data,isSuccess,router,titleArray,setTitleArray,hasReplace,setHasReplace,initialLoad]);

    useEffect(() => {
        if(aiTitle) {
            console.log("AI Title: ",aiTitle);
        }
    },[aiTitle])


  return (
        <div>
            <form action="" onSubmit={handleSubmit((data) => { setHasReplace(false); mutate({prompt: data.prompt}); })} >
                <div>
                    <label htmlFor="prompt">Enter a title or a brief description...</label>
                    <input type="text" id="prompt" {...register("prompt", { required: true })} />
                    {errors.prompt && <span>This field is required</span>}
                </div>
                { initialLoad ? <button type="submit" disabled={isPending}>Regenerate Titles</button> : <button type="submit" disabled={isPending}>Generate Titles</button>}
                <button type="button" disabled={disable} onClick={() => { setDisable(true); setStep((prevStep:number) =>  prevStep + 1); const title = getValues("prompt"); setTitle(title) }}>Submit</button>
       
                {titleArray && <div>
                    <h2>Generated Titles:</h2>
                    <div className="flex flex-col gap-4" >
                        {titleArray.map((item, index) => (  
                            <div key={index} className="flex flex-row gap-2">
                                <label htmlFor={item} className="text-lg">{item}</label>
                                <input type="radio" name="title" key={index}  value={item} onClick={() => {setAiTitle(item);}}/>
                            </div>
                        ))}
                    </div>
                </div>}
                {aiTitle && <Button variant='default' disabled={disable} onClick={(e) => {e.preventDefault(); setDisable(true); setStep((prevStep:number) =>  prevStep + 1); setTitle(aiTitle) }}>Next</Button>}
            </form>
        </div>

  )
}

'use client';
import { trpc } from '@/trpc/client';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
    tag: string;
};

export default function AddTagButton() {
    const [clicked, setClicked] = useState<boolean>(false);
    const {handleSubmit,register,formState:{errors}} = useForm<FormData>()
    // const router = useRouter();
    const utils = trpc.useUtils();
    const queryClient = useQueryClient();
    // const queryOptions = trpc.tags.getTags.queryOptions();
    const {mutate, isPending} = trpc.tags.addTag.useMutation({
        onMutate: async (tag) => {
            // Cancel ongoing fetches
            console.log(queryClient.getQueryCache().getAll().map(q => q.queryKey));

            // await queryClient.cancelQueries({ queryKey: queryOptions.queryKey });
            await utils.tags.getTags.cancel();
            // Snapshot previous categories
            // const previousTags = queryClient.getQueryData<{id: string; name: string; slug: string; }[]>(queryOptions.queryKey);
            const previousTags = utils.tags.getTags.getData();
            // Optimistically update the cache
            utils.tags.getTags.setData(undefined, (old: {id: string; name: string; slug: string;}[] | undefined) =>
                old
                    ? [
                        ...old,
                        {
                        id: Math.random().toString(),
                        name: typeof tag === 'string' ? tag : tag.tag,
                        slug: (typeof tag === 'string' ? tag : tag.tag).toLowerCase().replace(/\s+/g, '-'),
                        },
                    ]
                    : [
                        {
                        id: Math.random().toString(),
                        name: typeof tag === 'string' ? tag : tag.tag,
                        slug: (typeof tag === 'string' ? tag : tag.tag).toLowerCase().replace(/\s+/g, '-'),
                        },
                    ]
            );
            return { previousTags };
        },

        onError: (_err, _tag, context) => {
            // Rollback on error
            utils.tags.getTags.setData(undefined, context?.previousTags);
        },

        onSettled: () => {
            // Refetch from server after mutation
            utils.tags.getTags.invalidate();
        },
    });

    // useEffect(()=>{
    //     if(data && !isPending) {
    //         console.log("Tag added successfully:", data);
    //         // setClicked(false); 
    //         reset({tag: ''}); // Reset form after successful mutation
    //         setClicked(false); // Reset clicked state after successful mutation
    //         router.replace(window.location.pathname);// Reset clicked state after successful mutation
    //     }
    // },[router,data,isPending,reset]);

    return (
        <>
            {
                clicked && (
                    <form onSubmit={handleSubmit((data) => {mutate({tag: data.tag})})}>
                        <input type="text" {...register('tag',{required:true})} id='tag' placeholder='enter tag here' />
                        {errors.tag && <p role="alert">Tag is required</p>}
                        <button type="submit">submit</button>
                    </form>
                )
            }
            <button onClick={() => setClicked(true)} disabled={isPending}>Add Tags</button>
        </>
    )
}

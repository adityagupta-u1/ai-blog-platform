'use client';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
    category: string;
};

export default function AddCategoryButton() {
    const [clicked, setClicked] = useState<boolean>(false);
    const {handleSubmit,register,formState:{errors}} = useForm<FormData>()
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const queryOptions = trpc.categories.getCategories.queryOptions();
    const {mutate, isPending} = useMutation(trpc.categories.addCategory.mutationOptions({
        onMutate: async (newCategory) => {
            // Cancel ongoing fetches
            console.log(queryClient.getQueryCache().getAll().map(q => q.queryKey));

            await queryClient.cancelQueries({ queryKey: queryOptions.queryKey });

            // Snapshot previous categories
            const previousTags = queryClient.getQueryData<{id: string; name: string; slug: string; }[]>(queryOptions.queryKey);

            // Optimistically update the cache
            queryClient.setQueryData(queryOptions.queryKey, (old: {id: string; name: string; slug: string;}[] | undefined) =>
                old
                    ? [
                        ...old,
                        {
                        id: Math.random().toString(),
                        name: newCategory.category,
                        slug: newCategory.category.toLowerCase().replace(/\s+/g, '-'),
                        },
                    ]
                    : [
                        {
                        id: Math.random().toString(),
                        name:newCategory.category,
                        slug: (newCategory.category).toLowerCase().replace(/\s+/g, '-'),
                        },
                    ]
            );
            console.log(queryClient.getQueryCache().getAll().map(q => q.queryKey));
            return { previousTags };
        },

        onError: (_err, _tag, context) => {
            // Rollback on error
            queryClient.setQueryData(queryOptions.queryKey, context?.previousTags);
        },

        onSettled: () => {
            // Refetch from server after mutation
            queryClient.invalidateQueries({ queryKey: queryOptions.queryKey});
        },
    }));



  return (
    <>
        {
            clicked && (
                <form onSubmit={handleSubmit((data) => {mutate({category: data.category})})}>
                    <input type="text" {...register('category',{required:true})} id='category' placeholder='enter category here' />
                    {errors.category && <p role="alert">Category is required</p>}
                    <button type="submit">submit</button>
                </form>
            )
        }
        <button onClick={() => setClicked(true)} disabled={isPending}>Add Category</button>
    </>
  )
}
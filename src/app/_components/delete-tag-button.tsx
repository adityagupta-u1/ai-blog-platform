'use client';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash } from 'lucide-react';
import React from 'react';

export default function DeleteTagButton({id}:{id:string}) {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const queryOptions = trpc.tags.getTags.queryOptions();
    const { mutate, isPending } = useMutation(
        trpc.tags.deleteTag.mutationOptions({
        onMutate: async (tag) => {
            // Cancel ongoing fetches
            console.log(queryClient.getQueryCache().getAll().map(q => q.queryKey));

            await queryClient.cancelQueries({ queryKey: queryOptions.queryKey });

            // Snapshot previous categories
            const previousTags = queryClient.getQueryData<{id: string; name: string; slug: string; }[]>(queryOptions.queryKey);

            // Optimistically update the cache
            queryClient.setQueryData(queryOptions.queryKey, (old: {id: string; name: string; slug: string;}[] | undefined) =>
            old?.filter((cat) => cat.id !== tag.id)
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
        })
    );

  return (
    <>
    {
        isPending ? <span><Loader /> </span> : <button onClick={() => mutate({id:id})} disabled={isPending}><Trash color='red'/></button>
    }
    </>
  )
}

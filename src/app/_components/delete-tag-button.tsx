'use client';
import { trpc } from '@/trpc/client';
import { Loader, Trash } from 'lucide-react';
import React from 'react';

export default function DeleteTagButton({id}:{id:string}) {
    const utils = trpc.useUtils();
    const { mutate, isPending } = 
        trpc.tags.deleteTag.useMutation({
        onMutate: async (tag) => {
            // Cancel ongoing fetches
            // console.log(queryClient.getQueryCache().getAll().map(q => q.queryKey));

            await utils.tags.getTags.cancel();

            // Snapshot previous categories
            const previousTags = utils.tags.getTags.getData();

            // Optimistically update the cache
            utils.tags.getTags.setData(undefined, (old: {id: string; name: string; slug: string;}[] | undefined) =>
            old?.filter((cat) => cat.id !== tag.id)
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

    return (
        <>
        {
            isPending ? <span><Loader /> </span> : <button onClick={() => mutate({id:id})} disabled={isPending}><Trash color='red'/></button>
        }
        </>
    )
}

'use client';
import { trpc } from '@/trpc/client';
import { useQueryClient } from '@tanstack/react-query';
import { Loader, Trash } from 'lucide-react';
import React from 'react';

export default function DeleteCategoryButton({ id,name,slug }: { id: string, name:string, slug: string }) {
  const queryClient = useQueryClient();
  const utils = trpc.useUtils();

  const { mutate, isPending } = 
    trpc.categories.deleteCategory.useMutation({
      onMutate: async (category) => {
        // Cancel ongoing fetches

        await utils.categories.getCategories.cancel();
        // Snapshot previous categories
        const previousCategories = utils.categories.getCategories.getData();

        // Optimistically update the cache
        utils.categories.getCategories.setData(undefined, (old: {id: string; name: string; slug: string;}[] | undefined) =>
          old?.filter((cat) => cat.id !== category.id)  
        );
        console.log(queryClient.getQueryCache().getAll().map(q => q.queryKey));
        return { previousCategories };
      },

      onError: (_err, _category, context) => {
        // Rollback on error
        utils.categories.getCategories.setData(undefined, context?.previousCategories);
      },

      onSettled: () => {
        // Refetch from server after mutation
        utils.categories.getCategories.invalidate();
      },
    });

  return (
    <>
      {isPending ? (
        <span><Loader className="animate-spin" /></span>
      ) : (
        <button onClick={() => mutate({ id, name, slug })} disabled={isPending}>
          <Trash color="red" />
        </button>
      )}
    </>
  );
}

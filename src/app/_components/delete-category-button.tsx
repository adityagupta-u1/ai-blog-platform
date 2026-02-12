'use client';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Trash } from 'lucide-react';
import React from 'react';

export default function DeleteCategoryButton({ id,name,slug }: { id: string, name:string, slug: string }) {
  const queryClient = useQueryClient();
  
  const trpc = useTRPC();
    const queryOptions = trpc.categories.getCategories.queryOptions();

  const { mutate, isPending } = useMutation(
    trpc.categories.deleteCategory.mutationOptions({
      onMutate: async (category) => {
        // Cancel ongoing fetches
        console.log(queryClient.getQueryCache().getAll().map(q => q.queryKey));

        await queryClient.cancelQueries({ queryKey: queryOptions.queryKey });

        // Snapshot previous categories
        const previousCategories = queryClient.getQueryData<{id: string; name: string; slug: string; }[]>(queryOptions.queryKey);

        // Optimistically update the cache
        queryClient.setQueryData(queryOptions.queryKey, (old: {id: string; name: string; slug: string;}[] | undefined) =>
          old?.filter((cat) => cat.id !== category.id)  
        );
        console.log(queryClient.getQueryCache().getAll().map(q => q.queryKey));
        return { previousCategories };
      },

      onError: (_err, _category, context) => {
        // Rollback on error
        queryClient.setQueryData(queryOptions.queryKey, context?.previousCategories);
      },

      onSettled: () => {
        // Refetch from server after mutation
        queryClient.invalidateQueries({ queryKey: queryOptions.queryKey});
      },
    })
  );

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

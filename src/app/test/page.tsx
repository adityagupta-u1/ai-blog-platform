'use client'

import AddCategoryButton from '@/app/_components/add-category-button';
import AddTagButton from '@/app/_components/add-tag-button';
import DeleteCategoryButton from '@/app/_components/delete-category-button';
import DeleteTagButton from '@/app/_components/delete-tag-button';
import { FilterComponent } from '@/app/_components/filterComponent';
import { Card } from '@/components/ui/card';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import React from 'react';

//TODO CRUD functionality for tags and categories

export default function TagsAndCategoriesTest() {
    const trpc = useTRPC()
    const {data:categories,isPending:isCategoriesPending} = useQuery(trpc.categories.getCategories.queryOptions())
    console.log(trpc.categories.getCategories.queryOptions().queryKey);
    const {data:tags,isPending:isTagsPending} = useQuery(trpc.tags.getTags.queryOptions());
    
    if(isCategoriesPending && isTagsPending){
        return (
            <Loader className='animate-spin' />
        )
    }
  return (  
    <>
      <div>
        <FilterComponent>
        <h1 className="text-2xl font-bold mb-4">Tags and Categories</h1>
        <h2 className="text-lg mb-4">Tags</h2>
        <AddTagButton />
          {
            tags && tags.map((tag) => (
                <div key={tag.id} className="mb-4">
                    <Card  className="p-4 mb-4 flex flex-row justify-between items-center">
                        <h3 className="text-lg font-semibold">{tag.name}</h3>
                        <DeleteTagButton id={tag.id} />
                    </Card>
                </div>
            ))
          }
        <h2 className="text-lg mb-4" >Categories</h2>
        <AddCategoryButton />
          {
            categories && categories.map((category) => (
                <div key={category.id} className="mb-4">
                    <Card  className="p-4 mb-4 flex flex-row justify-between items-center">
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        <DeleteCategoryButton id={category.id} />
                    </Card>
                </div>
            ))
          }
        </FilterComponent>
      </div>
    </>
  )
}


import DeleteTagButton from '@/app/_components/delete-tag-button';
import { FilterComponent } from '@/app/_components/filterComponent';
import { Card } from '@/components/ui/card';
import { api } from '@/trpc/server';
import React from 'react';


export default async function TagsAndCategories() {
  const users = await api.users.getAllUsers() as unknown as {id:string,name:string}[] | undefined;
    
  return (  
    <>
      <div>
        <FilterComponent>
        <h1 className="text-2xl font-bold mb-4">Users</h1>
          {
            users && users.map((user) => (
                <div key={user.id} className="mb-4">
                    <Card  className="p-4 mb-4 flex flex-row justify-between items-center">
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <DeleteTagButton id={user.id} />
                    </Card>
                </div>
            ))
          }
        </FilterComponent>
      </div>
    </>
  )
}

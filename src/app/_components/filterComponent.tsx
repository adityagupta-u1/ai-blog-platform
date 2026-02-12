'use client';

import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';

export function FilterComponent({children}: {children?: React.ReactNode}) {

    const [filter, setFilter] = React.useState<boolean>(false);
    const router = useRouter();
    const trpc = useTRPC();
    const {mutate,data,isPending} = useMutation(trpc.filter.filterPost.mutationOptions())

    const handleClick = () => {
        // This is where you would handle the filter logic
        console.log("Filter button clicked");
        setFilter(!filter);
    }
    useEffect(() => {
        // This effect runs when the filter state changes
        // You can add logic here to update the URL or perform other actions
        // console.log("Filter state changed:", filter);
        // // For example, you could update the URL with query parameters
        // if (filter) {
        //     router.push(`${window.location.pathname}?filter=true`);
        // } else {
        //     router.push(window.location.pathname);
        // }
        // Optionally, you can replace the current history entry instead of pushing a new one
        //
       router.replace(window.location.pathname)
    }, [filter,router]);

    useEffect(() => {
       if(data && !isPending){
         router.replace(window.location.pathname)
       }
    },[data,isPending,router])
    const {register,handleSubmit, formState:{errors}} = useForm<{ from_date: string; to_date: string; status: string }>();
    const onSubmit = (data: {from_date:string;to_date:string;status:string}) => {
         mutate(data);
    };

  return (
    <>
      <Button variant="ghost" className="mt-4" onClick={handleClick}>
        filter
      </Button>
      
      { filter === true && (
        <div className="mt-2 p-4 bg-gray-100 rounded-lg">
          {/* Filter options can be added here */}
          <form action="" onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-start md:items-center gap-2">
            <label htmlFor="date">From Date</label>
            <input type="date" {...register("from_date",{ required: true })} id="date" />
            {errors.from_date?.type === "required" && (
                <p role="alert">date is required</p>
            )}
            <label htmlFor="date">To Date</label>
            <input type="date" {...register("to_date",{ required: true })} id="date" />
            {errors.to_date?.type === "required" && (
                <p role="alert">date is required</p>
            )}
            <label htmlFor="status" className="ml-4">Status</label>
            <select id="status" defaultValue="all" className="ml-2" {...register("status",{ required: true })}>
              <option value="all">All</option>
              <option value="publish">Published</option>
              <option value="draft">Draft</option>
            </select>
            <Button type="submit" className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Apply
            </Button>
          </form>
          {
            isPending && <p className="text-blue-500 mt-2">Loading...</p>
          }
          {
          data && !isPending && data.map((post: {id:string,title:string,status:string | null,content:string,userId:string,slug:string}) => (
              <div key={post.id} className="mt-4 p-2 bg-white rounded shadow">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">Status: {post.status}</p>
              </div>
            ))
          }
        </div>
      )}
      {data || isPending ? null : children}
    </> 
  )
}

'use client';

import { trpc } from '@/trpc/client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
    category: string;
};

export default function AddCategoryButton() {
    const [clicked, setClicked] = useState(false);
    const utils = trpc.useUtils();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>();

    const { mutate, isPending } =
        trpc.categories.addCategory.useMutation({
        async onMutate(newCategory) {
            // Cancel outgoing fetches
            await utils.categories.getCategories.cancel();

            // Snapshot previous value
            const previousCategories =
            utils.categories.getCategories.getData();

            // Optimistically update
            utils.categories.getCategories.setData(
            undefined,
            (old) =>
                old
                ? [
                    ...old,
                    {
                        id: Math.random().toString(),
                        name: newCategory.category,
                        slug: newCategory.category
                        .toLowerCase()
                        .replace(/\s+/g, '-'),
                    },
                    ]
                : []
            );

            return { previousCategories };
        },

        onError(_err, _newCategory, context) {
            utils.categories.getCategories.setData(
            undefined,
            context?.previousCategories
            );
        },

        onSettled() {
            utils.categories.getCategories.invalidate();
        },
        });

    return (
        <>
        {clicked && (
            <form
            onSubmit={handleSubmit((data) =>
                mutate({ category: data.category })
            )}
            >
            <input
                type="text"
                {...register('category', { required: true })}
                placeholder="enter category here"
            />
            {errors.category && (
                <p role="alert">Category is required</p>
            )}
            <button type="submit">Submit</button>
            </form>
        )}

        <button
            onClick={() => setClicked(true)}
            disabled={isPending}
        >
            {isPending ? 'Adding...' : 'Add Category'}
        </button>
        </>
    );
}

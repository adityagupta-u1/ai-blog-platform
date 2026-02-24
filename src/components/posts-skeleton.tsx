"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostsSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="mt-3 h-4 w-72" />
        </div>

        {/* Filter Area Skeleton */}
        <div className="mb-6">
            <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
                <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />

                <div className="pt-4 flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                </div>
                </CardContent>
            </Card>
            ))}
        </div>

        </div>
    );
}
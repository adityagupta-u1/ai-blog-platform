"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="flex-1 space-y-6 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-2 h-3 w-32" />
                </CardContent>
            </Card>
            ))}
        </div>

        {/* Recent Activity */}
        <Card>
            <CardHeader>
            <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
            ))}
            </CardContent>
        </Card>

        </div>
    );
}
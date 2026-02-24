'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
// import { api } from "@/trpc/server";
import { ArrowUpRight, BarChart3, Calendar, Eye, FileText, Plus, Settings, Users } from "lucide-react";
import Link from "next/link";

import { trpc } from "@/trpc/client";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Stats Card Component
const StatCard = ({ title, value, icon: Icon, trend }: {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
}) => (
    <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
        </div>
        </CardHeader>
        <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
            <p className="text-xs text-muted-foreground mt-1">
            <span className="text-green-600">+{trend}%</span> from last month
            </p>
        )}
        </CardContent>
    </Card>
);

// ViewChart Component (placeholder - replace with your actual chart)
const ViewChart = () => (
    <Card className="col-span-2">
        <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
        <CardDescription>Your page views over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="h-[300px] w-full bg-gradient-to-b from-primary/5 to-transparent rounded-lg flex items-center justify-center border-2 border-dashed">
            <div className="text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Chart visualization would go here</p>
            </div>
        </div>
        </CardContent>
    </Card>
);

export default function DashboardClient() {
    const [data] = trpc.post.getPosts.useSuspenseQuery();
    const posts = data as unknown as { id: string; title: string; content: string; slug: string }[] | undefined;

    const [badgeTime,setBadgeTime] = useState<string>("");

    useEffect(() => {
        setBadgeTime(
            new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
        }));
    },[setBadgeTime])
    if (!posts) {
        return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
            </div>
        </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
                Welcome back! Here&apos;s an overview of your blog performance.
            </p>
            </div>
            
            {/* Date Badge */}
            <Badge variant="outline" className="w-fit px-3 py-1.5">
            <Calendar className="h-4 w-4 mr-2" />
            {badgeTime}
            </Badge>
        </div>

        <Separator />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
            title="Total Posts" 
            value={posts.length} 
            icon={FileText}
            trend="12"
            />
            <StatCard 
            title="Total Views" 
            value="28.4K" 
            icon={Eye}
            trend="8"
            />
            <StatCard 
            title="Subscribers" 
            value="1.4K" 
            icon={Users}
            trend="23"
            />
            <StatCard 
            title="Engagement" 
            value="4.2%" 
            icon={BarChart3}
            trend="2"
            />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Chart Section */}
            <div className="lg:col-span-2">
            <ViewChart />
            </div>

            {/* Latest Posts Section */}
            <div className="lg:col-span-1">
            <Card className="h-full">
                <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                    <CardTitle>Latest Posts</CardTitle>
                    <CardDescription>Your {posts.length} most recent articles</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/posts">
                        View all
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                    </Button>
                </div>
                </CardHeader>
                <CardContent>
                {posts && posts.length > 0 ? (
                    <div className="space-y-4">
                    {posts.slice(0, 5).map((post, index) => (
                        <div 
                        key={post.id} 
                        className="flex items-start gap-4 group"
                        >
                        <Avatar className="h-9 w-9 border">
                            <AvatarFallback className="bg-primary/10 text-primary">
                            {post.title.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <Link 
                            href={`/dashboard/posts/${post.id}`}
                            className="text-sm font-medium leading-none hover:underline group-hover:text-primary transition-colors"
                            >
                            {post.title}
                            </Link>
                            <div className="flex items-center text-xs text-muted-foreground">
                            <span>Post #{index + 1}</span>
                            <span className="mx-1">•</span>
                            <span>Just now</span>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No posts yet</p>
                    </div>
                )}
                </CardContent>
                {posts && posts.length === 0 && (
                <CardFooter>
                    <Button className="w-full" asChild>
                    <Link href="/dashboard/createPost">
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first post
                    </Link>
                    </Button>
                </CardFooter>
                )}
            </Card>
            </div>
        </div>

        {/* Action Bar */}
        <Card className="mt-6 bg-gradient-to-br from-primary/5 via-primary/5 to-transparent border-primary/20">
            <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                <h3 className="font-semibold">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your content and settings
                </p>
                </div>
                <div className="flex flex-wrap gap-3">
                <Button size="default" className="shadow-lg" asChild>
                    <Link href="/dashboard/createPost">
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                    </Link>
                </Button>
                <Button size="default" variant="outline" className="shadow-sm" asChild>
                    <Link href="/dashboard/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                    </Link>
                </Button>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="default" className="shadow-sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Dashboard Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link href="/dashboard/settings/general" className="flex w-full">
                        General
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/dashboard/settings/appearance" className="flex w-full">
                        Appearance
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/dashboard/settings/notifications" className="flex w-full">
                        Notifications
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link href="/dashboard/settings/advanced" className="flex w-full">
                        Advanced
                        </Link>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </div>
            </CardContent>
        </Card>

        {/* Footer Stats */}
        <div className="text-xs text-muted-foreground text-right mt-4">
            Last updated: {badgeTime}
        </div>
        </div>
    );
}
import { api } from "@/trpc/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BarChart,
  Bell,
  CheckCircle2,
  Copy,
  Edit,
  Eye,
  FileText,
  Filter,
  LineChart,
  LogOut,
  LucideIcon,
  MoreHorizontal,
  Newspaper,
  PieChart,
  Plus,
  Settings2,
  Shield,
  Trash2,
  UserCircle,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";

// shadcn/ui imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Animated Card Component
const AnimatedCardComponent = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description 
}: { 
  title: string; 
  value: string | number; 
  icon: LucideIcon;
  trend?: string;
  description?: string;
}) => (
  <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="h-4 w-4 text-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <div className="flex items-center gap-1 mt-1">
          <Badge variant={trend.startsWith('+') ? 'default' : 'destructive'} className="text-[10px] px-1.5">
            {trend}
          </Badge>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      )}
    </CardContent>
  </Card>
);

// ViewChart Component
const ViewChart = () => (
  <Card className="col-span-2">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>Your page views and engagement metrics</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Time Period</DropdownMenuLabel>
            <DropdownMenuItem>Last 7 days</DropdownMenuItem>
            <DropdownMenuItem>Last 30 days</DropdownMenuItem>
            <DropdownMenuItem>Last 3 months</DropdownMenuItem>
            <DropdownMenuItem>Last year</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-[350px] w-full bg-gradient-to-b from-primary/5 via-primary/5 to-transparent rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <LineChart className="h-8 w-8 text-primary/60" />
            </div>
            <div className="p-3 rounded-full bg-blue-500/10">
              <BarChart className="h-8 w-8 text-blue-500/60" />
            </div>
            <div className="p-3 rounded-full bg-green-500/10">
              <PieChart className="h-8 w-8 text-green-500/60" />
            </div>
          </div>
          <p className="text-sm font-medium">Chart visualization would go here</p>
          <p className="text-xs text-muted-foreground max-w-[250px]">
            Connect your analytics provider to see detailed metrics
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            <Activity className="h-4 w-4 mr-2" />
            Configure Analytics
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Post type for the table
interface Post {
  id: string;
  title: string;
  slug?: string;
  published?: boolean;
  views?: number;
  createdAt?: Date | string;
}

// Recent Posts Table
const RecentPostsTable = ({ posts }: { posts: Post[] }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Your latest published content</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/posts">
            View all
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.slice(0, 5).map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">
                <Link href={`/dashboard/posts/${post.id}`} className="hover:underline hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant={post.published ? "default" : "secondary"} className="capitalize">
                  {post.published ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell>{post.views || 0}</TableCell>
              <TableCell className="text-muted-foreground">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/blog/${post.slug}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {posts.length === 0 && (
        <div className="text-center py-8">
          <Newspaper className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm font-medium">No posts yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Create your first post to get started
          </p>
          <Button className="mt-4" size="sm" asChild>
            <Link href="/dashboard/createPost">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Link>
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

// User type for the table
interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  imageUrl?: string;
  createdAt?: Date | string;
}

// Users Table
const UsersTable = ({ users }: { users: User[] }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage your community members</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.slice(0, 5).map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name || 'Anonymous'}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'outline'} className="capitalize">
                  {user.role || 'user'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs">Active</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

// Quick Actions Component
const QuickActions = () => (
  <Card className="bg-gradient-to-br from-primary/5 via-primary/5 to-transparent border-primary/20">
    <CardHeader>
      <CardTitle className="text-sm">Quick Actions</CardTitle>
      <CardDescription className="text-xs">Common admin tasks</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-2">
      <Button className="w-full justify-start" variant="outline" asChild>
        <Link href="/dashboard/createPost">
          <Plus className="h-4 w-4 mr-2" />
          Create New Post
        </Link>
      </Button>
      <Button className="w-full justify-start" variant="outline" asChild>
        <Link href="/dashboard/categories">
          <FolderTree className="h-4 w-4 mr-2" />
          Manage Categories
        </Link>
      </Button>
      <Button className="w-full justify-start" variant="outline" asChild>
        <Link href="/dashboard/tags">
          <Tag className="h-4 w-4 mr-2" />
          Manage Tags
        </Link>
      </Button>
      <Button className="w-full justify-start" variant="outline" asChild>
        <Link href="/dashboard/settings">
          <Settings2 className="h-4 w-4 mr-2" />
          Site Settings
        </Link>
      </Button>
    </CardContent>
  </Card>
);

// Server Status Component
const ServerStatus = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm">System Status</CardTitle>
      <CardDescription className="text-xs">Server health metrics</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">CPU Usage</span>
          <span className="font-medium">45%</span>
        </div>
        <Progress value={45} className="h-1.5" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Memory Usage</span>
          <span className="font-medium">62%</span>
        </div>
        <Progress value={62} className="h-1.5" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Disk Usage</span>
          <span className="font-medium">28%</span>
        </div>
        <Progress value={28} className="h-1.5" />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Database</span>
        <Badge variant="outline" className="text-[10px] gap-1">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          Connected
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">API</span>
        <Badge variant="outline" className="text-[10px] gap-1">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          Operational
        </Badge>
      </div>
    </CardContent>
  </Card>
);

// Clerk user type for the header
interface ClerkUser {
  firstName?: string | null;
  imageUrl?: string;
}

// Admin Header Component
const AdminHeader = ({ user }: { user: ClerkUser }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.firstName || 'Admin'}. Here&apos;s your platform overview.
          </p>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
        <Shield className="h-3.5 w-3.5" />
        Admin Access
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuItem>No new notifications</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>{user?.firstName?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">{user?.firstName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <UserCircle className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings2 className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);

export default async function Admin() {
  const allPosts = await api.post.getPosts();
  const allUsers = await api.users.getAllUsers() as unknown as { id: string; name?: string; email?: string; role?: string; imageUrl?: string; createdAt?: Date }[];
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <CardTitle>Authentication Required</CardTitle>
                <CardDescription>You need to be logged in to view this page.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // const admin = await isAdmin(clerkUser.id);
  
  // if (!admin) {
  //   return (
  //     <div className="min-h-[60vh] flex items-center justify-center">
  //       <Card className="max-w-md w-full">
  //         <CardHeader>
  //           <div className="flex items-center gap-3">
  //             <div className="p-2 rounded-full bg-destructive/10">
  //               <XCircle className="h-5 w-5 text-destructive" />
  //             </div>
  //             <div>
  //               <CardTitle>Access Denied</CardTitle>
  //               <CardDescription>You do not have permission to view this page.</CardDescription>
  //             </div>
  //           </div>
  //         </CardHeader>
  //         <CardFooter>
  //           <Button asChild variant="outline" className="w-full">
  //             <Link href="/dashboard">Return to Dashboard</Link>
  //           </Button>
  //         </CardFooter>
  //       </Card>
  //     </div>
  //   );
  // }

  if (!allPosts) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Admin Header */}
      <AdminHeader user={clerkUser} />

      <Separator />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedCardComponent 
          title="Total Posts" 
          value={allPosts.length} 
          icon={FileText}
          trend="+12%"
          description="Published and draft posts"
        />
        <AnimatedCardComponent 
          title="Total Views" 
          value="28.4K" 
          icon={Eye}
          trend="+8%"
          description="Last 30 days"
        />
        <AnimatedCardComponent 
          title="Subscribers" 
          value="1.4K" 
          icon={Users}
          trend="+23%"
          description="Active subscribers"
        />
        <AnimatedCardComponent 
          title="Total Users" 
          value={allUsers.length} 
          icon={UserCircle}
          trend="+5%"
          description="Registered accounts"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Analytics and Posts Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Chart - spans 2 columns */}
            <div className="lg:col-span-2">
              <ViewChart />
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-1 space-y-6">
              <QuickActions />
              <ServerStatus />
            </div>
          </div>

          {/* Recent Posts Table */}
          <RecentPostsTable posts={allPosts} />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <RecentPostsTable posts={allPosts} />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UsersTable users={allUsers} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>Comprehensive platform metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <BarChart className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                <p className="text-sm font-medium">Analytics dashboard coming soon</p>
                <p className="text-xs text-muted-foreground max-w-md">
                  We&apos;re building a comprehensive analytics suite to help you understand your audience better.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Admin Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
        <div className="flex items-center gap-4">
          <span>© {new Date().getFullYear()} Your Platform</span>
          <span>•</span>
          <span>Admin Dashboard v1.0</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings" className="hover:text-foreground transition-colors">
            Settings
          </Link>
          <Link href="/docs/admin" className="hover:text-foreground transition-colors">
            Documentation
          </Link>
          <Link href="/support" className="hover:text-foreground transition-colors">
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}

// Import missing icons
import {
  FolderTree,
  Tag
} from 'lucide-react';


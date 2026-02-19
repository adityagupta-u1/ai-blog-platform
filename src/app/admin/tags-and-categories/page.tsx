'use client'

import AddCategoryButton from '@/app/_components/add-category-button';
import AddTagButton from '@/app/_components/add-tag-button';
import DeleteCategoryButton from '@/app/_components/delete-category-button';
import DeleteTagButton from '@/app/_components/delete-tag-button';
import { trpc } from '@/trpc/client';
import React, { useState } from 'react';

// shadcn/ui imports
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  Clock,
  Edit,
  FileText,
  Filter,
  FolderTree,
  Grid3x3,
  Layers,
  List,
  LucideIcon,
  RefreshCw,
  Search,
  SortAsc,
  SortDesc,
  Sparkles,
  Tag,
  Tags as TagsIcon,
  TrendingUp,
} from 'lucide-react';

// Stats Card Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend 
}: { 
  title: string; 
  value: number | string; 
  icon: LucideIcon;
  description?: string;
  trend?: string;
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
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <Badge variant={trend.startsWith('+') ? 'default' : 'destructive'} className="text-[10px] px-1.5">
            {trend}
          </Badge>
          <span className="text-[10px] text-muted-foreground">vs last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Tag type
interface TagType {
  id: string;
  name: string;
}

// Tag Card Component
const TagCard = ({ tag }: { tag: TagType }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 flex-1">
              <div className={`
                p-2 rounded-lg transition-all duration-300
                ${isHovered ? 'bg-primary/20 scale-110' : 'bg-primary/10'}
              `}>
                <Tag className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base">{tag.name}</h3>
                  <Badge variant="outline" className="text-[10px] px-1.5">
                    ID: {tag.id.slice(0, 8)}...
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>24 posts</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Created {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
              <DeleteTagButton id={tag.id} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Category type
interface CategoryType {
  id: string;
  name: string;
  slug: string;
}

// Category Card Component
const CategoryCard = ({ category }: { category: CategoryType }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 flex-1">
              <div className={`
                p-2 rounded-lg transition-all duration-300
                ${isHovered ? 'bg-primary/20 scale-110' : 'bg-primary/10'}
              `}>
                <FolderTree className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base">{category.name}</h3>
                  <Badge variant="secondary" className="text-[10px] px-1.5">
                    {category.slug}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5">
                    ID: {category.id.slice(0, 8)}...
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>42 posts</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Created {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
              <DeleteCategoryButton id={category.id} name={category.name} slug={category.slug} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ 
  type, 
}: { 
  type: 'tags' | 'categories'; 
}) => (
  <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/10">
    <CardContent className="flex flex-col items-center justify-center py-12">
      <div className="p-4 rounded-full bg-primary/10 mb-4">
        {type === 'tags' ? (
          <TagsIcon className="h-8 w-8 text-primary" />
        ) : (
          <Layers className="h-8 w-8 text-primary" />
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2">
        No {type} yet
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        {type === 'tags' 
          ? "Tags help organize your content and make it easier for readers to find related posts."
          : "Categories group your content into broad topics, making navigation intuitive for your audience."}
      </p>
      {type === 'tags' ? <AddTagButton /> : <AddCategoryButton />}
    </CardContent>
  </Card>
);


// Search and Filter Bar
const SearchFilterBar = ({ 
  onSearch, 
  onSort,
  onViewModeChange 
}: { 
  onSearch: (query: string) => void;
  onSort: (order: 'asc' | 'desc') => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}) => (
  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search tags and categories..."
        onChange={(e) => onSearch(e.target.value)}
        className="pl-9"
      />
    </div>
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onSort('asc')}>
            <SortAsc className="h-4 w-4 mr-2" />
            Name (A-Z)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('desc')}>
            <SortDesc className="h-4 w-4 mr-2" />
            Name (Z-A)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onViewModeChange('grid')}>
            <Grid3x3 className="h-4 w-4 mr-2" />
            Grid View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewModeChange('list')}>
            <List className="h-4 w-4 mr-2" />
            List View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  </div>
);

export default function TagsAndCategories() {

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [, setActiveTab] = useState('all');
  
  const { data: categories, isPending: isCategoriesPending } = 
    trpc.categories.getCategories.useQuery()
  
  const { data: tags, isPending: isTagsPending } = 
    trpc.tags.getTags.useQuery()

  // Filter and sort data
  const filterData = <T extends { name: string }>(items: T[]): T[] => {
    if (!items) return [];
    
    let filtered = items;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered = filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };

  const filteredTags = filterData(tags ?? []);
  const filteredCategories = filterData(categories ?? []);

  if (isCategoriesPending && isTagsPending) {
    return (
      <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" />
                <TagsIcon className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Loading Tags & Categories</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Please wait while we fetch your content organization data...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Content Organization</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your tags and categories to structure your content
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {tags?.length || 0} Tags • {categories?.length || 0} Categories
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Tags" 
            value={tags?.length || 0} 
            icon={Tag}
            description="Active tags"
            trend="+12%"
          />
          <StatCard 
            title="Total Categories" 
            value={categories?.length || 0} 
            icon={FolderTree}
            description="Active categories"
            trend="+5%"
          />
          <StatCard 
            title="Posts Tagged" 
            value="156" 
            icon={FileText}
            description="Across all tags"
          />
          <StatCard 
            title="Usage Rate" 
            value="94%" 
            icon={TrendingUp}
            description="Tags in use"
          />
        </div>

        {/* Search and Filter Bar */}
        <SearchFilterBar 
          onSearch={setSearchQuery}
          onSort={setSortOrder}
          // viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="tags">Tags Only</TabsTrigger>
            <TabsTrigger value="categories">Categories Only</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {/* Tags Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">Tags</h2>
                  <Badge variant="outline" className="ml-2">
                    {filteredTags.length} total
                  </Badge>
                </div>
                <AddTagButton />
              </div>

              <Separator />

              {filteredTags.length === 0 ? (
                <EmptyState type="tags" />
              ) : (
                <div className={`
                  grid gap-4
                  ${viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                  }
                `}>
                  {filteredTags.map((tag) => (
                    <TagCard key={tag.id} tag={tag} />
                  ))}
                </div>
              )}
            </section>

            {/* Categories Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <FolderTree className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">Categories</h2>
                  <Badge variant="outline" className="ml-2">
                    {filteredCategories.length} total
                  </Badge>
                </div>
                <AddCategoryButton />
              </div>

              <Separator />

              {filteredCategories.length === 0 ? (
                <EmptyState type="categories" />
              ) : (
                <div className={`
                  grid gap-4
                  ${viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                  }
                `}>
                  {filteredCategories.map((category) => (
                    <CategoryCard 
                      key={category.id} 
                      category={category} 
                    />
                  ))}
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="tags" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Tag className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">All Tags</h2>
                <Badge variant="outline" className="ml-2">
                  {filteredTags.length} total
                </Badge>
              </div>
              <AddTagButton />
            </div>
            
            <Separator />
            
            {filteredTags.length === 0 ? (
              <EmptyState type="tags" />
            ) : (
              <div className={`
                grid gap-4
                ${viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
                }
              `}>
                {filteredTags.map((tag) => (
                  <TagCard key={tag.id} tag={tag} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <FolderTree className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">All Categories</h2>
                <Badge variant="outline" className="ml-2">
                  {filteredCategories.length} total
                </Badge>
              </div>
              <AddCategoryButton />
            </div>
            
            <Separator />
            
            {filteredCategories.length === 0 ? (
              <EmptyState type="categories" />
            ) : (
              <div className={`
                grid gap-4
                ${viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
                }
              `}>
                {filteredCategories.map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category} 
                    // onDelete={() => {}} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Pro Tips for Organization</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Use descriptive tags that reflect your content themes</li>
                  <li>Create categories for broad topics and tags for specific details</li>
                  <li>Review and merge similar tags to maintain consistency</li>
                  <li>Categories can have hierarchy - use them to structure your blog</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

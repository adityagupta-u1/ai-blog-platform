'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { format } from 'date-fns';
import { AlertCircle, CalendarIcon, CheckCircle2, Filter, Info, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FilterFormData = {
  from_date: Date | undefined;
  to_date: Date | undefined;
  status: string;
};

export function FilterComponent({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { mutate, data, isPending } = trpc.filter.filterPost.useMutation({
    onSuccess: (data) => {
      if (data.length === 0) {
        toast.info('No posts found', {
          description: 'No posts match your filter criteria.',
          icon: <Info className="h-4 w-4" />,
          duration: 4000,
        });
      } else {
        toast.success('Filters applied successfully', {
          description: `Found ${data.length} post${data.length === 1 ? '' : 's'} matching your criteria.`,
          icon: <CheckCircle2 className="h-4 w-4" />,
          duration: 3000,
        });
      }
    },
    onError: (error) => {
      toast.error('Failed to apply filters', {
        description: error.message || 'Something went wrong. Please try again.',
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 5000,
      });
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FilterFormData>({
    defaultValues: {
      from_date: undefined,
      to_date: undefined,
      status: 'all',
    },
  });

  const fromDate = watch('from_date');
  const toDate = watch('to_date');
  const status = watch('status');

  const hasActiveFilters = fromDate || toDate || status !== 'all';

  const onSubmit = (data: FilterFormData) => {
    // Validate date range
    if (data.from_date && data.to_date && data.from_date > data.to_date) {
      toast.error('Invalid date range', {
        description: 'From date cannot be later than to date.',
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 4000,
      });
      return;
    }

    toast.loading('Applying filters...', {
      id: 'filter-loading',
      duration: Infinity,
    });

    mutate({
      from_date: data.from_date?.toISOString() || '',
      to_date: data.to_date?.toISOString() || '',
      status: data.status,
    });
  };

  const clearFilters = () => {
    reset({
      from_date: undefined,
      to_date: undefined,
      status: 'all',
    });
    
    toast.success('Filters cleared', {
      description: 'All filter criteria have been reset.',
      icon: <CheckCircle2 className="h-4 w-4" />,
      duration: 2000,
    });
    
    router.refresh();
    setIsOpen(false);
  };

  const formatDateForDisplay = (date: Date | undefined) => {
    return date ? format(date, 'PPP') : '';
  };

  // Dismiss loading toast when mutation completes
  useEffect(() => {
    if (!isPending) {
      toast.dismiss('filter-loading');
    }
  }, [isPending]);

  return (
    <div className="space-y-6">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={isOpen ? "default" : "outline"}
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen) {
                toast.info('Filter panel opened', {
                  description: 'Select your filter criteria below.',
                  duration: 2000,
                });
              }
            }}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                Active
              </Badge>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 text-muted-foreground"
            >
              <X className="h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && !isOpen && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {fromDate && (
              <Badge variant="outline">
                From: {formatDateForDisplay(fromDate)}
              </Badge>
            )}
            {toDate && (
              <Badge variant="outline">
                To: {formatDateForDisplay(toDate)}
              </Badge>
            )}
            {status !== 'all' && (
              <Badge variant="outline">
                Status: {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <Card className="border-2 animate-in slide-in-from-top-5 duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filter Posts</CardTitle>
            <CardDescription>
              Filter your posts by date range and status
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Date */}
                <div className="space-y-2">
                  <Label htmlFor="from_date">From Date</Label>
                  <Controller
                    name="from_date"
                    control={control}
                    rules={{ required: "From date is required" }}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date: Date) =>
                              toDate ? date > toDate : false
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.from_date && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.from_date.message}
                    </p>
                  )}
                </div>

                {/* To Date */}
                <div className="space-y-2">
                  <Label htmlFor="to_date">To Date</Label>
                  <Controller
                    name="to_date"
                    control={control}
                    rules={{ required: "To date is required" }}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date: Date) => 
                              fromDate ? date < fromDate : false
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.to_date && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.to_date.message}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Status is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Posts</SelectItem>
                          <SelectItem value="publish">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    toast.info('Filter panel closed', {
                      duration: 1500,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Apply Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isPending && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Applying filters...</p>
          </div>
        </div>
      )}

      {/* Filtered Results */}
      {data && !isPending && (
        <div className="space-y-4 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Filtered Results ({data.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Clear filters
            </Button>
          </div>

          {data.length > 0 ? (
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="p-4 space-y-4">
                {data.map((post: { id: string; title: string; status: string | null; content: string; userId: string; slug: string }) => (
                  <Card 
                    key={post.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      toast.info('Viewing post', {
                        description: `Navigating to "${post.title}"`,
                        duration: 2000,
                      });
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">
                          {post.title}
                        </CardTitle>
                        <Badge
                          variant={post.status === 'publish' ? 'default' : 'secondary'}
                        >
                          {post.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <Card className="bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center">
                  No posts found matching your filters.
                </p>
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Original Children */}
      {!data && !isPending && children}
    </div>
  );
}
// components/ui/card.tsx
import React from "react";
import { cn } from "../../../lib/utils"; // utility for combining classNames (optional)

export const CardDashboard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("bg-white  border rounded-lg", className)}
    {...props}
  />
));
CardDashboard.displayName = "CardDashboard";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

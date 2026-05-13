import React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50",

        // variants
        variant === "default" &&
          "bg-slate-900 text-white hover:bg-slate-800",

        variant === "outline" &&
          "border border-slate-300 bg-white hover:bg-slate-100",

        variant === "ghost" &&
          "hover:bg-slate-100",

        // sizes
        size === "sm" && "h-8 px-3 text-sm",

        size === "md" && "h-10 px-4 text-sm",

        size === "lg" && "h-12 px-6 text-base",

        className
      )}
      {...props}
    />
  );
}
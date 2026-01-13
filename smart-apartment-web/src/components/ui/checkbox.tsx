"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & {
        checked?: boolean;
        onCheckedChange?: (checked: boolean) => void;
    }
>(({ className, checked, onCheckedChange, ...props }, ref) => (
    // We use a simple button/input hybrid for simplicity if radix is missing or just custom implementation
    // Actually, let's use a standard input type="checkbox" but styled
    // Or simpler, if we want to match the design system, we can just use a stylized div wrapper around a hidden checkbox
    // But for now, let's look at the implementation plan.

    // Wait, I will use a simple implementation that mimics shadcn but without radix dependency if possible to avoid install errors
    // But wait, if I use standard input, I can just style it with tailwind.

    <div className="relative flex items-center">
        <input
            type="checkbox"
            className={cn(
                "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground accent-blue-500",
                className
            )}
            ref={ref}
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            {...props}
        />
    </div>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }

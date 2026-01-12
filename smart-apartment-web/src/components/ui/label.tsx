"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Radix Label does not strictly require cva but it's common practice. 
// I'll skip cva installation if I can, but standard shadcn uses it.
// I'll implement a simple label without cva to save an install if class-variance-authority isn't there.
// User didn't install cva. So I'll do basic Implementation.

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white",
            className
        )}
        {...props}
    />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

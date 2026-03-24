import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/30",
        outline: "border border-border bg-transparent hover:bg-muted/50 hover:text-foreground hover:border-muted-foreground/30 active:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:-translate-y-0.5 active:translate-y-0",
        ghost: "hover:bg-muted/70 text-muted-foreground hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "font-display text-lg tracking-wide bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.03] hover:shadow-2xl hover:shadow-foreground/20 transition-all duration-500 active:scale-100",
        glow: "bg-gradient-to-r from-primary via-amber-500 to-primary text-white font-semibold hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-100 bg-[length:200%_100%] hover:bg-right transition-all duration-500",
        wallet: "border border-primary/40 bg-primary/10 text-foreground hover:bg-primary/20 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 font-mono transition-all duration-300",
        success: "bg-success text-white hover:bg-success/90 shadow-lg shadow-success/30 hover:shadow-success/50 hover:-translate-y-0.5 active:translate-y-0",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-lg shadow-warning/30 hover:shadow-warning/50 hover:-translate-y-0.5 active:translate-y-0",
        info: "bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-12 text-lg",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

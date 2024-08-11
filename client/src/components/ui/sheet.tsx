"use client";

import * as React from "react";
import * as MenuPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Menu = MenuPrimitive.Root;

const MenuTrigger = MenuPrimitive.Trigger;

const MenuClose = MenuPrimitive.Close;

const MenuPortal = MenuPrimitive.Portal;

const MenuOverlay = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
MenuOverlay.displayName = MenuPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        slideDown:
          "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        CanvasLeft:
          "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        CanvasRight:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
        basic:
          "inset-y-0 right-0 h-full w-full  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "basic",
    },
  }
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const MenuContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Content>,
  SheetContentProps
>(({ side = "CanvasRight", className, children, ...props }, ref) => (
  <MenuPortal>
    <MenuOverlay />
    <MenuPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <MenuPrimitive.Close className="absolute right-4 top-[1.6rem] opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </MenuPrimitive.Close>
    </MenuPrimitive.Content>
  </MenuPortal>
));
MenuContent.displayName = MenuPrimitive.Content.displayName;

export { Menu, MenuPortal, MenuOverlay, MenuTrigger, MenuClose, MenuContent };
  
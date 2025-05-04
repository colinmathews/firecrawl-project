import { cva } from "class-variance-authority";
import { CommonVariantProps } from "./types";

const variants = cva(
  [
    "absolute right-4 top-4 rounded-xs opacity-70",
    "ring-offset-background transition-opacity hover:opacity-100",
    "focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
    "disabled:pointer-events-none data-[state=open]:bg-accent",
    "data-[state=open]:text-muted-foreground",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [""],
        simulation: [""],
        dark: [""],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  } satisfies CommonVariantProps
);

export default variants;

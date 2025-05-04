import {
  cva,
  VariantProps as VariantPropsBase,
} from "class-variance-authority";
import { CommonVariantProps } from "./types";

const variants = cva(
  [
    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg",
    "translate-x-[-50%] translate-y-[-50%] gap-4 border p-6",
    "shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[state=closed]:slide-out-to-top-[48%]",
    "data-[state=open]:slide-in-from-top-[48%]",
    "sm:rounded-lg max-h-svh overflow-auto",
  ].join(" "),
  {
    variants: {
      variant: {
        default: ["bg-white text-gray-700"],
        simulation: ["bg-app-violet-700 text-white border-app-violet-200"],
        dark: ["bg-gray-900 text-white border-gray-700"],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  } satisfies CommonVariantProps
);

export default variants;

export type VariantProps = VariantPropsBase<typeof variants>;

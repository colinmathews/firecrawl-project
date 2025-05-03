import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind classname merging utility. Combines tailwind-merge and clsx.
 *
 * See tailwind-merge and clsx docs:
 *   https://github.com/dcastil/tailwind-merge
 *   https://github.com/lukeed/clsx
 *
 * */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

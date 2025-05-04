import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 cursor-pointer",
    "focus-visible:underline focus-visible:decoration-dotted focus-visible:underline-offset-2 focus-visible:decoration-2",
    "focus-visible:outline-1 focus-visible:outline-app-yellow",
    "focus-visible:outline-offset-2",
    "transition-colors duration-300",
    "whitespace-nowrap rounded-md text-sm font-semibold",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4! [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-app-yellow text-app-violet shadow-sm border border-app-yellow",
          "hover:bg-app-yellow/90 hover:border-app-violet",
          "active:ring-2 active:ring-app-yellow",
        ],
        outline: [
          "border border-app-yellow text-app-yellow shadow-xs hover:bg-app-yellow hover:text-app-violet",
          "active:ring-2 active:ring-app-yellow",
        ],
        plain: [
          "bg-gray-100 text-gray-700 hover:bg-gray-200",
          "active:ring-2 active:ring-app-yellow",
        ],
        minimal: [
          "bg-transparent text-white hover:bg-app-violet-200/80",
          "active:ring-2 active:ring-app-yellow",
        ],
        link: ["text-app-pink-400 hover:text-app-pink-500 hover:underline"],
        "yellow-link": ["text-app-yellow hover:underline"],
        destructive: [
          "bg-red-500 text-white shadow-sm hover:bg-red-700",
          "active:ring-2 active:ring-red-400",
        ],
      },
      size: {
        sm: "h-8 rounded-md px-3 text-sm",
        default: "h-10 px-6 py-2 text-base",
        lg: "h-[49px] sm:h-[61px] rounded-md px-8 text-lg [&_svg]:size-5!",
        icon: "h-9 w-9",
        "md-icon": "h-[51px] w-[51px] [&_svg]:size-5!",
        "lg-icon": "h-[61px] w-[61px] [&_svg]:size-6!",
      },
    },
    compoundVariants: [
      {
        variant: "minimal",
        size: "lg-icon",
        className: "text-[35px] h-auto w-auto [&_svg]:size-[1em]! p-2",
      },
      {
        variant: "minimal",
        size: "lg",
        className: "text-2xl h-auto w-auto [&_svg]:size-[1.5em]! p-2 gap-4",
      },
      {
        variant: "link",
        className: "h-auto p-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

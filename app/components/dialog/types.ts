export type CommonVariants = {
  default: string[];
  simulation: string[];
  dark: string[];
};

export interface CommonVariantProps<V = CommonVariants> {
  variants: {
    variant: V;
  };
  defaultVariants: {
    variant: keyof V;
  };
}

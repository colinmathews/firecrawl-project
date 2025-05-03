import { animated } from "@react-spring/web";

/**
 * We're facing weird typing errors with <animated.div> when it has children.
 * The fix is to give it this weird type.
 */
export const AnimatedDiv = animated.div as React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
  }
>;

export const AnimatedMain = animated.main as React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
  }
>;

export const AnimatedSection = animated.section as React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
  }
>;

export const AnimatedImg = animated.img as React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & {
    ref?: React.Ref<HTMLImageElement>;
  }
>;

export const AnimatedHeader = animated.header as React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
  }
>;

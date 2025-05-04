import { cn } from "@/lib/utils/cn";
import { useSpring, easings } from "react-spring";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatedDiv } from "@/lib/utils/animated";

export type ExpandableProps = {
  expanded: boolean;
  onFullyExpanded?: () => void;
  onFullyCollapsed?: () => void;
};

/**
 * Creates a container that can be expanded and collapsed with a smooth animation.
 */
export const Expandable = forwardRef<
  HTMLDivElement,
  React.InputHTMLAttributes<HTMLDivElement> & ExpandableProps
>(
  (
    { expanded, children, onFullyExpanded, onFullyCollapsed, ...props },
    ref
  ) => {
    const contentRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => contentRef.current as HTMLDivElement);

    const [naturalHeight, setNaturalHeight] = useState(0);
    const [animationState, setAnimationState] = useState<
      "collapsed" | "expanded" | "expanding" | "collapsing"
    >(expanded ? "expanded" : "collapsed");
    const isAnimating = useMemo(
      () => animationState !== "collapsed" && animationState !== "expanded",
      [animationState]
    );

    const animationDuration = useMemo(() => {
      return Math.max(200, naturalHeight * 0.9);
    }, [naturalHeight]);

    useEffect(() => {
      setNaturalHeight((prev) => {
        if (!prev || animationState === "expanded") {
          return contentRef.current?.scrollHeight || 0;
        }
        return prev;
      });
    }, [animationState, contentRef.current?.scrollHeight]);

    const styles = useSpring({
      height: expanded ? naturalHeight : 0,
      config: {
        tension: 250,
        friction: 32,
        easing: easings.easeInCubic,
        duration: animationDuration,
      },
      onStart: () => {
        // Only run an animation if we're not already in the final state
        // This can be important if the scroll height changes while we're already expanded
        if (expanded && animationState !== "expanded") {
          setAnimationState("expanding");
        } else if (!expanded && animationState !== "collapsed") {
          setAnimationState("collapsing");
        }
      },
      onRest: () => {
        setAnimationState(expanded ? "expanded" : "collapsed");
        if (expanded) {
          onFullyExpanded?.();
        } else {
          onFullyCollapsed?.();
        }
      },
    });

    return (
      <AnimatedDiv
        {...props}
        ref={contentRef}
        style={{
          height:
            animationState === "expanded"
              ? "auto"
              : (styles.height as unknown as React.CSSProperties["height"]),
        }}
        className={cn(
          "overflow-hidden",
          !isAnimating && !expanded && "pointer-events-none",
          props.className
        )}
      >
        {children}
      </AnimatedDiv>
    );
  }
);

Expandable.displayName = "Expandable";

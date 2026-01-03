import { useState, useEffect, RefObject, MutableRefObject } from 'react';

interface UseTimelineScrollOptions {
  itemRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  containerRef: RefObject<HTMLDivElement>;
}

export const useTimelineScroll = ({ itemRefs, containerRef }: UseTimelineScrollOptions) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.scrollHeight;
      const viewportHeight = container.clientHeight;

      const scrollableHeight = Math.max(containerHeight - viewportHeight, 1);
      const progress = Math.min(1, Math.max(0, scrollTop / scrollableHeight));
      setScrollProgress(progress);

      let activeIdx = 0;
      let maxVisibility = -1;
      const viewportBottom = scrollTop + viewportHeight;
      const targetPoint = scrollTop + viewportHeight * 0.3;

      itemRefs.current.forEach((expRef, idx) => {
        if (expRef) {
          const elementOffsetTop = expRef.offsetTop;
          const elementHeight = expRef.offsetHeight;
          const elementTop = elementOffsetTop;
          const elementBottom = elementOffsetTop + elementHeight;
          const elementCenter = elementOffsetTop + elementHeight / 2;

          const isInViewport = elementBottom > scrollTop && elementTop < viewportBottom;

          if (isInViewport) {
            const visibleTop = Math.max(elementTop, scrollTop);
            const visibleBottom = Math.min(elementBottom, viewportBottom);
            const visibleHeight = visibleBottom - visibleTop;
            const visibilityRatio = visibleHeight / elementHeight;
            const distanceFromTarget = Math.abs(elementCenter - targetPoint);
            const score = visibilityRatio * 100 - distanceFromTarget * 0.1;

            if (score > maxVisibility) {
              maxVisibility = score;
              activeIdx = idx;
            }
          }
        }
      });

      setActiveIndex(activeIdx);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [itemRefs, containerRef]);

  return { activeIndex, scrollProgress };
};


import { useEffect, useRef, useState, useCallback } from 'react';

interface UseVirtualListOptions<T> {
  items: T[];
  itemHeight: number;
  overscan?: number;
  containerRef: React.RefObject<HTMLElement>;
}

interface VirtualListItem<T> {
  item: T;
  index: number;
  offset: number;
}

interface UseVirtualListReturn<T> {
  virtualItems: VirtualListItem<T>[];
  totalHeight: number;
  scrollToIndex: (index: number) => void;
}

/**
 * Custom hook for virtual scrolling large lists
 * Only renders visible items to improve performance
 */
export function useVirtualList<T>({
  items,
  itemHeight,
  overscan = 5,
  containerRef,
}: UseVirtualListOptions<T>): UseVirtualListReturn<T> {
  const [scrollTop, setScrollTop] = useState(0);
  const rafId = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [containerRef, handleScroll]);

  const containerHeight = containerRef.current?.clientHeight || 600;
  const totalHeight = items.length * itemHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems: VirtualListItem<T>[] = [];
  for (let i = startIndex; i < endIndex; i++) {
    virtualItems.push({
      item: items[i],
      index: i,
      offset: i * itemHeight,
    });
  }

  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth',
      });
    }
  }, [containerRef, itemHeight]);

  return {
    virtualItems,
    totalHeight,
    scrollToIndex,
  };
}

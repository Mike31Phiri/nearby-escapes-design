export function useInfiniteScroll() {
  return { sentinelRef: null as unknown as React.RefObject<HTMLDivElement>, hasMore: false };
}

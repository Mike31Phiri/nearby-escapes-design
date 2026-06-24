export default function Loading() {
  return (
    <div className="min-h-screen bg-[#faf9f5] w-full">
      {/* Skeleton Navbar placeholder */}
      <div className="w-full h-16 bg-white border-b border-[#e0dbd0] flex items-center px-4 md:px-8 justify-between">
        <div className="w-32 h-6 bg-[#e0dbd0] rounded animate-pulse" />
        <div className="hidden md:flex gap-6">
          <div className="w-16 h-4 bg-[#e0dbd0] rounded animate-pulse" />
          <div className="w-16 h-4 bg-[#e0dbd0] rounded animate-pulse" />
          <div className="w-16 h-4 bg-[#e0dbd0] rounded animate-pulse" />
        </div>
        <div className="w-10 h-10 bg-[#e0dbd0] rounded-full animate-pulse" />
      </div>

      {/* Skeleton Hero */}
      <div className="w-full h-[35vh] md:h-[45vh] bg-[#e0dbd0]/50 animate-pulse" />

      {/* Skeleton Content Grid */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="w-48 h-8 bg-[#e0dbd0] rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="w-full aspect-[4/3] bg-[#e0dbd0]/60 rounded-2xl animate-pulse" />
              <div className="w-3/4 h-5 bg-[#e0dbd0] rounded animate-pulse" />
              <div className="w-1/2 h-4 bg-[#e0dbd0] rounded animate-pulse" />
              <div className="w-1/4 h-4 bg-[#e0dbd0] rounded animate-pulse mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

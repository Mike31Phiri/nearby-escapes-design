import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Clock, CircleDollarSign } from "lucide-react";

export default function AttractionDetailPage({ params }: { params: { province: string; city: string; attraction: string } }) {
  const { province, city, attraction } = params;
  const cleanName = attraction.replace(/-/g, " ");

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#111111]">
      {/* Complete Breadcrumb Chain */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 text-xs text-[#6B7280] space-x-1 flex items-center overflow-x-auto whitespace-nowrap">
        <Link href="/explore" className="hover:text-[#1f1433]">Zambia</Link>
        <span>→</span>
        <Link href={`/explore/${province}`} className="capitalize hover:text-[#1f1433]">{province} Province</Link>
        <span>→</span>
        <Link href={`/explore/${province}/${city}`} className="capitalize hover:text-[#1f1433]">{city}</Link>
        <span>→</span>
        <span className="capitalize text-[#1f1433] font-semibold">{cleanName}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">
        {/* Profile Split Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="aspect-[4/3] rounded-2xl bg-gray-300 overflow-hidden relative shadow-sm">
            {/* Visual Media Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1 bg-[#f2ba0d]/10 text-[#1f1433] text-[10px] font-bold px-2.5 py-1 rounded-md border border-[#f2ba0d]/30">
                <Compass className="h-3 w-3 text-[#f2ba0d]" /> Highly Rated Local Gem
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-[#1f1433] capitalize mt-3">
                {cleanName}
              </h1>
              <p className="text-sm text-[#6B7280] mt-4 leading-relaxed">
                Welcome to {cleanName}. This historical site forms one of the absolute best natural pillars of the area. Visited year-round by explorers seeking authentic excursions away from typical crowded tourism circuits.
              </p>
            </div>

            {/* Practical Stats Panel */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-white border border-[#E0DBD0] rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#f2ba0d]" />
                <div>
                  <p className="font-bold">Best Visit Window</p>
                  <p className="text-[#6B7280] text-[11px]">07:00 AM - 18:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-[#f2ba0d]" />
                <div>
                  <p className="font-bold">Access Rates</p>
                  <p className="text-[#6B7280] text-[11px]">Approx ZMW 50 - ZMW 150</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Surrounding Context Section */}
        <section className="space-y-12 border-t border-[#E0DBD0] pt-10">
          {/* Nearby Experiences Segment */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-display font-bold text-[#1f1433]">Experiences Here</h2>
                <p className="text-xs text-[#6B7280]">Activities, guided tours, and events happening around this landmark.</p>
              </div>
              <Link href={`/search?category=experiences&near=${attraction}`} className="text-xs font-semibold text-[#f2ba0d] hover:underline">
                See All Experiences
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border border-[#E0DBD0] rounded-xl p-3 flex flex-col justify-between">
                  <div className="aspect-[4/3] rounded-lg bg-gray-100 mb-2" />
                  <h3 className="text-xs font-bold text-[#1f1433] line-clamp-1">Activity Package {i}</h3>
                  <p className="text-[10px] text-[#6B7280] mt-1">Half-day Guided</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
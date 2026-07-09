import Link from "next/link";
// FIXED: CarProfile swapped with Car from lucide-react
import { ArrowRight, MapPin, Bed, Binoculars, Car } from "lucide-react";

// Mock data structured by province regions
const provinceData: Record<string, { desc: string; cities: string[] }> = {
  northern: {
    desc: "Home to deep structural waterfalls, historic lakeside ports, and untouched wilderness landscapes.",
    cities: ["mbala", "kasama", "mpika", "chinsali"],
  },
  lusaka: {
    desc: "Zambia's central energetic pulse, combining urban boutique life with pristine farm retreats in nearby districts.",
    cities: ["lusaka", "chilanga", "chongwe", "kafue"],
  },
  southern: {
    desc: "The adventure capital territory, flanked by majestic river systems and rich cultural heritage routes.",
    cities: ["livingstone", "monze", "choma", "siavonga"],
  },
};

export default function ProvincePage({ params }: { params: { province: string } }) {
  const province = params.province.toLowerCase();
  const currentRegion = provinceData[province] || {
    desc: "Discover rich cultural landscapes, incredible accommodations, and local experiences.",
    cities: ["general-hub"],
  };

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#111111]">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 text-sm text-[#6B7280] space-x-1">
        <Link href="/explore" className="hover:text-[#1f1433]">
          Zambia
        </Link>
        <span>→</span>
        <span className="capitalize text-[#1f1433] font-semibold">{province} Province</span>
      </div>

      <header className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-[#1f1433] capitalize">
          {province} Province Guide
        </h1>
        <p className="text-[#6B7280] mt-2 max-w-2xl text-base leading-relaxed">
          {currentRegion.desc}
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pb-16 space-y-16">
        {/* Hubs / Cities */}
        <section>
          <h2 className="text-xl font-bold text-[#1f1433] mb-4">Major Districts & Hubs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentRegion.cities.map((city) => (
              <Link
                key={city}
                href={`/explore/${province}/${city}`}
                className="p-4 bg-white border border-[#E0DBD0] rounded-xl hover:border-[#f2ba0d] hover:shadow-sm transition-all group flex justify-between items-center"
              >
                <span className="capitalize font-medium text-base">{city}</span>
                <ArrowRight className="h-4 w-4 text-[#6B7280] group-hover:text-[#1f1433] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* Curated Previews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 border-t border-[#E0DBD0]">
          {/* Column 1: Stays */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xl text-[#1f1433] flex items-center gap-2">
                <Bed className="h-4 w-4 text-[#f2ba0d]" /> Featured Stays
              </h3>
              <Link
                href={`/${province}/stays`}
                className="text-sm font-semibold text-[#f2ba0d] hover:underline"
              >
                See All
              </Link>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-[#E0DBD0] flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1f1433]">Premium Regional Lodge {i}</h4>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">From ZMW 1,800 / night</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Experiences */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xl text-[#1f1433] flex items-center gap-2">
                <Binoculars className="h-4 w-4 text-[#f2ba0d]" /> Key Experiences
              </h3>
              <Link
                href={`/experiences`}
                className="text-sm font-semibold text-[#f2ba0d] hover:underline"
              >
                See All
              </Link>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-[#E0DBD0] flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1f1433]">
                      Curated Wilderness Trek {i}
                    </h4>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">Guided Local Activity</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Transit */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xl text-[#1f1433] flex items-center gap-2">
                {/* FIXED: Uses the clean lucide Car icon component here */}
                <Car className="h-4 w-4 text-[#f2ba0d]" />
                Coach Services
              </h3>
              <Link
                href={`/transport`}
                className="text-sm font-semibold text-[#f2ba0d] hover:underline"
              >
                See All
              </Link>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-[#E0DBD0] flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1f1433]">Regional Transfer Link {i}</h4>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">
                      Available Shuttle & 4x4 Hire
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

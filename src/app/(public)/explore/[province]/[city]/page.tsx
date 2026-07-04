import Link from "next/link";
import { ArrowRight, Star, MapPin } from "lucide-react";

// Localized Mock Gems matched by city key
const cityGemsData: Record<string, { title: string; desc: string; slug: string }[]> = {
  mbala: [
    { title: "Kalambo Falls", desc: "One of Africa's highest single-drop waterfalls, flanking the Tanzanian border.", slug: "kalambo-falls" },
    { title: "Moto Moto Museum", desc: "A deep dive into cultural heritage, Zambian archeology, and traditional crafts.", slug: "moto-moto-museum" },
  ],
  chilanga: [
    { title: "Munda Wanga Eco-Park", desc: "Environmental education facilities accompanied by botanical wildlife sanctuary loops.", slug: "munda-wanga" },
    { title: "Baobab Forest Trails", desc: "Quiet limestone cave structures and hiking options wrapped around massive ancient trees.", slug: "baobab-trails" },
  ],
};

export default function CityPage({ params }: { params: { province: string; city: string } }) {
  const { province, city } = params;
  const localGems = cityGemsData[city.toLowerCase()] || [
    { title: "Scenic Point of Interest", desc: "An authentic local landmark waiting to be discovered.", slug: "generic-gem" },
  ];

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#111111]">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 text-xs text-[#6B7280] space-x-1">
        <Link href="/explore" className="hover:text-[#1f1433]">Zambia</Link>
        <span>→</span>
        <Link href={`/explore/${province}`} className="capitalize hover:text-[#1f1433]">{province} Province</Link>
        <span>→</span>
        <span className="capitalize text-[#1f1433] font-semibold">{city}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16">
        {/* Intro Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1f1433] capitalize">Explore {city}</h1>
          <p className="text-[#6B7280] text-sm mt-1">Discover structural anchors and localized amenities inside this dynamic hub.</p>
        </div>

        {/* Local Gems Component Block */}
        <section>
          <h2 className="text-xl font-display font-bold text-[#1f1433] mb-1">Gems & Attractions Here</h2>
          <p className="text-xs text-[#6B7280] mb-6">Use these landmarks to map out surrounding operational activities.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localGems.map((gem) => (
              <div key={gem.slug} className="bg-white border border-[#E0DBD0] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#f2ba0d] font-bold">Featured Attraction</span>
                  <h3 className="font-display font-bold text-lg mt-1 text-[#1f1433]">{gem.title}</h3>
                  <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">{gem.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#F1EFEA] flex justify-end">
                  <Link
                    href={`/explore/${province}/${city}/${gem.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1f1433] hover:text-[#2A154A]"
                  >
                    <span>View Attraction Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6-Card Services Section layout */}
        <section className="space-y-12 pt-4 border-t border-[#E0DBD0]">
          {/* Stays Container block */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-lg font-display font-bold text-[#1f1433]">Local Stays in {city}</h3>
                <p className="text-xs text-[#6B7280]">Fully vetted boutique retreats, apartments, and lodges nearby.</p>
              </div>
              <Link href={`/search?category=stays&city=${city}`} className="text-xs font-semibold text-[#1f1433] hover:underline shrink-0">
                See All Stays
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="group bg-white rounded-xl overflow-hidden border border-[#E0DBD0] flex flex-col shadow-2xl">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#1f1433] line-clamp-1">Local Hideout Place {i}</h4>
                      <p className="text-[10px] text-[#6B7280] flex items-center gap-0.5 mt-0.5">
                        <MapPin className="h-2.5 w-2.5" /> Close to center
                      </p>
                    </div>
                    <p className="text-[11px] font-bold text-[#1f1433] mt-2">ZMW {850 + i * 100} <span className="text-[9px] font-normal text-[#6B7280]">/night</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
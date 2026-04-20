import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export type Filters = {
  query: string;
  categories: string[];
  locations: string[];
  priceMin: number;
  priceMax: number;
  minRating: number;
};

export const DEFAULT_FILTERS: Filters = {
  query: "",
  categories: [],
  locations: [],
  priceMin: 0,
  priceMax: 500,
  minRating: 0,
};

export function SearchFilters({
  filters,
  setFilters,
  allCategories,
  allLocations,
  onReset,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  allCategories: string[];
  allLocations: string[];
  onReset: () => void;
}) {
  const toggle = (key: "categories" | "locations", value: string) => {
    const set = new Set(filters[key]);
    set.has(value) ? set.delete(value) : set.add(value);
    setFilters({ ...filters, [key]: Array.from(set) });
  };

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs">
          Reset
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Price / night
        </Label>
        <Slider
          min={0}
          max={500}
          step={10}
          value={[filters.priceMin, filters.priceMax]}
          onValueChange={([min, max]) =>
            setFilters({ ...filters, priceMin: min, priceMax: max })
          }
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${filters.priceMin}</span>
          <span>${filters.priceMax}+</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Property type
        </Label>
        <div className="space-y-2">
          {allCategories.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={filters.categories.includes(c)}
                onCheckedChange={() => toggle("categories", c)}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Location
        </Label>
        <div className="space-y-2 max-h-56 overflow-auto pr-1">
          {allLocations.map((loc) => (
            <label key={loc} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={filters.locations.includes(loc)}
                onCheckedChange={() => toggle("locations", loc)}
              />
              {loc}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Minimum rating
        </Label>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFilters({ ...filters, minRating: r })}
              className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${
                filters.minRating === r
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border hover:bg-muted"
              }`}
            >
              {r === 0 ? (
                "Any"
              ) : (
                <>
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  {r}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X, Upload } from "lucide-react";
import { ListingWizardLayout } from "@/components/host/ListingWizardLayout";
import { Button } from "@/components/ui/button";

type Photo = { id: string; url: string; label: string };

export function Step5PhotoTour() {
  const navigate = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newPhotos: Photo[] = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(f),
      label: f.name,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  return (
    <ListingWizardLayout
      eyebrow="Step 5 of 10"
      title="Add photos of your place"
      description="Great photos help guests feel confident. Add at least 5 — the first one becomes your cover photo."
      step={5}
      onNext={() => router.push("/host/new-property/step-6")}
      onBack={() => router.push("/host/new-property/step-4")}
      nextDisabled={photos.length < 1}
      nextLabel={photos.length < 1 ? "Add at least 1 photo" : `Next (${photos.length} photos)`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 p-10 cursor-pointer hover:border-primary/40 hover:bg-primary-soft/10 transition-colors"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <ImagePlus className="h-7 w-7" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-sm">Click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP up to 10 MB each</p>
        </div>
        <Button type="button" variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" /> Browse files
        </Button>
      </div>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo, i) => (
            <div key={photo.id} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border/60">
              <img
                src={photo.url}
                alt={photo.label}
                className="h-full w-full object-cover"
              />
              {i === 0 && (
                <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Add more card */}
          <div
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[4/3] items-center justify-center rounded-xl border-2 border-dashed border-border/40 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      )}
    </ListingWizardLayout>
  );
}

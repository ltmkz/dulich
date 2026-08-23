import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import { CATEGORY_ICONS, CategoryKey } from "@/lib/constants";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

interface NearbyPoint {
  id: string;
  name: string;
  nameEn?: string | null;
  category: string;
  images: string;
  distanceKm: number;
}

interface NearbyPointsProps {
  points: NearbyPoint[];
  lang?: string;
}

export function NearbyPoints({ points, lang = "vi" }: NearbyPointsProps) {
  if (points.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        {lang === "en" ? "Nearby Places" : "Các điểm tham quan lân cận"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {points.map((p) => {
          const imgs = JSON.parse(p.images || "[]") as string[];
          const displayName = lang === "en" && p.nameEn ? p.nameEn : p.name;
          
          return (
            <Link key={p.id} href={`/p/${p.id}${lang === "en" ? "?lang=en" : ""}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow h-full border-slate-200 group">
                <div className="relative h-32 w-full bg-slate-100">
                  {imgs[0] ? (
                    <Image
                      src={imgs[0]}
                      alt={displayName}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {CATEGORY_ICONS[p.category as CategoryKey]}
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                    <Navigation className="h-3 w-3" />
                    {p.distanceKm < 1 
                      ? `${Math.round(p.distanceKm * 1000)}m` 
                      : `${p.distanceKm.toFixed(1)}km`}
                  </div>
                </div>
                <CardContent className="p-3">
                  <h4 className="font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    <span className="mr-1.5">{CATEGORY_ICONS[p.category as CategoryKey]}</span>
                    {displayName}
                  </h4>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

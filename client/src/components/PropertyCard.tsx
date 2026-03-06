import { Card } from "@/components/ui/card";
import { BedDouble, Maximize2, MapPin } from "lucide-react";

interface PropertyCardProps {
  image: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  area: number;
  status: "Pronto" | "Em obras";
}

export default function PropertyCard({
  image,
  title,
  price,
  location,
  bedrooms,
  area,
  status,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0">
      {/* Image Container */}
      <div className="relative h-64 md:h-72 overflow-hidden bg-secondary">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        {/* Status Badge */}
        <div className="absolute top-4 right-4 bg-slate-900 text-white px-3 py-1 rounded text-sm font-medium">
          {status}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Price */}
        <div className="text-2xl font-bold text-primary mb-4">
          R$ {price}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Details */}
        <div className="flex items-center gap-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">{bedrooms} quarto{bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">{area} m²</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

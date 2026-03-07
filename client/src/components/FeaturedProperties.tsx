import { useState, useEffect, useRef } from "react";
import { BedDouble, Maximize2, MapPin, RefreshCw, AlertCircle, Heart, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProperties, type PropertyData, type UsePropertiesOptions } from "@/hooks/useProperties";
import { useFavorites } from "@/hooks/useFavorites";
import { Link, useLocation } from "wouter";

// ─── Skeleton Card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <Card className="overflow-hidden border-0">
      <div className="h-64 md:h-72 bg-secondary animate-pulse" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-secondary animate-pulse rounded w-3/4" />
        <div className="h-7 bg-secondary animate-pulse rounded w-1/2" />
        <div className="h-4 bg-secondary animate-pulse rounded w-2/3" />
        <div className="flex gap-6 pt-4 border-t border-border">
          <div className="h-4 bg-secondary animate-pulse rounded w-20" />
          <div className="h-4 bg-secondary animate-pulse rounded w-20" />
        </div>
      </div>
    </Card>
  );
}

import { motion, AnimatePresence } from "framer-motion";

// ─── Image Cycler ──────────────────────────────────────────────────────────
export function ImageCycler({ images, title, isHovering }: { images: string[], title: string, isHovering: boolean }) {
  const [index, setIndex] = useState(0);
  const topImages = images.slice(0, 6); // Cycle through first 6 images as requested

  useEffect(() => {
    if (topImages.length <= 1 || !isHovering) {
      setIndex(0); // Reset to first image when not hovering
      return;
    }

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % topImages.length);
    }, 8000); // 8 seconds interval

    return () => clearInterval(interval);
  }, [topImages.length, isHovering]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={topImages[index]}
          src={topImages[index] || "https://d2xsxph8kpxj0f.cloudfront.net/310519663366689293/jsiKnDEmDWyHsAZxshzkFX/apartment-interior-AsrdjbkKxpBi7u6wHztwSk.webp"}
          alt={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }} // Even smoother for slower pace
          className="w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-110 contrast-[1.05] brightness-[1.05] saturate-[1.1]"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://d2xsxph8kpxj0f.cloudfront.net/310519663366689293/jsiKnDEmDWyHsAZxshzkFX/apartment-interior-AsrdjbkKxpBi7u6wHztwSk.webp";
          }}
        />
      </AnimatePresence>

      {/* Progress Dots */}
      {topImages.length > 1 && isHovering && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {topImages.map((_, i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${i === index ? 'bg-white w-3' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Property Card ─────────────────────────────────────────────────────────
export function PropertyCard({ property, index, showFavorite = true, showRemove = false, onRemove }: { property: PropertyData, index: number, showFavorite?: boolean, showRemove?: boolean, onRemove?: () => void }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(property.id);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only apply scroll-trigger logic on mobile/tablet
    if (typeof window !== "undefined" && window.innerWidth >= 1024) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // On mobile, we trigger cycling when the card is well-centered
          if (entry.isIntersecting) {
            setIsHovered(true);
          } else {
            setIsHovered(false);
          }
        });
      },
      {
        threshold: 0.4,
        rootMargin: "-10% 0px -10% 0px" // Trigger slightly before it hits absolute center
      }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const statusColor =
    property.status === "Pronto"
      ? "bg-emerald-500 text-white"
      : property.status === "Em obras"
        ? "bg-amber-500 text-white"
        : "bg-[#FBE486] text-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
    >
      <Card
        ref={cardRef}
        className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer border-0 group bg-white shadow-sm hover:shadow-primary/10 relative rounded-3xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => {
          if (window.innerWidth < 1024) setIsHovered(true);
        }}
      >
        {showFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            className={`absolute top-4 left-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all ${favorite ? 'bg-red-500 text-white scale-110' : 'bg-white/90 backdrop-blur-md text-foreground hover:bg-white hover:scale-110 shadow-sm'}`}
          >
            <Heart className={`w-5 h-5 ${favorite ? 'fill-current text-white' : 'text-slate-600'}`} />
          </button>
        )}

        {showRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onRemove) onRemove();
              else toggleFavorite(property.id);
            }}
            className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white/60 backdrop-blur-md text-black flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all font-bold"
            title="Remover dos favoritos"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <Link href={`/imovel/${property.slug}`}>
          <div className="cursor-pointer">
            <div className="relative h-64 md:h-72 overflow-hidden bg-slate-50">
              <ImageCycler images={property.images} title={property.title} isHovering={isHovered} />

              {!isHovered && property.images.length > 1 && (
                <div className="absolute bottom-4 right-4 z-10 bg-black/40 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Passe o mouse
                </div>
              )}

              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.1em] z-10 ${statusColor}`}>
                {property.status}
              </div>

              {/* Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="p-7 bg-white">
              <h3 className="text-2xl font-normal text-slate-900 mb-3 line-clamp-2 min-h-[4rem] leading-tight font-serif italic">
                {property.title}
              </h3>

              <div className="flex flex-col gap-1 text-slate-600 mb-4">
                <div className="flex items-center gap-2 text-[10px] font-medium tracking-wide uppercase">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                  <span className="truncate">{property.neighborhood}</span>
                </div>
                {property.address && (
                  <div className="text-[9px] text-slate-400 font-normal truncate pl-5">
                    {property.address}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                <div className="text-xl font-bold text-slate-900">
                  <span className="text-[10px] font-medium text-slate-600 block uppercase tracking-widest mb-1">A partir de</span>
                  R$ {property.priceFormatted}
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="flex flex-col items-center">
                    <BedDouble className="w-4 h-4 mb-1 text-slate-500" />
                    <span className="text-[10px] font-bold">{property.bedrooms === 0 ? "Studio" : property.bedrooms}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Maximize2 className="w-4 h-4 mb-1 text-slate-500" />
                    <span className="text-[10px] font-bold">{property.area}m²</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
}

interface FeaturedPropertiesProps {
  filters?: UsePropertiesOptions;
  onPageChange?: (page: number) => void;
}

export default function FeaturedProperties({ filters = {}, onPageChange }: FeaturedPropertiesProps) {
  const [location] = useLocation();
  const isComprarPage = location === "/comprar";
  const [allProperties, setAllProperties] = useState<PropertyData[]>([]);
  const [innerPage, setInnerPage] = useState(1);
  const observerTarget = useRef(null);

  const filterKey = JSON.stringify({
    neighborhood: filters.neighborhood,
    bedrooms: filters.bedrooms,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    status: filters.status
  });

  useEffect(() => {
    setAllProperties([]);
    setInnerPage(1);
    const grid = document.getElementById("properties-grid");
    if (grid && innerPage > 1) {
      grid.scrollIntoView({ behavior: "smooth" });
    }
  }, [filterKey]);

  const { data, loading, error, refetch } = useProperties({
    ...filters,
    limit: filters.limit ?? (isComprarPage ? 12 : 6),
    page: innerPage
  });

  const currentPage = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;
  const hasMore = currentPage < totalPages;

  // Append new data to allProperties
  useEffect(() => {
    if (data?.properties) {
      if (innerPage === 1) {
        setAllProperties(data.properties);
      } else {
        setAllProperties(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newOnes = data.properties.filter(p => !existingIds.has(p.id));
          return [...prev, ...newOnes];
        });
      }
    }
  }, [data, innerPage]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (!hasMore || loading) return;

    const currentTarget = observerTarget.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setInnerPage(prev => prev + 1);
        }
      },
      { threshold: 0, rootMargin: '400px' }
    );

    observer.observe(currentTarget);
    return () => observer.disconnect();
  }, [hasMore, loading, innerPage, allProperties.length]);

  return (
    <section id="properties-grid" className="py-16 md:py-24 bg-white scroll-mt-20">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">Exclusivos</p>
          <h2 className="text-4xl md:text-5xl text-foreground mb-6 font-light">
            {Object.keys(filters).filter(k => filters[k as keyof typeof filters] !== undefined && filters[k as keyof typeof filters] !== "all").length > 0
              ? "Resultados da sua busca"
              : (isComprarPage ? "Todos os Imóveis" : "Os melhores imóveis para investimento")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light mb-8">
            {isComprarPage ? `Explorando ${data?.total.toLocaleString("pt-BR") ?? 0} oportunidades em São Paulo.` : (Object.keys(filters).length > 0
              ? "Confira as opções que encontramos com base nas suas preferências."
              : "Selecionamos os empreendimentos mais promissores do mercado, com potencial de valorização e localização privilegiada.")}
          </p>

          <div className="flex justify-center">
            <Button
              onClick={() => {
                setAllProperties([]);
                setInnerPage(1);
                refetch();
              }}
              variant="outline"
              className="gap-2 rounded-full px-6 border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-medium text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar Lista
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <p className="text-muted-foreground">Não foi possível carregar os imóveis. Tente novamente.</p>
            <Button variant="outline" onClick={refetch} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Tentar novamente
            </Button>
          </div>
        )}

        {!error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {allProperties.map((p, i) => <PropertyCard key={`${p.id}-${i}`} property={p} index={i} />)}
              {loading && Array.from({ length: allProperties.length === 0 ? 6 : 3 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
            </div>

            {!loading && allProperties.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-muted rounded-xl bg-slate-50">
                <p className="text-xl text-muted-foreground">Nenhum imóvel encontrado.</p>
                <Button variant="link" onClick={() => window.location.reload()} className="mt-4">Limpar filtros</Button>
              </div>
            )}

            {allProperties.length > 0 && (
              <div className="text-center mt-12 mb-20">
                {hasMore ? (
                  <div className="flex flex-col items-center gap-6">
                    <p className="text-muted-foreground text-sm font-medium font-serif italic animate-pulse">
                      {loading ? "Carregando mais opções exclusivas..." : "Deslize para descobrir mais imóveis"}
                    </p>
                    <div ref={observerTarget} className="h-24 w-full flex items-center justify-center">
                      {loading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-70" />
                          <span className="text-[10px] uppercase tracking-tighter text-slate-400">Preparando imóveis...</span>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary/30 animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-2 h-2 rounded-full bg-primary/30 animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2 h-2 rounded-full bg-primary/30 animate-bounce" />
                        </div>
                      )}
                    </div>
                    {!loading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInnerPage(p => p + 1)}
                        className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:bg-slate-50 opacity-50"
                      >
                        Carregar agora
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="pt-16 border-t border-slate-100 mb-10">
                    <p className="italic text-slate-400 font-serif text-lg">Você chegou ao final da seleção.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

import { BedDouble, Maximize2, MapPin, RefreshCw, AlertCircle, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProperties, type PropertyData, type UsePropertiesOptions } from "@/hooks/useProperties";
import { useFavorites } from "@/hooks/useFavorites";
import { Link, useLocation } from "wouter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

// ─── Property Card ─────────────────────────────────────────────────────────
function PropertyCard({ property }: { property: PropertyData }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(property.id);

  const image = property.images[0] ?? "https://d2xsxph8kpxj0f.cloudfront.net/310519663366689293/jsiKnDEmDWyHsAZxshzkFX/apartment-interior-AsrdjbkKxpBi7u6wHztwSk.webp";

  const statusColor =
    property.status === "Pronto"
      ? "bg-emerald-500 text-white"
      : property.status === "Em obras"
        ? "bg-amber-500 text-white"
        : "bg-[#FBE486] text-slate-900";

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer border-0 group bg-white shadow-sm hover:shadow-primary/10 relative rounded-3xl">
      {/* Favorite Button */}
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

      <Link href={`/imovel/${property.slug}`}>
        <div className="cursor-pointer">
          {/* Image */}
          <div className="relative h-64 md:h-72 overflow-hidden bg-slate-50">
            <img
              src={image}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://d2xsxph8kpxj0f.cloudfront.net/310519663366689293/jsiKnDEmDWyHsAZxshzkFX/apartment-interior-AsrdjbkKxpBi7u6wHztwSk.webp";
              }}
            />
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.1em] ${statusColor}`}>
              {property.status}
            </div>
          </div>

          {/* Content */}
          <div className="p-7 bg-white">
            <h3 className="text-2xl font-normal text-slate-900 mb-3 line-clamp-2 min-h-[4rem] leading-tight font-serif italic">
              {property.title}
            </h3>

            <div className="flex items-center gap-2 text-slate-600 mb-4 text-xs font-medium tracking-wide uppercase">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
              <span className="truncate">{property.neighborhood}</span>
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
  );
}

interface FeaturedPropertiesProps {
  filters?: UsePropertiesOptions;
  onPageChange?: (page: number) => void;
}

// ─── Main Section ──────────────────────────────────────────────────────────
export default function FeaturedProperties({ filters = {}, onPageChange }: FeaturedPropertiesProps) {
  const [location] = useLocation();
  const isComprarPage = location === "/comprar";

  const { data, loading, error, refetch } = useProperties({
    limit: 6,
    ...filters
  });

  const currentPage = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;

  const handlePageChange = (p: number) => {
    if (onPageChange) {
      onPageChange(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Pagination Logic
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <Pagination className="mt-12">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
          )}

          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink className="cursor-pointer" onClick={() => handlePageChange(1)}>1</PaginationLink>
              </PaginationItem>
              {startPage > 2 && <PaginationEllipsis />}
            </>
          )}

          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                className="cursor-pointer"
                isActive={p === currentPage}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink className="cursor-pointer" onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
              </PaginationItem>
            </>
          )}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <section id="properties-grid" className="py-16 md:py-24 bg-white scroll-mt-20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Exclusivos
          </p>
          <h2 className="text-4xl md:text-5xl text-foreground mb-6 font-light">
            {isComprarPage ? "Todos os Imóveis" : (Object.keys(filters).length > 0 ? "Resultados da sua busca" : "Os melhores imóveis para investimento")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            {isComprarPage ? `Explorando ${data?.total.toLocaleString("pt-BR")} oportunidades em São Paulo.` : (Object.keys(filters).length > 0
              ? "Confira as opções que encontramos com base nas suas preferências."
              : "Selecionamos os empreendimentos mais promissores do mercado, com potencial de valorização e localização privilegiada.")}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <p className="text-muted-foreground">
              Não foi possível carregar os imóveis. Verifique sua conexão ou tente novamente.
            </p>
            <Button variant="outline" onClick={refetch} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Grid */}
        {!error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : data?.properties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>

            {/* Empty State */}
            {!loading && data?.properties.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-muted rounded-xl bg-slate-50">
                <p className="text-xl text-muted-foreground">Nenhum imóvel encontrado com esses filtros.</p>
                <Button variant="link" onClick={() => window.location.reload()} className="mt-4">
                  Limpar todos os filtros
                </Button>
              </div>
            )}

            {/* Total count + CTA */}
            {!loading && data && data.properties.length > 0 && (
              <div className="text-center mt-16">
                {isComprarPage && (
                  <p className="text-muted-foreground text-sm mb-6 font-medium">
                    Exibindo página {data.page} de {data.totalPages.toLocaleString("pt-BR")}
                  </p>
                )}

                {isComprarPage && renderPagination()}

                {!isComprarPage && (
                  <Button
                    size="lg"
                    className="bg-slate-900 text-white hover:bg-slate-800 mt-4 px-10 h-14 rounded-full text-lg shadow-xl shadow-black/10"
                    asChild
                  >
                    <Link href="/comprar">
                      Ver todos os imóveis
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

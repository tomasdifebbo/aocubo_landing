import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeroProps {
  onSearch: (filters: {
    neighborhood?: string;
    bedrooms?: number;
    maxPrice?: number;
    status?: string;
  }) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [neighborhood, setNeighborhood] = useState("");
  const [bedrooms, setBedrooms] = useState<string>("0");
  const [maxPrice, setMaxPrice] = useState<string>("0");
  const [status, setStatus] = useState<string>("all");

  const handleSearch = () => {
    onSearch({
      neighborhood: neighborhood || undefined,
      bedrooms: bedrooms !== "0" ? parseInt(bedrooms) : undefined,
      maxPrice: maxPrice !== "0" ? parseInt(maxPrice) : undefined,
      status: status === "all" ? undefined : status,
    });
  };

  // Auto-apply filters with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 600);
    return () => clearTimeout(timer);
  }, [neighborhood, bedrooms, maxPrice, status]);

  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center py-20"
      style={{
        backgroundImage: 'url(/hero-luxury.png)',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"></div>

      <div className="relative z-10 container max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-white text-5xl md:text-8xl mb-8 leading-tight font-serif italic drop-shadow-2xl">
          Seu novo capítulo,<br />com elegância.
        </h1>

        <p className="text-white/90 text-lg md:text-2xl mb-12 font-light max-w-3xl mx-auto drop-shadow-md tracking-wide">
          Curadoria exclusiva dos melhores imóveis em São Paulo com a ADJ'S Imóveis.
        </p>

        {/* Search Form Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 md:p-10 shadow-2xl max-w-5xl mx-auto border border-white/20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">

            <div className="col-span-2 lg:col-span-1 text-left">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 md:mb-3">Bairro</label>
              <Input
                placeholder="Digite o bairro"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full border-slate-100 bg-slate-50 h-12 md:h-14 rounded-2xl focus:ring-primary/20"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 md:mb-3">Quartos</label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-full border-slate-100 bg-slate-50 h-12 md:h-14 rounded-2xl focus:ring-primary/20">
                  <SelectValue placeholder="Qualquer" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  <SelectItem value="0" className="cursor-pointer">Qualquer</SelectItem>
                  <SelectItem value="1" className="cursor-pointer">1 Quarto</SelectItem>
                  <SelectItem value="2" className="cursor-pointer">2 Quartos</SelectItem>
                  <SelectItem value="3" className="cursor-pointer">3 Quartos</SelectItem>
                  <SelectItem value="4" className="cursor-pointer">4+ Quartos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 md:mb-3">Valor</label>
              <Select value={maxPrice} onValueChange={setMaxPrice}>
                <SelectTrigger className="w-full border-slate-100 bg-slate-50 h-12 md:h-14 rounded-2xl focus:ring-primary/20">
                  <SelectValue placeholder="Sem limite" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  <SelectItem value="0" className="cursor-pointer">Max</SelectItem>
                  <SelectItem value="250000" className="cursor-pointer">Até 250 mil</SelectItem>
                  <SelectItem value="400000" className="cursor-pointer">Até 400 mil</SelectItem>
                  <SelectItem value="500000" className="cursor-pointer">Até 500 mil</SelectItem>
                  <SelectItem value="1000000" className="cursor-pointer">Até 1M</SelectItem>
                  <SelectItem value="5000000" className="cursor-pointer">Até 5M</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 md:mb-3">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full border-slate-100 bg-slate-50 h-12 md:h-14 rounded-2xl focus:ring-primary/20">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  <SelectItem value="all" className="cursor-pointer">Todos</SelectItem>
                  <SelectItem value="Pronto" className="cursor-pointer">Pronto</SelectItem>
                  <SelectItem value="Em obras" className="cursor-pointer">Obras</SelectItem>
                  <SelectItem value="Breve lançamento" className="cursor-pointer">Lança.</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

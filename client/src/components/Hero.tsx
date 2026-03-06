import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

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
  const [bedrooms, setBedrooms] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [status, setStatus] = useState<string>("all");

  const handleSearch = () => {
    onSearch({
      neighborhood: neighborhood || undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      status: status === "all" ? undefined : status,
    });

    // Smooth scroll to properties
    const el = document.getElementById("properties-grid");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl max-w-5xl mx-auto border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

            <div className="lg:col-span-1 text-left">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Localização</label>
              <Input
                placeholder="Bairro ou região"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="border-slate-100 bg-slate-50 text-foreground h-14 rounded-2xl focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Quartos</label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-full border-slate-100 bg-slate-50 h-14 rounded-2xl focus:ring-primary/20">
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

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Valor Máximo</label>
              <Select value={maxPrice} onValueChange={setMaxPrice}>
                <SelectTrigger className="w-full border-slate-100 bg-slate-50 h-14 rounded-2xl focus:ring-primary/20">
                  <SelectValue placeholder="Sem limite" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  <SelectItem value="0" className="cursor-pointer">Sem limite</SelectItem>
                  <SelectItem value="500000" className="cursor-pointer">Até R$ 500 mil</SelectItem>
                  <SelectItem value="1000000" className="cursor-pointer">Até R$ 1 milhão</SelectItem>
                  <SelectItem value="2000000" className="cursor-pointer">Até R$ 2 milhões</SelectItem>
                  <SelectItem value="5000000" className="cursor-pointer">Até R$ 5 milhões</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full border-slate-100 bg-slate-50 h-14 rounded-2xl focus:ring-primary/20">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  <SelectItem value="all" className="cursor-pointer">Todos</SelectItem>
                  <SelectItem value="Pronto" className="cursor-pointer">Pronto</SelectItem>
                  <SelectItem value="Em obras" className="cursor-pointer">Em obras</SelectItem>
                  <SelectItem value="Breve lançamento" className="cursor-pointer">Breve lançamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full h-14 text-lg bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-black/10 gap-3 border-0 font-bold rounded-2xl px-10 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Search className="w-6 h-6" />
                Buscar Imóveis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, Check, Plus, Trash2, MapPin, BedDouble, Car, Maximize2, ExternalLink } from "lucide-react";
import { PropertyData } from "@/hooks/useProperties";
import { toast } from "sonner";

interface PropertyComparatorProps {
  availableProperties: PropertyData[];
}

export function PropertyComparator({ availableProperties }: PropertyComparatorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedProperties = availableProperties.filter((p) => selectedIds.includes(p.id));

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 3) {
        toast.info("Você pode comparar no máximo 3 imóveis simultaneamente.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const calculatePricePerM2 = (price: number, area: number) => {
    if (!area || area === 0) return 0;
    return Math.round(price / area);
  };

  return (
    <Card className="bg-slate-900/90 border-slate-800 text-white rounded-3xl p-6 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            Comparativo para Vendas
          </div>
          <h3 className="text-xl font-serif italic text-white">Comparador de Imóveis Lado a Lado</h3>
          <p className="text-xs text-slate-400 mt-1">
            Compare instantaneamente o valor por metro quadrado (R$/m²), preço e infraestrutura para apresentar ao cliente.
          </p>
        </div>

        {selectedProperties.length > 0 && (
          <Button
            onClick={() => setSelectedIds([])}
            variant="outline"
            className="border-slate-800 text-slate-400 hover:text-red-400 text-xs h-9 px-3 rounded-xl gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar Comparação
          </Button>
        )}
      </div>

      {/* Property Selector Chips */}
      <div className="mb-6">
        <span className="text-xs text-slate-400 block mb-2 font-medium uppercase tracking-wider">
          Selecione até 3 Imóveis para Comparar ({selectedProperties.length}/3 selecionados):
        </span>
        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
          {availableProperties.slice(0, 15).map((p) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleToggleSelect(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Plus className="w-3.5 h-3.5 text-slate-500" />}
                <span className="truncate max-w-[140px]">{p.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      {selectedProperties.length === 0 ? (
        <div className="text-center py-12 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6">
          <Scale className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-medium text-white mb-1">Nenhum imóvel selecionado</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Clique nos botões acima para selecionar os imóveis e analisar os valores por m² e especificações lado a lado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedProperties.map((p) => {
            const pricePerM2 = calculatePricePerM2(p.price, p.area);
            return (
              <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-amber-400 text-[10px] border border-amber-500/30">
                      {p.status}
                    </Badge>
                  </div>

                  <h4 className="font-serif italic text-lg text-white line-clamp-1">{p.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-amber-400" /> {p.neighborhood}
                  </p>
                </div>

                <div className="space-y-2 border-y border-slate-800/80 py-3 text-xs">
                  <div className="flex justify-between items-center bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                    <span className="text-slate-300 font-medium">Valor por m²:</span>
                    <span className="text-amber-400 font-bold text-sm">
                      R$ {pricePerM2.toLocaleString("pt-BR")}/m²
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Preço Total:</span>
                    <span className="text-white font-bold">R$ {p.priceFormatted}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Metragem:</span>
                    <span className="text-white font-medium">{p.area} m²</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Dormitórios:</span>
                    <span className="text-white font-medium">{p.bedrooms === 0 ? "Studio" : `${p.bedrooms} dorms`}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Vagas de Garagem:</span>
                    <span className="text-white font-medium">{p.parkingSlots} vagas</span>
                  </div>
                </div>

                <Button
                  onClick={() => window.open(p.url, "_blank")}
                  className="w-full text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-9 gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver Ficha no AoCubo
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, Send, Layers, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function FinancingCalculator() {
  const [propertyPrice, setPropertyPrice] = useState<number>(350000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRateYearly, setInterestRateYearly] = useState<number>(10.5);
  const [years, setYears] = useState<number>(30);
  const [system, setSystem] = useState<"PRICE" | "SAC" | "BOTH">("BOTH");

  // Base Calculations
  const downPaymentValue = (propertyPrice * downPaymentPercent) / 100;
  const financedAmount = propertyPrice - downPaymentValue;
  const totalMonths = years * 12;
  const monthlyInterestRate = interestRateYearly / 100 / 12;

  // 1. SAC Calculation (1st Payment)
  const monthlyAmortization = financedAmount / totalMonths;
  const initialInterest = financedAmount * monthlyInterestRate;
  const sacFirstPayment = monthlyAmortization + initialInterest;

  // 2. PRICE Calculation (Fixed Monthly Payment)
  const priceFactor = (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
                      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
  const priceFixedPayment = financedAmount * priceFactor;

  const handleCopySimulation = () => {
    const text = `🧮 *Simulação de Financiamento - ADJ'S Imóveis* 🏢

*Valor do Imóvel:* R$ ${propertyPrice.toLocaleString("pt-BR")}
*Entrada (${downPaymentPercent}%):* R$ ${downPaymentValue.toLocaleString("pt-BR")}
*Saldo Financiado:* R$ ${financedAmount.toLocaleString("pt-BR")} (${years} anos)

📊 *Tabela PRICE (Parcelas Fixas):*
   R$ ${Math.round(priceFixedPayment).toLocaleString("pt-BR")}/mês

📉 *Tabela SAC (1ª Parcela Decrescente):*
   R$ ${Math.round(sacFirstPayment).toLocaleString("pt-BR")}/mês

📲 _Dúvidas ou agendamento de visita? Entre em contato agora!_`;

    navigator.clipboard.writeText(text);
    toast.success("Simulação copiada para a área de transferência!");
  };

  const handleShareWhatsApp = () => {
    const text = `🧮 *Simulação de Financiamento - ADJ'S Imóveis* 🏢%0A%0A*Valor do Imóvel:* R$ ${propertyPrice.toLocaleString("pt-BR")}%0A*Entrada (${downPaymentPercent}%):* R$ ${downPaymentValue.toLocaleString("pt-BR")}%0A*Financiado:* R$ ${financedAmount.toLocaleString("pt-BR")} (${years} anos)%0A%0A📊 *Tabela PRICE (Parcela Fixa):* R$ ${Math.round(priceFixedPayment).toLocaleString("pt-BR")}/mês%0A📉 *Tabela SAC (1ª Parcela):* R$ ${Math.round(sacFirstPayment).toLocaleString("pt-BR")}/mês%0A%0A📲 _Entre em contato para agendar uma visita!_`;
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <Card className="bg-slate-900/90 border-slate-800 text-white rounded-3xl p-6 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            Ferramenta do Corretor
          </div>
          <h3 className="text-xl font-serif italic text-white">Simulador de Financiamento (PRICE & SAC)</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 self-start sm:self-auto">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-slate-400 mb-1.5 block">Valor Total do Imóvel (R$)</Label>
            <Input
              type="number"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
              className="bg-slate-950 border-slate-800 text-white h-11 rounded-xl text-base font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-400 mb-1.5 block">Entrada (%)</Label>
              <Input
                type="number"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value) || 0)}
                className="bg-slate-950 border-slate-800 text-white h-11 rounded-xl font-semibold"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400 mb-1.5 block">Taxa Anual (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={interestRateYearly}
                onChange={(e) => setInterestRateYearly(Number(e.target.value) || 0)}
                className="bg-slate-950 border-slate-800 text-white h-11 rounded-xl font-semibold"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-slate-400 mb-1.5 block">Prazo de Financiamento (Anos)</Label>
            <SelectYears years={years} setYears={setYears} />
          </div>

          <div>
            <Label className="text-xs text-slate-400 mb-1.5 block">Sistema de Amortização</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSystem("BOTH")}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  system === "BOTH"
                    ? "bg-amber-500 text-slate-950 border-amber-500"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                }`}
              >
                Ambos (PRICE + SAC)
              </button>
              <button
                type="button"
                onClick={() => setSystem("PRICE")}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  system === "PRICE"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                }`}
              >
                Tabela PRICE
              </button>
              <button
                type="button"
                onClick={() => setSystem("SAC")}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  system === "SAC"
                    ? "bg-emerald-500 text-slate-950 border-emerald-500"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                }`}
              >
                Tabela SAC
              </button>
            </div>
          </div>
        </div>

        {/* Output Results */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm py-2 border-b border-slate-800">
              <span className="text-slate-400">Valor da Entrada ({downPaymentPercent}%):</span>
              <span className="text-emerald-400 font-bold text-base">
                R$ {downPaymentValue.toLocaleString("pt-BR")}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-2 border-b border-slate-800">
              <span className="text-slate-400">Saldo Financiado ({100 - downPaymentPercent}%):</span>
              <span className="text-white font-bold text-base">
                R$ {financedAmount.toLocaleString("pt-BR")}
              </span>
            </div>

            {/* TABELA PRICE RESULT */}
            {(system === "PRICE" || system === "BOTH") && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3.5 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-400 uppercase tracking-wider font-bold block">
                    📊 Tabela PRICE (Parcela Fixa)
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Fixa do início ao fim
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-400 mt-1">
                  R$ {Math.round(priceFixedPayment).toLocaleString("pt-BR")}
                  <span className="text-xs font-normal text-slate-400"> /mês</span>
                </div>
              </div>
            )}

            {/* TABELA SAC RESULT */}
            {(system === "SAC" || system === "BOTH") && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-400 uppercase tracking-wider font-bold block">
                    📉 Tabela SAC (1ª Parcela)
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Parcelas decrescentes
                  </span>
                </div>
                <div className="text-2xl font-bold text-amber-400 mt-1">
                  R$ {Math.round(sacFirstPayment).toLocaleString("pt-BR")}
                  <span className="text-xs font-normal text-slate-400"> /mês</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              onClick={handleCopySimulation}
              variant="outline"
              className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 rounded-xl text-xs h-10"
            >
              Copiar Texto
            </Button>

            <Button
              onClick={handleShareWhatsApp}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs h-10 gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SelectYears({ years, setYears }: { years: number; setYears: (val: number) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {[15, 20, 25, 30].map((y) => (
        <button
          key={y}
          type="button"
          onClick={() => setYears(y)}
          className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
            years === y
              ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md"
              : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
          }`}
        >
          {y} Anos
        </button>
      ))}
    </div>
  );
}

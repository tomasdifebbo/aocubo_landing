import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedProperties from "@/components/FeaturedProperties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FilterX } from "lucide-react";

export default function Comprar() {
    const [page, setPage] = useState(1);
    // Read initial filters from URL on mount
    const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const [inputNeighborhood, setInputNeighborhood] = useState(searchParams.get("bairro") || "");
    const [inputBedrooms, setInputBedrooms] = useState<string>(searchParams.get("quartos") || "0");
    const [inputMaxPrice, setInputMaxPrice] = useState<string>(searchParams.get("preco") || "0");
    const [inputStatus, setInputStatus] = useState<string>(searchParams.get("status") || "all");

    const [filters, setFilters] = useState<{
        neighborhood?: string;
        bedrooms?: number;
        maxPrice?: number;
        status?: string;
    }>({
        neighborhood: searchParams.get("bairro") || undefined,
        bedrooms: searchParams.get("quartos") && searchParams.get("quartos") !== "0" ? parseInt(searchParams.get("quartos")!) : undefined,
        maxPrice: searchParams.get("preco") && searchParams.get("preco") !== "0" ? parseInt(searchParams.get("preco")!) : undefined,
        status: searchParams.get("status") && searchParams.get("status") !== "all" ? searchParams.get("status") || undefined : undefined,
    });

    // Sync state with URL params
    useEffect(() => {
        const params = new URLSearchParams();
        if (inputNeighborhood) params.set("bairro", inputNeighborhood);
        if (inputBedrooms !== "0") params.set("quartos", inputBedrooms);
        if (inputMaxPrice !== "0") params.set("preco", inputMaxPrice);
        if (inputStatus !== "all") params.set("status", inputStatus);

        const queryString = params.toString();
        const path = queryString ? `/comprar?${queryString}` : "/comprar";

        // Use replaceState to keep history clean and avoid spamming with debounced updates
        if (typeof window !== "undefined" && window.location.search !== (queryString ? `?${queryString}` : "")) {
            window.history.replaceState({}, "", path);
        }
    }, [inputNeighborhood, inputBedrooms, inputMaxPrice, inputStatus]);

    // Reset page when filters change
    const applyFilters = (shouldScroll = false) => {
        setPage(1);
        setFilters({
            neighborhood: inputNeighborhood || undefined,
            bedrooms: inputBedrooms !== "0" ? parseInt(inputBedrooms) : undefined,
            maxPrice: inputMaxPrice !== "0" ? parseInt(inputMaxPrice) : undefined,
            status: inputStatus === "all" ? undefined : inputStatus,
        });

        if (shouldScroll) {
            const el = document.getElementById("properties-grid");
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Auto-apply filters with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 600); // 600ms debounce
        return () => clearTimeout(timer);
    }, [inputNeighborhood, inputBedrooms, inputMaxPrice, inputStatus]);

    const clearFilters = () => {
        setInputNeighborhood("");
        setInputBedrooms("0");
        setInputMaxPrice("0");
        setInputStatus("all");
        setPage(1);
        setFilters({});
        // Clear URL
        if (typeof window !== "undefined") {
            window.history.replaceState({}, "", "/comprar");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1">
                {/* Header Section */}
                <section
                    className="relative w-full pt-20 pb-24 md:pt-32 md:pb-40 bg-cover bg-center flex flex-col justify-center"
                    style={{
                        backgroundImage: 'url(/hero-luxury.png)',
                        backgroundAttachment: 'fixed',
                    }}
                >
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>

                    <div className="container relative z-10">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-white mb-4 text-center">Comprar Imóveis</h1>
                        <p className="text-lg text-slate-200 max-w-2xl mb-12 text-center mx-auto drop-shadow-md">
                            Explore nossa seleção completa de imóveis exclusivos em São Paulo.
                            Use os filtros abaixo para encontrar o lar perfeito para você.
                        </p>

                        {/* Search Form Container - Maximum Transparency Glass Effect */}
                        <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-4 md:p-10 shadow-2xl max-w-5xl mx-auto border border-white/20">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">

                                <div className="col-span-2 lg:col-span-1 text-left">
                                    <label className="block text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2 md:mb-3 drop-shadow-md">Bairro</label>
                                    <Input
                                        placeholder="Digite o bairro"
                                        value={inputNeighborhood}
                                        onChange={(e) => setInputNeighborhood(e.target.value)}
                                        className="w-full border-slate-100 bg-slate-50 h-12 md:h-14 rounded-2xl focus:ring-primary/20"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2 md:mb-3 drop-shadow-md">Quartos</label>
                                    <Select value={inputBedrooms} onValueChange={setInputBedrooms}>
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
                                    <label className="block text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2 md:mb-3 drop-shadow-md">Valor</label>
                                    <Select value={inputMaxPrice} onValueChange={setInputMaxPrice}>
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
                                    <label className="block text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2 md:mb-3 drop-shadow-md">Status</label>
                                    <Select value={inputStatus} onValueChange={setInputStatus}>
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

                {/* Results */}
                <FeaturedProperties
                    filters={filters}
                />
            </main>

            <Footer />
        </div>
    );
}

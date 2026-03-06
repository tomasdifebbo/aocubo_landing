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
    const [filters, setFilters] = useState<{
        neighborhood?: string;
        bedrooms?: number;
        maxPrice?: number;
        status?: string;
    }>({});

    const [inputNeighborhood, setInputNeighborhood] = useState("");
    const [inputBedrooms, setInputBedrooms] = useState<string>("0");
    const [inputMaxPrice, setInputMaxPrice] = useState<string>("0");
    const [inputStatus, setInputStatus] = useState<string>("all");

    // Reset page when filters change
    const applyFilters = () => {
        setPage(1);
        setFilters({
            neighborhood: inputNeighborhood || undefined,
            bedrooms: inputBedrooms !== "0" ? parseInt(inputBedrooms) : undefined,
            maxPrice: inputMaxPrice !== "0" ? parseInt(inputMaxPrice) : undefined,
            status: inputStatus === "all" ? undefined : inputStatus,
        });
    };

    const clearFilters = () => {
        setInputNeighborhood("");
        setInputBedrooms("0");
        setInputMaxPrice("0");
        setInputStatus("all");
        setPage(1);
        setFilters({});
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1">
                {/* Header Section */}
                <section className="bg-secondary/30 py-12 md:py-20">
                    <div className="container">
                        <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">Comprar Imóveis</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            Explore nossa seleção completa de imóveis exclusivos em São Paulo.
                            Use os filtros abaixo para encontrar o lar perfeito para você.
                        </p>
                    </div>
                </section>

                {/* Filter Bar */}
                <section className="sticky top-16 md:top-20 z-40 bg-white border-b border-border py-6 shadow-sm">
                    <div className="container">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Localização</label>
                                <Input
                                    placeholder="Bairro"
                                    value={inputNeighborhood}
                                    onChange={(e) => setInputNeighborhood(e.target.value)}
                                    className="h-10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quartos</label>
                                <Select value={inputBedrooms} onValueChange={setInputBedrooms}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Qualquer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Qualquer</SelectItem>
                                        <SelectItem value="1">1 Quarto</SelectItem>
                                        <SelectItem value="2">2 Quartos</SelectItem>
                                        <SelectItem value="3">3 Quartos</SelectItem>
                                        <SelectItem value="4">4+ Quartos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Valor Máximo</label>
                                <Select value={inputMaxPrice} onValueChange={setInputMaxPrice}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Sem limite" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Sem limite</SelectItem>
                                        <SelectItem value="500000">Até R$ 500 mil</SelectItem>
                                        <SelectItem value="1000000">Até R$ 1 milhão</SelectItem>
                                        <SelectItem value="2000000">Até R$ 2 milhões</SelectItem>
                                        <SelectItem value="5000000">Até R$ 5 milhões</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status</label>
                                <Select value={inputStatus} onValueChange={setInputStatus}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="Pronto">Pronto</SelectItem>
                                        <SelectItem value="Em obras">Em obras</SelectItem>
                                        <SelectItem value="Breve lançamento">Breve lançamento</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2 items-end">
                                <Button onClick={applyFilters} className="flex-1 h-10 gap-2">
                                    <Search className="w-4 h-4" />
                                    Filtrar
                                </Button>
                                <Button onClick={clearFilters} variant="outline" className="h-10" title="Limpar filtros">
                                    <FilterX className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results */}
                <FeaturedProperties
                    filters={{ ...filters, page, limit: 12 }}
                    onPageChange={setPage}
                />
            </main>

            <Footer />
        </div>
    );
}

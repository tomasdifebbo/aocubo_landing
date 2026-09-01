import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    ShieldCheck,
    RefreshCw,
    Building2,
    Search,
    MapPin,
    Calendar,
    ExternalLink,
    Clock,
    Sparkles,
    SlidersHorizontal,
    TrendingUp,
    Layers,
    Crown,
    Lock,
    BedDouble,
    Car,
    Maximize2,
    CheckCircle2
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Admin() {
    const { user, isAdmin, isMasterMode, toggleMasterMode, openLogin } = useAuth();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Fetch properties ordered by newest creation date on AoCubo
    const { data, loading, error, refetch } = useProperties({
        page,
        limit: 12,
        sort: "newest",
        status: statusFilter === "all" ? undefined : statusFilter,
    });

    const properties = data?.properties ?? [];
    const total = data?.total ?? 0;

    // Filter properties client-side by title/neighborhood/developer query if entered
    const filteredProperties = properties.filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            p.title.toLowerCase().includes(q) ||
            p.neighborhood.toLowerCase().includes(q) ||
            (p.developer && p.developer.toLowerCase().includes(q))
        );
    });

    const formatDate = (isoString?: string) => {
        if (!isoString) return "Recentemente atualizado";
        try {
            const d = new Date(isoString);
            return d.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return isoString;
        }
    };

    const handleCopyLink = (url: string, title: string) => {
        navigator.clipboard.writeText(url);
        toast.success(`Link de "${title}" copiado para a área de transferência!`);
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center p-6">
                    <Card className="max-w-md w-full border-slate-800 bg-slate-900/90 backdrop-blur-xl text-white shadow-2xl rounded-3xl p-8 text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                            <Crown className="w-8 h-8" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-serif italic font-normal text-white">Acesso Restrito: Painel Master</h2>
                            <p className="text-sm text-slate-400 font-light leading-relaxed">
                                Este painel é reservado exclusivamente para a gestão de administradores. Ative o Modo Master ou faça login com sua conta administrativa.
                            </p>
                        </div>

                        <div className="pt-2 space-y-3">
                            <Button
                                onClick={() => {
                                    toggleMasterMode(true);
                                    toast.success("Modo Master Ativado com sucesso!");
                                }}
                                className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 h-12 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="w-5 h-5" />
                                Ativar Modo Master Agora
                            </Button>

                            {!user && (
                                <Button
                                    variant="outline"
                                    onClick={openLogin}
                                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 h-12 rounded-xl"
                                >
                                    Entrar com Conta Existente
                                </Button>
                            )}
                        </div>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
            <Header />

            <main className="flex-1 pb-24">
                {/* Hero Header */}
                <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="container relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
                                    <Crown className="w-3.5 h-3.5" />
                                    Painel Administrativo Master
                                </div>
                                <h1 className="text-3xl md:text-5xl font-serif italic text-white tracking-tight">
                                    Novos Imóveis Atualizados no AoCubo
                                </h1>
                                <p className="text-sm md:text-base text-slate-400 font-light mt-2 max-w-2xl">
                                    Monitoramento em tempo real dos empreendimentos cadastrados e atualizados na plataforma da AoCubo São Paulo.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => refetch()}
                                    variant="outline"
                                    className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-white gap-2 rounded-xl h-11 px-5"
                                >
                                    <RefreshCw className={`w-4 h-4 text-amber-400 ${loading ? "animate-spin" : ""}`} />
                                    Atualizar Feed
                                </Button>
                                <Button
                                    onClick={() => {
                                        toggleMasterMode(false);
                                        toast.info("Modo Master desativado.");
                                    }}
                                    variant="ghost"
                                    className="text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl h-11 px-4 text-xs"
                                >
                                    Sair do Modo Master
                                </Button>
                            </div>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                            <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-md text-white rounded-2xl p-5 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Encontrados</span>
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-2xl md:text-3xl font-bold mt-2 text-white">
                                    {total.toLocaleString("pt-BR")}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Imóveis ativos no banco da AoCubo</p>
                            </Card>

                            <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-md text-white rounded-2xl p-5 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Lançamentos Recentes</span>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-2xl md:text-3xl font-bold mt-2 text-white">
                                    {properties.length}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Nesta página do Feed Master</p>
                            </Card>

                            <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-md text-white rounded-2xl p-5 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Status Predominante</span>
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-xl md:text-2xl font-semibold mt-2 text-white truncate">
                                    {statusFilter === "all" ? "Todos os Estágios" : statusFilter}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Filtro de fase atual</p>
                            </Card>

                            <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-md text-white rounded-2xl p-5 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Sincronização</span>
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-lg font-semibold mt-2 text-emerald-400 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    API AoCubo Ativa
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Ordenado por data de inclusão</p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Filters & Control Bar */}
                <section className="container py-8">
                    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 md:p-6 mb-8 backdrop-blur-md flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Buscar por título, bairro ou construtora..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-xl focus:ring-amber-500/20"
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
                                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                                    <SelectTrigger className="h-11 w-full md:w-52 bg-slate-950 border-slate-800 text-white rounded-xl">
                                        <SelectValue placeholder="Estágio de Obras" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                        <SelectItem value="all">Todos os Estágios</SelectItem>
                                        <SelectItem value="Pronto">Pronto para Morar</SelectItem>
                                        <SelectItem value="Em obras">Em Construção</SelectItem>
                                        <SelectItem value="Breve lançamento">Breve Lançamento</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Properties List */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="bg-slate-900/40 border-slate-800 h-80 animate-pulse rounded-2xl" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-2xl">
                            <p className="text-red-400 mb-4">{error}</p>
                            <Button onClick={() => refetch()} variant="outline" className="border-slate-700 text-white">
                                Tentar Novamente
                            </Button>
                        </div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/30 border border-slate-800/60 rounded-3xl p-8">
                            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-white mb-2">Nenhum imóvel localizado</h3>
                            <p className="text-sm text-slate-400 max-w-md mx-auto">
                                Não encontramos imóveis para a busca ou filtro selecionado. Tente alterar os parâmetros.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProperties.map((p, idx) => (
                                <Card
                                    key={p.id}
                                    className="bg-slate-900/80 border-slate-800 hover:border-amber-500/40 transition-all duration-300 rounded-3xl overflow-hidden flex flex-col shadow-xl hover:shadow-2xl group"
                                >
                                    {/* Image & Badges */}
                                    <div className="relative h-56 bg-slate-950 overflow-hidden">
                                        <img
                                            src={p.images[0]}
                                            alt={p.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    "https://d2xsxph8kpxj0f.cloudfront.net/310519663366689293/jsiKnDEmDWyHsAZxshzkFX/apartment-interior-AsrdjbkKxpBi7u6wHztwSk.webp";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3 flex items-center gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    p.status === "Pronto"
                                                        ? "bg-emerald-500/90 text-white"
                                                        : p.status === "Em obras"
                                                        ? "bg-amber-500/90 text-slate-950"
                                                        : "bg-blue-500/90 text-white"
                                                }`}
                                            >
                                                {p.status}
                                            </span>
                                        </div>

                                        {/* Created / New Badge */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-amber-500/30">
                                            <Sparkles className="w-3 h-3 text-amber-400" />
                                            NOVO NO AOCUBO
                                        </div>

                                        {/* Developer label */}
                                        {p.developer && (
                                            <div className="absolute bottom-3 left-3 text-[10px] font-medium text-slate-300 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                                                Construtora: <span className="text-white font-bold">{p.developer}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                                <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                                <span className="truncate">{p.neighborhood}</span>
                                            </div>

                                            <h3 className="text-xl font-serif italic text-white line-clamp-2 leading-snug mb-3">
                                                {p.title}
                                            </h3>

                                            <div className="flex items-center gap-3 text-xs text-slate-400 py-3 border-y border-slate-800/80">
                                                <div className="flex items-center gap-1">
                                                    <BedDouble className="w-3.5 h-3.5 text-slate-500" />
                                                    <span>{p.bedrooms === 0 ? "Studio" : `${p.bedrooms} dorms`}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                                                    <span>{p.area}m²</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Car className="w-3.5 h-3.5 text-slate-500" />
                                                    <span>{p.parkingSlots} vagas</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                                                    Preço Inicial
                                                </span>
                                                <span className="text-xl font-bold text-white">
                                                    R$ {p.priceFormatted}
                                                </span>
                                            </div>

                                            {/* Date Info */}
                                            <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>{formatDate(p.createdAt)}</span>
                                                </div>
                                                <span className="text-slate-500 font-mono text-[10px]">ID #{p.id}</span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="grid grid-cols-2 gap-2 pt-1">
                                                <Link href={`/imovel/${p.slug}/${p.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full text-xs border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white rounded-xl h-10"
                                                    >
                                                        Ver no Site
                                                    </Button>
                                                </Link>
                                                <Button
                                                    onClick={() => handleCopyLink(p.url, p.title)}
                                                    className="w-full text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl h-10 gap-1.5"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    Link AoCubo
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {data && data.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-12">
                            <Button
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                variant="outline"
                                className="border-slate-800 bg-slate-900 text-white rounded-xl px-5 h-11"
                            >
                                Anterior
                            </Button>
                            <span className="text-sm text-slate-400 px-3">
                                Página <strong className="text-white">{page}</strong> de <strong className="text-white">{data.totalPages}</strong>
                            </span>
                            <Button
                                disabled={page >= data.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                variant="outline"
                                className="border-slate-800 bg-slate-900 text-white rounded-xl px-5 h-11"
                            >
                                Próxima
                            </Button>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}

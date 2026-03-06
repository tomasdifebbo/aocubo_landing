import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFavoritesData } from "@/hooks/useFavoritesData";
import { useFavorites } from "@/hooks/useFavorites";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Heart, MapPin, BedDouble, Maximize2, MoveRight, House } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Favoritos() {
    const { data: properties, loading } = useFavoritesData();
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-12 md:py-20">
                <div className="container">
                    <header className="mb-12">
                        <div className="flex items-center gap-3 text-primary mb-4 font-bold uppercase tracking-widest text-sm">
                            <Heart className="w-4 h-4 fill-current" />
                            <span>Sua Seleção</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4 tracking-tight">Meus Favoritos</h1>
                        <p className="text-lg text-slate-700 max-w-2xl font-light">
                            {favorites.length === 0
                                ? "Você ainda não favoritou nenhum imóvel. Comece a explorar e salve os seus favoritos aqui!"
                                : `Você tem ${favorites.length} ${favorites.length === 1 ? 'imóvel salvo' : 'imóveis salvos'} em sua lista de desejos.`}
                        </p>
                    </header>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <Card key={i} className="h-[450px] animate-pulse bg-white border-0 shadow-sm" />
                            ))}
                        </div>
                    ) : favorites.length === 0 ? (
                        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <House className="w-10 h-10 text-slate-500" />
                            </div>
                            <h2 className="text-2xl font-semibold mb-3">Nenhum favorito ainda</h2>
                            <p className="text-slate-700 mb-8 max-w-md mx-auto">
                                Quando você encontrar um imóvel que gostar, clique no ícone de coração para salvá-lo nesta lista.
                            </p>
                            <Link href="/comprar">
                                <Button size="lg" className="rounded-full px-8 h-12 shadow-lg shadow-primary/20">
                                    Explorar Imóveis
                                    <MoveRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((property) => (
                                <Card key={property.id} className="overflow-hidden bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 group relative rounded-2xl">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleFavorite(property.id);
                                        }}
                                        className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <Heart className="w-5 h-5 fill-current" />
                                    </button>

                                    <Link href={`/imovel/${property.slug}`}>
                                        <div className="cursor-pointer">
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={property.images[0]}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    alt={property.title}
                                                />
                                                <div className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full px-4">
                                                    {property.status}
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold mb-2 line-clamp-1 text-slate-900">{property.title}</h3>
                                                <div className="text-2xl font-bold text-primary mb-4">R$ {property.priceFormatted}</div>
                                                <div className="flex items-center gap-2 text-slate-600 text-sm mb-4">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="truncate">{property.neighborhood}</span>
                                                </div>
                                                <div className="flex gap-6 pt-4 border-t border-slate-50 text-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <BedDouble className="w-4 h-4 text-primary" />
                                                        <span className="text-sm font-medium">{property.bedrooms} qtos</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Maximize2 className="w-4 h-4 text-primary" />
                                                        <span className="text-sm font-medium">{property.area} m²</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFavoritesData } from "@/hooks/useFavoritesData";
import { useFavorites } from "@/hooks/useFavorites";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Heart, House, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/FeaturedProperties";

export default function Favoritos() {
    const { data: properties, setData, loading } = useFavoritesData();
    const { favorites, toggleFavorite } = useFavorites();

    const handleRemove = (id: string) => {
        toggleFavorite(id);
        setData(prev => prev.filter(p => p.id !== id));
    };

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
                                <Card key={i} className="h-[450px] animate-pulse bg-white border-0 shadow-sm rounded-3xl" />
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
                            {properties.map((property, i) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    index={i}
                                    showFavorite={false}
                                    showRemove={true}
                                    onRemove={() => handleRemove(property.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

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

    const handleSendToBroker = () => {
        const phoneNumber = "5511995137769";
        const baseUrl = window.location.origin;

        const propertyLinks = properties.map(p => {
            return `• ${p.title}\nLink: ${baseUrl}/imovel/${p.slug}/${p.id}`;
        }).join('\n\n');

        const message = `Olá! Tenho interesse nesses imóveis dos meus favoritos:\n\n${propertyLinks}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank");
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

                    {favorites.length > 0 && !loading && (
                        <div className="mt-16 flex flex-col items-center bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-4xl mx-auto">
                            <h3 className="text-2xl font-normal text-slate-900 mb-4 text-center">Gostou da sua seleção?</h3>
                            <p className="text-slate-600 mb-8 text-center max-w-md">
                                Envie sua lista de favoritos para nosso especialista e receba um atendimento personalizado para cada um deles.
                            </p>
                            <Button
                                onClick={handleSendToBroker}
                                size="lg"
                                className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-12 h-16 text-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95 gap-3"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.82c1.516.903 3.136 1.379 4.79 1.38h.005c5.305 0 9.623-4.317 9.626-9.626.001-2.571-1.003-4.987-2.83-6.813-1.826-1.828-4.241-2.831-6.813-2.831-5.307 0-9.624 4.318-9.626 9.628-.001 1.705.449 3.371 1.3 4.825l-.999 3.646 3.747-.981zm11.387-5.464c-.301-.15-1.779-.878-2.053-.978-.275-.099-.475-.15-.675.15-.199.3-.775 1.05-.951 1.274-.175.225-.351.225-.651.15-.3-.15-1.271-.47-2.422-1.492" />
                                </svg>
                                Enviar para o Corretor
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

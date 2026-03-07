import { useParams, Link } from "wouter";
import { useProperty } from "@/hooks/useProperty";
import { useFavorites } from "@/hooks/useFavorites";
import { useFavoritesData } from "@/hooks/useFavoritesData";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useMemo, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import {
    BedDouble,
    Maximize2,
    MapPin,
    ChevronLeft,
    ChevronRight,
    X,
    Heart,
    Share2,
    ExternalLink,
    CheckCircle2,
    Calendar,
    PhoneCall,
    Info,
    ArrowUpRight,
    Camera,
    Loader2
} from "lucide-react";

export default function PropertyDetails() {
    const { slug } = useParams();
    const { data: property, loading, error } = useProperty(slug);
    const { toggleFavorite, isFavorite } = useFavorites();
    const { data: favsData } = useFavoritesData();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State to track selected unit for dynamic updates
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: ""
    });

    useEffect(() => {
        if (property && !formData.message) {
            setFormData(prev => ({
                ...prev,
                message: `Olá! Gostaria de mais informações sobre o empreendimento ${property.title} encontrado na ADJ'S Imóveis. Seria possível fornecer detalhes adicionais?`
            }));
        }
    }, [property]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Send e-mail automatically
            await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    favorites: favsData // Send the full property data of favorites
                })
            });

            const phoneNumber = "5511995137769";
            const baseMessage = formData.message;
            const fullMessage = `Nome: ${formData.name}\nTelefone: ${formData.phone}\nE-mail: ${formData.email}\n\nMensagem: ${baseMessage}`;

            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;

            // Redirect to WhatsApp
            window.open(whatsappUrl, "_blank");

            toast.success("Mensagem enviada com sucesso!");
        } catch (err) {
            console.error("Error sending contact:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        // Disable scroll
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        // Re-enable scroll
        document.body.style.overflow = 'unset';
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!displayData) return;
        setCurrentImageIndex((prev) => (prev + 1) % displayData.images.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!displayData) return;
        setCurrentImageIndex((prev) => (prev - 1 + displayData.images.length) % displayData.images.length);
    };


    // Memoized selection logic
    const displayData = useMemo(() => {
        if (!property) return null;

        // If no unit selected, use the property defaults
        if (!selectedUnitId) return {
            price: property.price,
            priceFormatted: property.priceFormatted,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            parkingSlots: property.parkingSlots,
            images: property.images
        };

        const unit = property.units.find(u => u.id === selectedUnitId);
        if (!unit) return null;

        const unitImages = unit.attachments && unit.attachments.length > 0
            ? unit.attachments.map((a: any) => a.url).filter(Boolean)
            : property.images;

        return {
            price: unit.price,
            priceFormatted: unit.price.toLocaleString('pt-BR'),
            bedrooms: unit.bedrooms,
            bathrooms: unit.bathrooms,
            area: unit.livingArea,
            parkingSlots: unit.parkingSlots,
            images: unitImages.length > 0 ? unitImages : property.images
        };
    }, [property, selectedUnitId]);

    // Auto-cycle images if not in lightbox
    useEffect(() => {
        if (lightboxOpen || !displayData || displayData.images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % displayData.images.length);
        }, 5000); // Cycle every 5 seconds

        return () => clearInterval(interval);
    }, [lightboxOpen, displayData?.images.length]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col pt-20 items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-[#d2b589] border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-muted-foreground animate-pulse font-medium">Extraindo informações...</p>
            </div>
        );
    }

    if (error || !property || !displayData) {
        return (
            <div className="min-h-screen flex flex-col pt-20 items-center justify-center container text-center bg-white">
                <h1 className="text-3xl font-bold mb-4">Imóvel não encontrado</h1>
                <p className="text-muted-foreground mb-8">Não conseguimos localizar as informações deste empreendimento.</p>
                <Link href="/comprar">
                    <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 underline-offset-4">Voltar para a busca</Button>
                </Link>
            </div>
        );
    }

    const favorite = isFavorite(property.id);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1">
                {/* Improved Single Image Gallery (Carousel Style) */}
                <div className="relative h-[65vh] md:h-[75vh] bg-slate-900 overflow-hidden group">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={displayData.images[currentImageIndex] || "https://d2xsxph8kpxj0f.cloudfront.net/310519663366689293/jsiKnDEmDWyHsAZxshzkFX/apartment-interior-AsrdjbkKxpBi7u6wHztwSk.webp"}
                            alt={property.title}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full h-full object-cover cursor-pointer transition-transform duration-10000 hover:scale-110"
                            onClick={() => openLightbox(currentImageIndex)}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://d2xsxph8kpxj0f.cloudfront.net/310519663366689293/jsiKnDEmDWyHsAZxshzkFX/apartment-interior-AsrdjbkKxpBi7u6wHztwSk.webp";
                            }}
                        />
                    </AnimatePresence>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

                    {/* Navigation Controls */}
                    <div className="absolute inset-0 flex items-center justify-between p-4 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={prevImage}
                            className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 pointer-events-auto transition-all"
                        >
                            <ChevronLeft className="w-6 h-6 md:w-8 h-8" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={nextImage}
                            className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 pointer-events-auto transition-all"
                        >
                            <ChevronRight className="w-6 h-6 md:w-8 h-8" />
                        </Button>
                    </div>

                    {/* Top Actions (Back and Action Buttons) */}
                    <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
                        <Link href="/comprar">
                            <Button variant="secondary" className="gap-2 shadow-xl bg-white/90 backdrop-blur-sm border-0 hover:bg-white text-slate-900 rounded-full h-11 px-6 text-sm font-bold pointer-events-auto transition-transform hover:scale-105 active:scale-95">
                                <ChevronLeft className="w-5 h-5 text-amber-500" />
                                Voltar
                            </Button>
                        </Link>

                        <div className="flex gap-3 pointer-events-auto">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="bg-white/90 backdrop-blur-sm rounded-full border-0 shadow-xl h-11 w-11 hover:bg-white text-slate-900 transition-all hover:scale-105"
                            >
                                <Share2 className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => toggleFavorite(property.id)}
                                className={`rounded-full border-0 shadow-xl h-11 w-11 transition-all duration-300 hover:scale-105 ${favorite ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-sm text-slate-900 hover:bg-white'}`}
                            >
                                <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                            </Button>
                        </div>
                    </div>

                    {/* Bottom Status/Counter */}
                    <div className="absolute bottom-8 left-6 right-6 z-20 flex justify-between items-end pointer-events-none">
                        <Button
                            onClick={() => openLightbox(0)}
                            className="bg-white/90 backdrop-blur-sm hover:bg-white text-slate-900 border-0 rounded-full h-12 px-8 shadow-2xl gap-3 font-bold pointer-events-auto transition-transform hover:scale-105 active:scale-95"
                        >
                            <Camera className="w-5 h-5 text-amber-500" />
                            Ver todas ({displayData.images.length})
                        </Button>

                        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold tracking-widest border border-white/10">
                            {currentImageIndex + 1} / {displayData.images.length}
                        </div>
                    </div>
                </div>

                {/* Main Content Info */}
                <div className="container py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Details */}
                        <div className="lg:col-span-2 space-y-10">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px]">
                                        {property.status}
                                    </span>
                                    <span className="text-slate-600 text-[10px] font-medium tracking-wider">
                                        REF: {property.id}
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-normal text-slate-900 mb-6 leading-tight font-serif italic">
                                    {property.title}
                                </h1>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-900 text-lg">
                                        <MapPin className="w-5 h-5 text-amber-400" />
                                        <span>{property.neighborhood}, São Paulo - SP</span>
                                    </div>
                                    <div className="pl-7">
                                        <p className="text-sm text-slate-500 font-medium">
                                            {property.address || "Endereço sob consulta"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Icons Row - Exactly as in AoCubo */}
                            <div className="flex flex-wrap gap-x-12 gap-y-6 py-6 border-b border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-amber-500">
                                        <Maximize2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Área</p>
                                        <p className="text-xl font-medium">{displayData.area} m²</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-amber-500">
                                        <BedDouble className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Dormitórios</p>
                                        <p className="text-xl font-medium">{displayData.bedrooms === 0 ? "Studio" : displayData.bedrooms}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-amber-500">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Banheiros</p>
                                        <p className="text-xl font-medium">{displayData.bathrooms}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-amber-500">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Vagas</p>
                                        <p className="text-xl font-medium">{displayData.parkingSlots}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-6 pt-4">
                                <h3 className="text-2xl font-normal text-slate-900 flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Sobre o empreendimento
                                </h3>
                                <div className="text-lg text-slate-600 leading-relaxed font-light whitespace-pre-line">
                                    {property.description || "Descrição em breve..."}
                                </div>
                            </div>

                            {/* Units Table - INTERACTIVE */}
                            <div className="space-y-8 py-8" id="units">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-normal text-slate-900">Opções de Plantas e Preços</h3>
                                </div>

                                <div className="space-y-2">
                                    {property.units.map((unit, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setSelectedUnitId(unit.id);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`flex justify-between items-center p-4 border-b border-slate-100 cursor-pointer transition-all ${selectedUnitId === unit.id ? 'bg-amber-50' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-medium text-slate-900">
                                                    {unit.bedrooms === 0 ? unit.type : `${unit.type} - ${unit.bedrooms} ${unit.bedrooms === 1 ? 'quarto' : 'quartos'}`} - {unit.livingArea}m²
                                                </h4>
                                                <p className="text-slate-700 text-sm font-light">
                                                    R$ {unit.price ? unit.price.toLocaleString('pt-BR') : 'Consulte'}
                                                    {unit.price > 0 && unit.livingArea > 0 && (
                                                        <span className="ml-2 text-slate-500">(R$ {Math.round(unit.price / unit.livingArea).toLocaleString('pt-BR')}/m²)</span>
                                                    )}
                                                </p>
                                            </div>
                                            <ArrowUpRight className={`w-5 h-5 transition-transform ${selectedUnitId === unit.id ? 'text-amber-500 scale-110' : 'text-slate-500 group-hover:text-slate-600'}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="space-y-6 pt-4">
                                <h3 className="text-2xl font-normal text-slate-900">Infraestrutura e Lazer</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {property.characteristics.map((char, i) => (
                                        <div key={i} className="flex items-center gap-3 py-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                            <span className="text-slate-900 text-sm font-medium">{char}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Sticky Price & CTA Panel */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 space-y-6">
                                <Card className="border-0 shadow-xl overflow-hidden rounded-3xl bg-white">
                                    <div className="bg-slate-900 p-8 text-primary">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-80">
                                            {selectedUnitId ? 'UNIDADE SELECIONADA' : 'PREÇO INICIAL'}
                                        </p>
                                        <h2 className="text-4xl font-bold tracking-tight mb-2">
                                            R$ {displayData.priceFormatted}
                                        </h2>
                                        <p className="text-[10px] opacity-60 font-medium italic">
                                            * Valor a partir da unidade mais econômica.
                                        </p>
                                    </div>
                                    <CardContent className="p-8 pb-4 space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-lg text-slate-800 font-serif italic">
                                                <MessageSquare className="w-5 h-5 text-primary" />
                                                <span>Envie uma mensagem</span>
                                            </div>

                                            <form onSubmit={handleFormSubmit} className="space-y-3">
                                                <Input
                                                    placeholder="Nome"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                    className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary/20"
                                                />
                                                <Input
                                                    placeholder="Celular"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    required
                                                    className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary/20"
                                                />
                                                <Input
                                                    placeholder="Email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                    className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary/20"
                                                />
                                                <Textarea
                                                    placeholder="Sua mensagem"
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    required
                                                    className="min-h-32 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary/20 p-5 resize-none"
                                                />
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full h-14 bg-slate-900 text-white hover:bg-slate-800 border-0 font-bold text-lg rounded-full flex items-center justify-center gap-3 shadow-xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-95 group"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span>Enviando...</span>
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Enviar mensagem</span>
                                                            <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                        </>
                                                    )}
                                                </Button>
                                            </form>

                                            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                                                Ao enviar mensagem você concorda com os <Link href="/termos"><span className="underline text-inherit cursor-pointer">termos de uso</span></Link> e <Link href="/privacidade"><span className="underline text-inherit cursor-pointer">política de privacidade</span></Link> e confirma ter mais de 18 anos.
                                            </p>
                                        </div>



                                        <div className="pt-8 border-t border-slate-50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center font-bold text-[#d2b589] overflow-hidden text-xs">
                                                    ADJ
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm">Consultoria ADJ'S Imóveis</p>
                                                    <p className="text-[10px] text-slate-600 font-medium">Registro CRECI 212875-F</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Fullscreen Lightbox Modal */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-slate-900/95 flex flex-col items-center justify-center animate-in fade-in duration-300"
                    onClick={closeLightbox}
                >
                    {/* Header/Controls */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/50 to-transparent">
                        <div className="text-white font-medium">
                            {currentImageIndex + 1} / {displayData.images.length}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={closeLightbox}
                            className="text-white hover:bg-white/10 rounded-full h-12 w-12"
                        >
                            <X className="w-8 h-8" />
                        </Button>
                    </div>

                    {/* Main Image View */}
                    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 overflow-hidden">
                        {/* Left Arrow */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={prevImage}
                            className="absolute left-4 md:left-8 z-[110] text-white hover:bg-white/10 rounded-full h-14 w-14 md:h-20 md:w-20 flex items-center justify-center transition-all bg-black/20 backdrop-blur-sm"
                        >
                            <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
                        </Button>

                        <img
                            src={displayData.images[currentImageIndex]}
                            className="max-w-full max-h-full object-contain shadow-2xl transition-all duration-500 animate-in zoom-in-95"
                            alt={`Slide ${currentImageIndex}`}
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Right Arrow */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={nextImage}
                            className="absolute right-4 md:right-8 z-[110] text-white hover:bg-white/10 rounded-full h-14 w-14 md:h-20 md:w-20 flex items-center justify-center transition-all bg-black/20 backdrop-blur-sm"
                        >
                            <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
                        </Button>
                    </div>

                    {/* Thumbnail Strip (Optional, for desktop) */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-2 overflow-x-auto bg-gradient-to-t from-black/50 to-transparent">
                        {displayData.images.map((img, i) => (
                            <div
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                                className={`w-16 h-12 rounded overflow-hidden cursor-pointer transition-all border-2 ${currentImageIndex === i ? 'border-amber-400 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt="" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

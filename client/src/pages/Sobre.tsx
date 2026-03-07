import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle, Award, Users, TrendingUp, Phone } from "lucide-react";

export default function Sobre() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1">
                {/* Hero Section - Mirroring Home Page Style */}
                <section
                    className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center py-20"
                    style={{
                        backgroundImage: 'url(/sobre-bg.png)',
                        backgroundAttachment: 'fixed',
                    }}
                >
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"></div>
                    <div className="relative z-10 container max-w-5xl mx-auto px-4 text-center">
                        <h1 className="text-white text-5xl md:text-8xl mb-8 leading-tight font-serif italic drop-shadow-2xl">
                            Sobre a ADJ's Imóveis
                        </h1>
                        <p className="text-white/90 text-lg md:text-2xl mb-12 font-light max-w-3xl mx-auto drop-shadow-md tracking-wide">
                            Experiência, confiança e oportunidades que transformam vidas em São Paulo.
                        </p>

                        {/* Glassmorphism Highlight Card */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl max-w-3xl mx-auto border border-white/20">
                            <p className="text-white text-xl md:text-2xl font-light leading-relaxed italic">
                                "Com mais de uma década de atuação, conectamos pessoas às melhores oportunidades do mercado imobiliário."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-32 bg-white">
                    <div className="container px-4 max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-10">
                                <div className="inline-block px-5 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">
                                    Nossa Essência
                                </div>
                                <h2 className="text-4xl md:text-6xl font-light text-slate-900 leading-tight">
                                    Uma década de <span className="font-serif italic text-primary">referência</span> no setor
                                </h2>
                                <div className="space-y-8 text-xl text-slate-600 leading-relaxed font-light">
                                    <p>
                                        A <span className="font-semibold text-slate-900 uppercase tracking-tighter">ADJ's Imóveis</span> se consolidou como uma referência em intermediação e consultoria imobiliária em São Paulo.
                                    </p>
                                    <p>
                                        Oferecemos um atendimento diferenciado para clientes que buscam segurança, transparência e as melhores oportunidades do mercado.
                                    </p>
                                    <p>
                                        Nossa trajetória é construída sobre confiança e profundo conhecimento do setor, permitindo identificar imóveis que realmente atendem às suas expectativas.
                                    </p>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-6 bg-slate-100/50 rounded-[3rem] -z-10 group-hover:bg-slate-100 transition-colors duration-500"></div>
                                <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-200/50 shadow-2xl">
                                    <div className="grid grid-cols-2 gap-12">
                                        <div className="space-y-5">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 transition-transform">
                                                <Award className="w-7 h-7 text-slate-900" />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900">Expertise</h4>
                                            <div className="w-8 h-0.5 bg-primary/30"></div>
                                            <p className="text-sm text-slate-500 leading-relaxed font-light">+10 anos de mercado especializado</p>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 transition-transform">
                                                <CheckCircle className="w-7 h-7 text-slate-900" />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900">Segurança</h4>
                                            <div className="w-8 h-0.5 bg-primary/30"></div>
                                            <p className="text-sm text-slate-500 leading-relaxed font-light">Acompanhamento jurídico em cada etapa</p>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 transition-transform">
                                                <Users className="w-7 h-7 text-slate-900" />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900">Exclusividade</h4>
                                            <div className="w-8 h-0.5 bg-primary/30"></div>
                                            <p className="text-sm text-slate-500 leading-relaxed font-light">Curadoria premium selecionada a dedo</p>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 transition-transform">
                                                <TrendingUp className="w-7 h-7 text-slate-900" />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900">Valorização</h4>
                                            <div className="w-8 h-0.5 bg-primary/30"></div>
                                            <p className="text-sm text-slate-500 leading-relaxed font-light">Foco estratégico em retorno sólido</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Experience Visual Section */}
                <section className="py-40 bg-slate-950 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-500 rounded-full blur-[150px]"></div>
                    </div>

                    <div className="container px-4 max-w-6xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                            <div className="relative order-2 lg:order-1">
                                <img
                                    src="/sobre-visual.png"
                                    alt="Luxury Interior"
                                    className="rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative z-10 border border-white/5 grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                                />
                                <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[2rem] shadow-2xl hidden md:block z-20 border border-slate-100">
                                    <div className="text-5xl font-serif italic text-slate-950 mb-2">10+</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Anos de Excelência</div>
                                </div>
                            </div>
                            <div className="space-y-12 order-1 lg:order-2">
                                <h3 className="text-4xl md:text-6xl font-light text-white leading-tight">
                                    Conectando histórias a <span className="font-serif italic text-white/50">novos começos</span>
                                </h3>
                                <div className="space-y-8 text-slate-400 text-xl font-light leading-relaxed">
                                    <p>
                                        Acreditamos que cada imóvel representa mais do que um negócio: representa histórias, conquistas e novos capítulos.
                                    </p>
                                    <p>
                                        Cada cliente é atendido de forma <span className="text-white font-medium italic">exclusiva e personalizada</span>, com acompanhamento completo em todas as etapas — desde a escolha até a finalização da negociação.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <Button asChild className="h-16 px-10 bg-white text-slate-900 hover:bg-slate-100 text-lg font-bold rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95">
                                        <Link href="/comprar">Explorar Oportunidades</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Commitment Section */}
                <section className="py-32 bg-white">
                    <div className="container px-4 max-w-5xl mx-auto text-center space-y-20">
                        <div className="space-y-6">
                            <div className="w-16 h-1 bg-slate-200 mx-auto"></div>
                            <h3 className="text-4xl md:text-5xl font-light text-slate-900">
                                Nosso <span className="font-serif italic text-primary">Compromisso</span>
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <div className="bg-slate-50 p-16 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 group">
                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-10 mx-auto shadow-md group-hover:rotate-12 transition-transform">
                                    <TrendingUp className="w-8 h-8 text-slate-900" />
                                </div>
                                <p className="text-2xl text-slate-600 font-light italic leading-relaxed">
                                    "Mais do que vender imóveis, nosso compromisso é conectar pessoas às melhores oportunidades, seja para moradia ou investimento."
                                </p>
                            </div>
                            <div className="bg-slate-50 p-16 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 group">
                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-10 mx-auto shadow-md group-hover:-rotate-12 transition-transform">
                                    <Phone className="w-8 h-8 text-slate-900" />
                                </div>
                                <h4 className="text-2xl text-slate-900 font-bold mb-6">Pronto para começar?</h4>
                                <Button asChild variant="outline" className="h-14 px-8 border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white text-base font-bold rounded-2xl transition-all">
                                    <a href="https://wa.me/5511995137769" target="_blank" rel="noopener noreferrer">
                                        Falar com Especialista
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

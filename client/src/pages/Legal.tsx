import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "wouter";

interface LegalContent {
    title: string;
    lastUpdated: string;
    sections: {
        heading?: string;
        content: string | string[];
    }[];
}

const CONTENT: Record<string, LegalContent> = {
    privacidade: {
        title: "Política de Privacidade",
        lastUpdated: "07 de Março de 2026",
        sections: [
            {
                content: "A sua privacidade é importante para nós. É política da ADJ'S Imóveis respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site ADJ'S Imóveis, e outros sites que possuímos e operamos."
            },
            {
                heading: "1. Coleta de Informações",
                content: [
                    "Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.",
                    "Coletamos informações de identificação pessoal, como nome, e-mail e telefone, via preenchimento de formulários para contato ou através do login via Google/Supabase para salvar seus imóveis favoritos."
                ]
            },
            {
                heading: "2. Uso das Informações",
                content: "Usamos as informações coletadas para processar seus pedidos de informações sobre imóveis, personalizar sua experiência de navegação e, quando autorizado, enviar comunicações de marketing. No caso da função 'Comprar' (WhatsApp), enviamos apenas os links dos imóveis que você selecionou como favoritos para facilitar o atendimento."
            },
            {
                heading: "3. Retenção de Dados",
                content: "Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, os protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados."
            },
            {
                heading: "4. Compartilhamento de Dados",
                content: "Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei ou para garantir a prestação do serviço solicitado (ex: enviar sua intenção de compra ao corretor responsável)."
            },
            {
                heading: "5. Direitos do Usuário (LGPD)",
                content: "Em conformidade com a LGPD, você tem o direito de acessar, corrigir, anonimizar ou excluir seus dados pessoais a qualquer momento. Para exercer esses direitos, entre em contato através do e-mail contato@adjsimoveis.com.br."
            }
        ]
    },
    termos: {
        title: "Termos de Uso",
        lastUpdated: "07 de Março de 2026",
        sections: [
            {
                heading: "1. Aceitação dos Termos",
                content: "Ao acessar o site ADJ'S Imóveis, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site."
            },
            {
                heading: "2. Uso de Licença",
                content: "É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site ADJ'S Imóveis , apenas para visualização transitória pessoal e não comercial."
            },
            {
                heading: "3. Isenção de Responsabilidade",
                content: [
                    "Os materiais no site da ADJ'S Imóveis são fornecidos 'como estão'. ADJ'S Imóveis não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias.",
                    "As informações sobre os imóveis (preços, disponibilidade, metragens) são integradas via API e podem sofrer alterações sem aviso prévio. A ADJ'S Imóveis não garante que todas as informações estejam atualizadas em tempo real, servindo os dados como uma curadoria preliminar."
                ]
            },
            {
                heading: "4. Limitações",
                content: "Em nenhum caso a ADJ'S Imóveis ou seus fornecedores serão responsáveis por quaisquer danos decorrentes do uso ou da incapacidade de usar os materiais no site."
            },
            {
                heading: "5. Links Externos",
                content: "A ADJ'S Imóveis não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso pela ADJ'S Imóveis do site."
            }
        ]
    },
    cookies: {
        title: "Política de Cookies",
        lastUpdated: "07 de Março de 2026",
        sections: [
            {
                heading: "O que são cookies?",
                content: "Como é prática comum em quase todos os sites profissionais, este site usa cookies, que são pequenos arquivos baixados no seu computador, para melhorar sua experiência."
            },
            {
                heading: "Como usamos os cookies?",
                content: [
                    "Utilizamos cookies para diversas finalidades, incluindo manter você logado, salvar suas preferências de favoritos e analisar como os usuários interagem com nosso site através de ferramentas de terceiros (como Vercel Analytics).",
                    "A desativação de cookies geralmente resultará na desativação de certas funcionalidades e recursos deste site (como a capacidade de salvar favoritos)."
                ]
            },
            {
                heading: "Tipos de Cookies que Definimos",
                content: [
                    "Cookies relacionados à conta: Se você criar uma conta connosco, usaremos cookies para o gerenciamento do processo de inscrição e administração geral.",
                    "Cookies de login: Utilizamos cookies quando você está logado para que possamos lembrar dessa ação.",
                    "Cookies de terceiros: Em alguns casos especiais, também usamos cookies fornecidos por terceiros confiáveis para métricas de desempenho e segurança."
                ]
            },
            {
                heading: "Mais informações",
                content: "Esperamos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site."
            }
        ]
    }
};

export default function Legal() {
    const [location] = useLocation();

    // Determine which content to show based on URL
    let type = "privacidade";
    if (location.includes("/termos")) type = "termos";
    if (location.includes("/cookies")) type = "cookies";

    const data = CONTENT[type] || CONTENT.privacidade;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1 py-20 md:py-32">
                <div className="container max-w-4xl">
                    <header className="mb-16 border-b border-slate-100 pb-12">
                        <h1 className="text-4xl md:text-6xl font-light text-foreground mb-6 tracking-tight">
                            {data.title}
                        </h1>
                        <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-xs">
                            Última atualização: {data.lastUpdated}
                        </p>
                    </header>

                    <div className="prose prose-slate prose-lg max-w-none">
                        {data.sections.map((section, idx) => (
                            <section key={idx} className="mb-12">
                                {section.heading && (
                                    <h2 className="text-2xl font-normal text-foreground mb-6">
                                        {section.heading}
                                    </h2>
                                )}
                                {Array.isArray(section.content) ? (
                                    section.content.map((p, pIdx) => (
                                        <p key={pIdx} className="text-slate-600 leading-relaxed mb-4">
                                            {p}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-slate-600 leading-relaxed">
                                        {section.content}
                                    </p>
                                )}
                            </section>
                        ))}
                    </div>

                    <div className="mt-20 pt-12 border-t border-slate-100 text-center">
                        <p className="text-slate-400 text-sm">
                            Em caso de dúvidas sobre nossos documentos legais, entre em contato pelo e-mail <br />
                            <a href="mailto:contato@adjsimoveis.com.br" className="text-primary font-medium hover:underline">contato@adjsimoveis.com.br</a>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

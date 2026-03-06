import { Search, Filter, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Encontre",
      description: "Explore a mais ampla oferta de novas construções em São Paulo com filtros avançados e dados em tempo real.",
    },
    {
      icon: Filter,
      title: "Compare",
      description: "Utilize nossa análise de dados para comparar imóveis, localidades e potencial de valorização.",
    },
    {
      icon: CheckCircle,
      title: "Compre",
      description: "Finalize sua compra com segurança, transparência e atendimento personalizado de especialistas.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-foreground mb-6">
            Como funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compre com mais facilidade e certeza através de nossa plataforma inteligente e segura.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                {/* Icon Circle */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Divider Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-12 h-0.5 bg-border transform translate-x-1/2 -translate-y-1/2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

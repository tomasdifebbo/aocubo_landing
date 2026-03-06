import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="/adjs-logo.jpg" alt="ADJ'S Imóveis" className="h-12 md:h-14 w-auto drop-shadow-sm" />
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/">
            <span className="text-sm text-foreground hover:text-primary transition-colors cursor-pointer">
              Início
            </span>
          </Link>
          <Link href="/comprar">
            <span className="text-sm text-foreground hover:text-primary transition-colors cursor-pointer">
              Imóveis
            </span>
          </Link>
          <Link href="/favoritos">
            <span className="text-sm text-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5">
              Favoritos
            </span>
          </Link>
          <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">
            Sobre
          </a>
          <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">
            Contato
          </a>
        </nav>

        {/* CTA Button */}
        <Link href="/comprar">
          <Button
            className="bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Buscar Imóveis
          </Button>
        </Link>
      </div>
    </header>
  );
}

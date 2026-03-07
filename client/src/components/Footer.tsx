import { Linkedin, Youtube, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-16 md:py-24">
      <div className="container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/adjs-logo.jpg" alt="ADJ'S Imóveis" className="h-10 w-auto" />
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              Transformando a forma como você compra imóveis através de tecnologia, transparência e excelência.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Navegação</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <span className="text-white/90 hover:text-primary transition-colors cursor-pointer">Início</span>
                </Link>
              </li>
              <li>
                <Link href="/comprar">
                  <span className="text-white/90 hover:text-primary transition-colors cursor-pointer">Imóveis</span>
                </Link>
              </li>
              <li>
                <Link href="/sobre">
                  <span className="text-white/90 hover:text-primary transition-colors cursor-pointer">Sobre</span>
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:contato@adjsimoveis.com.br" className="text-white/90 hover:text-primary transition-colors">
                  contato@adjsimoveis.com.br
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+5511953296486" className="text-white/90 hover:text-primary transition-colors">
                  (11) 95329-6486
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-white/90">São Paulo, SP</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Bottom Links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-4 text-sm text-white/90">
              <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-primary transition-colors">Política de Cookies</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-white/70">
            <p>&copy; 2026 ADJ'S Imóveis. Todos os direitos reservados. CRECI-SP 212875-F</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

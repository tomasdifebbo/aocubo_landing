import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { UserCircle, LogOut, Settings, Heart, Menu, Home, Building2, Info, Phone, Mail, ShoppingCart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useFavoritesData } from "@/hooks/useFavoritesData";
import { toast } from "sonner";

export default function Header() {
  const { user, signOut, authModal, openLogin, openRegister, closeAuth, setAuthModalMode } = useAuth();
  const { favorites } = useFavorites();
  const { data: favsData } = useFavoritesData();

  const handleComprar = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      openLogin();
      return;
    }

    if (favorites.length === 0) {
      toast("Sua lista está vazia", {
        description: "Favorite pelo menos um imóvel para solicitar um orçamento.",
        icon: <Heart className="w-5 h-5 text-red-500 fill-current" />,
      });
      return;
    }

    if (favsData.length === 0) {
      toast.loading("Resgatando informações dos seus favoritos...");
      return;
    }

    // Send favorites via WhatsApp
    const phoneNumber = "5511995137769";
    const links = favsData.map(f => `• ${f.title}\n  https://adjsimoveis.vercel.app/imovel/${f.slug}/${f.id}`).join("\n\n");
    const message = `Olá! Tenho interesse nos seguintes imóveis favoritos:\n\n${links}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const toggleMode = () => setAuthModalMode(authModal.mode === "login" ? "register" : "login");
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
          <Link href="/sobre">
            <span className="text-sm text-foreground hover:text-primary transition-colors cursor-pointer">
              Sobre
            </span>
          </Link>
          <a href="https://wa.me/5511995137769" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-primary transition-colors">
            Contato
          </a>
        </nav>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle className="w-6 h-6 text-slate-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/favoritos">
                  <DropdownMenuItem className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favoritos</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={openLogin}
            >
              <UserCircle className="w-6 h-6 text-slate-700" />
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-slate-50 transition-colors">
                <Menu className="w-7 h-7 text-slate-900" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0 border-0 flex flex-col bg-white">
              {/* Header with Logo */}
              <div className="p-6 border-b border-slate-50">
                <Link href="/">
                  <div className="flex items-center gap-3 cursor-pointer">
                    <img src="/adjs-logo.jpg" alt="ADJ'S Imóveis" className="h-10 w-auto" />
                    <SheetTitle className="text-lg font-serif italic text-slate-900 leading-tight">ADJ's Imóveis</SheetTitle>
                  </div>
                </Link>
              </div>

              {/* Navigation Section */}
              <div className="flex-1 py-4">
                <div className="px-4">
                  <p className="px-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Navegação</p>
                  <nav className="flex flex-col gap-1">
                    <Link href="/">
                      <div className="flex items-center gap-4 px-4 py-2.5 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                          <Home className="w-4 h-4 text-slate-600 group-hover:text-primary" />
                        </div>
                        <span className="text-base font-medium text-slate-700 group-hover:text-slate-950">Início</span>
                      </div>
                    </Link>

                    <Link href="/comprar">
                      <div className="flex items-center gap-4 px-4 py-2.5 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                          <Building2 className="w-4 h-4 text-slate-600 group-hover:text-primary" />
                        </div>
                        <span className="text-base font-medium text-slate-700 group-hover:text-slate-950">Imóveis</span>
                      </div>
                    </Link>

                    <div className="flex items-center gap-4 px-4 py-2.5 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer" onClick={handleComprar}>
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                        <ShoppingCart className="w-4 h-4 text-slate-600 group-hover:text-primary" />
                      </div>
                      <span className="text-base font-medium text-slate-700 group-hover:text-slate-950">Comprar</span>
                    </div>

                    <Link href="/favoritos">
                      <div className="flex items-center gap-4 px-4 py-2.5 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                          <Heart className="w-4 h-4 text-slate-600 group-hover:text-primary" />
                        </div>
                        <span className="text-base font-medium text-slate-700 group-hover:text-slate-950">Favoritos</span>
                      </div>
                    </Link>

                    <Link href="/sobre">
                      <div className="flex items-center gap-4 px-4 py-2.5 rounded-2xl hover:bg-slate-50 transition-all group cursor-pointer">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                          <Info className="w-4 h-4 text-slate-600 group-hover:text-primary" />
                        </div>
                        <span className="text-base font-medium text-slate-700 group-hover:text-slate-950">Sobre</span>
                      </div>
                    </Link>
                  </nav>
                </div>
              </div>

              {/* Bottom Contact Section */}
              <div className="p-6 bg-slate-50 mt-auto">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Fale Conosco</p>
                <div className="space-y-3">
                  <a href="https://wa.me/5511995137769" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">WhatsApp</p>
                      <p className="text-xs font-bold text-slate-900">(11) 99513-7769</p>
                    </div>
                  </a>

                  <a href="mailto:contato@adjsimoveis.com.br" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">E-mail</p>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">contato@adjsimoveis.com.br</p>
                    </div>
                  </a>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  {!user ? (
                    <Button onClick={openRegister} className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-10 text-sm font-bold shadow-lg">
                      Criar Conta
                    </Button>
                  ) : (
                    <Button onClick={signOut} variant="outline" className="w-full border-red-100 text-red-600 hover:bg-red-50 rounded-xl h-10 text-sm font-bold">
                      Sair da Conta
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* CTA Button / User Menu (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleComprar}
            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer mr-4"
          >
            Comprar
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle className="w-6 h-6 text-slate-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/favoritos">
                  <DropdownMenuItem className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favoritos</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-sm hidden sm:block"
                onClick={openLogin}
              >
                Entrar
              </Button>
              <Button
                className="bg-slate-900 text-white hover:bg-slate-800"
                onClick={openRegister}
              >
                Criar Conta
              </Button>
            </div>
          )}
        </div>

        <AuthModal
          isOpen={authModal.open}
          onClose={closeAuth}
          mode={authModal.mode}
          onSwitchMode={toggleMode}
        />
      </div>
    </header>
  );
}

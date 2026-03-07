import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Shield, Bell, Save, Loader2, Lock, Smartphone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useLocation } from "wouter";

type Tab = "perfil" | "notificacoes" | "seguranca";

export default function Configuracoes() {
    const { user } = useAuth();
    const [location, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState<Tab>("perfil");
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (!user && !loading) {
            setLocation("/");
        }
        if (user) {
            setFullName(user.user_metadata?.full_name || "");
        }
    }, [user, setLocation, loading]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (error) throw error;
            toast.success("Perfil atualizado com sucesso!");
        } catch (error: any) {
            toast.error(error.message || "Erro ao atualizar perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("As senhas não coincidem");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;
            toast.success("Senha atualizada com sucesso!");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error(error.message || "Erro ao atualizar senha");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-12 md:py-20 animate-in fade-in duration-500">
                <div className="container max-w-4xl">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4 tracking-tight">Configurações</h1>
                        <p className="text-lg text-slate-600 font-light">
                            Gerencie suas informações pessoais e preferências de conta.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Sidebar */}
                        <aside className="md:col-span-1 space-y-2">
                            <Button
                                variant="ghost"
                                onClick={() => setActiveTab("perfil")}
                                className={`w-full justify-start gap-3 rounded-2xl transition-all ${activeTab === "perfil" ? "bg-white shadow-sm font-semibold text-primary" : "text-slate-500 hover:bg-white/50"}`}
                            >
                                <User className={`w-4 h-4 ${activeTab === "perfil" ? "text-primary" : "text-slate-400"}`} />
                                Perfil
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setActiveTab("notificacoes")}
                                className={`w-full justify-start gap-3 rounded-2xl transition-all ${activeTab === "notificacoes" ? "bg-white shadow-sm font-semibold text-primary" : "text-slate-500 hover:bg-white/50"}`}
                            >
                                <Bell className={`w-4 h-4 ${activeTab === "notificacoes" ? "text-primary" : "text-slate-400"}`} />
                                Notificações
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setActiveTab("seguranca")}
                                className={`w-full justify-start gap-3 rounded-2xl transition-all ${activeTab === "seguranca" ? "bg-white shadow-sm font-semibold text-primary" : "text-slate-500 hover:bg-white/50"}`}
                            >
                                <Shield className={`w-4 h-4 ${activeTab === "seguranca" ? "text-primary" : "text-slate-400"}`} />
                                Segurança
                            </Button>
                        </aside>

                        {/* Content */}
                        <div className="md:col-span-2 space-y-8">
                            {activeTab === "perfil" && (
                                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                    <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
                                        <CardHeader className="bg-white border-b border-slate-50 p-8">
                                            <CardTitle className="text-xl font-medium">Informações do Perfil</CardTitle>
                                            <CardDescription>
                                                Estas informações serão usadas para personalizar seu atendimento.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-6 bg-white">
                                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-sm font-medium text-slate-700">Nome Completo</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="name"
                                                            value={fullName}
                                                            onChange={(e) => setFullName(e.target.value)}
                                                            className="pl-10 h-11 border-slate-100 bg-slate-50 rounded-xl focus:ring-primary/20"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">E-mail</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="email"
                                                            value={user.email}
                                                            disabled
                                                            className="pl-10 h-11 border-slate-100 bg-slate-100 rounded-xl opacity-70 cursor-not-allowed"
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-slate-400">O e-mail não pode ser alterado por aqui.</p>
                                                </div>

                                                <div className="pt-4 flex justify-end">
                                                    <Button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 h-11 shadow-lg flex items-center gap-2"
                                                    >
                                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                        Salvar Alterações
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-red-50/30 border-red-100/20">
                                        <CardContent className="p-8 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-red-900 font-medium mb-1 text-base">Zona de Perigo</h3>
                                                <p className="text-red-700/70 text-sm">Excluir permanentemente sua conta e todos os dados salvos.</p>
                                            </div>
                                            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                                                Excluir Conta
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {activeTab === "notificacoes" && (
                                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                    <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
                                        <CardHeader className="bg-white border-b border-slate-50 p-8">
                                            <CardTitle className="text-xl font-medium">Preferências de Contato</CardTitle>
                                            <CardDescription>
                                                Escolha como você deseja receber novidades da ADJ'S Imóveis.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-8 bg-white">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base font-medium">E-mails de Marketing</Label>
                                                    <p className="text-sm text-slate-500">Receba curadorias exclusivas e novos lançamentos.</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base font-medium">Alertas de Preço</Label>
                                                    <p className="text-sm text-slate-500">Notificar quando um imóvel favorito baixar de preço.</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base font-medium">WhatsApp</Label>
                                                    <p className="text-sm text-slate-500">Permitir que corretores entrem em contato via WhatsApp.</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>

                                            <div className="pt-4 flex justify-end">
                                                <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 h-11">
                                                    Salvar Preferências
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {activeTab === "seguranca" && (
                                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                    <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
                                        <CardHeader className="bg-white border-b border-slate-50 p-8">
                                            <CardTitle className="text-xl font-medium">Segurança da Conta</CardTitle>
                                            <CardDescription>
                                                Atualize sua senha para manter sua conta segura.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-6 bg-white">
                                            <form onSubmit={handleUpdatePassword} className="space-y-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-pass" className="text-sm font-medium">Nova Senha</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="new-pass"
                                                            type="password"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            className="pl-10 h-11 border-slate-100 bg-slate-50 rounded-xl focus:ring-primary/20"
                                                            placeholder="Mínimo 6 caracteres"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirm-pass" className="text-sm font-medium">Confirmar Nova Senha</Label>
                                                    <div className="relative">
                                                        <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="confirm-pass"
                                                            type="password"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className="pl-10 h-11 border-slate-100 bg-slate-50 rounded-xl focus:ring-primary/20"
                                                            placeholder="Repita a nova senha"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="pt-4 flex justify-end">
                                                    <Button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 h-11 flex items-center gap-2"
                                                    >
                                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                                        Alterar Senha
                                                    </Button>
                                                </div>
                                            </form>

                                            <div className="mt-8 pt-8 border-t border-slate-100">
                                                <h4 className="text-sm font-semibold mb-4">Autenticação em Duas Etapas</h4>
                                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                            <Smartphone className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">Proteção via SMS</p>
                                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Desativado</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" className="text-primary font-bold hover:bg-white">Ativar</Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

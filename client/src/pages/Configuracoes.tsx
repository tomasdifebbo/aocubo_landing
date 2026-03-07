import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield, Bell, Save, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Configuracoes() {
    const { user } = useAuth();
    const [location, setLocation] = useLocation();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");

    useEffect(() => {
        if (!user && !loading) {
            setLocation("/");
        }
        if (user) {
            setFullName(user.user_metadata?.full_name || "");
        }
    }, [user, setLocation]);

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

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1 py-12 md:py-20">
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
                            <Button variant="ghost" className="w-full justify-start gap-3 bg-white shadow-sm font-medium">
                                <User className="w-4 h-4 text-primary" />
                                Perfil
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 opacity-60 cursor-not-allowed">
                                <Bell className="w-4 h-4" />
                                Notificações
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 opacity-60 cursor-not-allowed">
                                <Shield className="w-4 h-4" />
                                Segurança
                            </Button>
                        </aside>

                        {/* Content */}
                        <div className="md:col-span-2 space-y-8">
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
                                        <h3 className="text-red-900 font-medium mb-1">Zona de Perigo</h3>
                                        <p className="text-red-700/70 text-sm">Excluir permanentemente sua conta e todos os dados salvos.</p>
                                    </div>
                                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                                        Excluir Conta
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

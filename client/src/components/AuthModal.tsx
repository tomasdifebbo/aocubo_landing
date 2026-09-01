import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Mail, Lock, User, Loader2, Eye, EyeOff, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";

export type AuthMode = "login" | "register" | "forgot_password" | "update_password";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: AuthMode;
    onSwitchMode: () => void;
}

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
    const [view, setView] = useState<AuthMode>(mode);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setView(mode);
            setShowPassword(false);
            setPassword("");
            setNewPassword("");
            setEmailSent(false);
            setLoading(false);
        }
    }, [isOpen, mode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (view === "register") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                toast.success("Cadastro realizado! Verifique seu e-mail.");
                onClose();
            } else if (view === "login") {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success("Login realizado com sucesso!");
                onClose();
            } else if (view === "forgot_password") {
                const cleanEmail = email.trim().toLowerCase();
                const redirectUrl = window.location.origin.endsWith('/')
                    ? window.location.origin
                    : `${window.location.origin}/`;

                const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
                    redirectTo: redirectUrl,
                });
                if (error) {
                    console.error("Supabase resetPasswordForEmail error:", error);
                    const msg = (error.message || "").toLowerCase();
                    if (msg.includes("rate limit") || msg.includes("rate_limit") || error.status === 429) {
                        toast.error("Limite temporário de envios de e-mail atingido no Supabase. Aguarde alguns minutos ou verifique sua caixa de entrada/spam.");
                    } else if (msg.includes("60 seconds") || msg.includes("security purposes")) {
                        toast.error("Por segurança, aguarde 60 segundos antes de solicitar um novo e-mail.");
                    } else {
                        toast.error(error.message || "Não foi possível enviar o e-mail.");
                    }
                    throw error;
                }
                setEmailSent(true);
                toast.success("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
            } else if (view === "update_password") {
                const { error } = await supabase.auth.updateUser({
                    password: newPassword,
                });
                if (error) throw error;
                toast.success("Senha atualizada com sucesso!");
                onClose();
            }
        } catch (error: any) {
            toast.error(error.message || "Ocorreu um erro. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        switch (view) {
            case "login":
                return "Acesse sua conta";
            case "register":
                return "Crie seu perfil";
            case "forgot_password":
                return "Redefinir senha";
            case "update_password":
                return "Criar nova senha";
        }
    };

    const getDescription = () => {
        switch (view) {
            case "login":
                return "Entre para ver seus imóveis favoritados em qualquer lugar.";
            case "register":
                return "Comece agora para salvar e gerenciar seus imóveis favoritos.";
            case "forgot_password":
                return "Informe seu e-mail cadastrado e enviaremos um link de redefinição.";
            case "update_password":
                return "Digite sua nova senha abaixo para atualizar seu acesso.";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-slate-900">
                        {getTitle()}
                    </DialogTitle>
                    <DialogDescription>
                        {getDescription()}
                    </DialogDescription>
                </DialogHeader>

                {view === "forgot_password" && emailSent ? (
                    <div className="space-y-4 py-4 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-slate-900">E-mail enviado com sucesso!</h4>
                            <p className="text-sm text-slate-500">
                                Enviamos as instruções de redefinição para <strong className="text-slate-700">{email}</strong>. Por favor, confira sua caixa de entrada e o spam.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => {
                                setEmailSent(false);
                                setView("login");
                            }}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o login
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        {view === "register" && (
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="João Silva"
                                        className="pl-9"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {(view === "login" || view === "register" || view === "forgot_password") && (
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="exemplo@email.com"
                                        className="pl-9"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {(view === "login" || view === "register") && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Senha</Label>
                                    {view === "login" && (
                                        <button
                                            type="button"
                                            onClick={() => setView("forgot_password")}
                                            className="text-xs text-slate-500 hover:text-slate-900 font-medium hover:underline transition-colors"
                                        >
                                            Esqueceu a senha?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-9 pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {view === "update_password" && (
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Nova Senha</Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="new-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Digite sua nova senha"
                                        className="pl-9 pr-10"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        minLength={6}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-slate-900 text-white hover:bg-slate-800 h-11"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {view === "login" && "Entrar"}
                            {view === "register" && "Criar Conta"}
                            {view === "forgot_password" && "Enviar e-mail de redefinição"}
                            {view === "update_password" && "Salvar nova senha"}
                        </Button>

                        {view === "register" && (
                            <p className="text-[10px] text-slate-500 text-center leading-relaxed mt-2">
                                Ao criar conta você concorda com os <Link href="/termos"><span className="underline text-inherit cursor-pointer">termos de uso</span></Link> e <Link href="/privacidade"><span className="underline text-inherit cursor-pointer">política de privacidade</span></Link>.
                            </p>
                        )}
                    </form>
                )}

                {view === "forgot_password" && !emailSent && (
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => setView("login")}
                            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar para o login
                        </button>
                    </div>
                )}

                {(view === "login" || view === "register") && (
                    <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">
                            {view === "login" ? "Ainda não tem conta?" : "Já possui conta?"}
                        </span>{" "}
                        <button
                            type="button"
                            onClick={onSwitchMode}
                            className="text-primary font-semibold hover:underline"
                        >
                            {view === "login" ? "Cadastre-se" : "Entrar agora"}
                        </button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}


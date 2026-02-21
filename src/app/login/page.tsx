/**
 * src/app/login/page.tsx
 * Página de login temática do Portal das Quatro Nações
 */
"use client";

import { useState, useTransition } from "react";
import { loginUser } from "@/lib/actions/auth";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
    const [erro, setErro] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErro(null);

        const formData = new FormData(e.currentTarget);
        // Adicionar callbackUrl no formData não é usado pelo action diretamente,
        // o redirect é feito dentro do action

        startTransition(async () => {
            const resultado = await loginUser(formData);
            // Se chegou aqui foi erro (pois sucesso joga exception de redirect)
            if (resultado && !resultado.success) {
                setErro(resultado.error);
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0a00 0%, #2d1200 40%, #1a0800 100%)" }}>
            {/* Fundo decorativo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, #c4832a, transparent)" }} />
                <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, #8b1a1a, transparent)" }} />
                <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full" style={{ background: "radial-gradient(circle, #2a5c8b, transparent)" }} />
            </div>

            {/* Card principal */}
            <div className="relative w-full max-w-md mx-4">
                {/* Ornamento superior */}
                <div className="flex items-center justify-center mb-6">
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #c4832a)" }} />
                    <div className="mx-4 text-3xl">☯</div>
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, #c4832a)" }} />
                </div>

                <div
                    className="rounded-lg p-8 shadow-2xl"
                    style={{
                        background: "linear-gradient(145deg, #2d1f0e, #1a1008)",
                        border: "1px solid #c4832a40",
                        boxShadow: "0 0 40px #c4832a20, inset 0 1px 0 #c4832a30",
                    }}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-4xl mb-3">🔥</div>
                        <h1
                            className="text-2xl font-bold mb-1"
                            style={{ fontFamily: "var(--font-cinzel)", color: "#f4d03f" }}
                        >
                            Portal das Quatro Nações
                        </h1>
                        <p className="text-sm" style={{ color: "#a07840" }}>
                            Identifique-se, viajante
                        </p>
                    </div>

                    {/* Mensagem de erro */}
                    {erro && (
                        <div
                            className="mb-4 p-3 rounded text-sm text-center"
                            style={{ background: "#8b1a1a40", border: "1px solid #8b1a1a", color: "#ff9999" }}
                        >
                            ⚠ {erro}
                        </div>
                    )}

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm mb-2" style={{ color: "#c4a060", fontFamily: "var(--font-cinzel)" }}>
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="seu@email.com"
                                className="w-full px-4 py-3 rounded transition-all outline-none"
                                style={{
                                    background: "#1a1008",
                                    border: "1px solid #c4832a50",
                                    color: "#f4ecd8",
                                    fontFamily: "var(--font-lora)",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "#c4832a")}
                                onBlur={(e) => (e.target.style.borderColor = "#c4832a50")}
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2" style={{ color: "#c4a060", fontFamily: "var(--font-cinzel)" }}>
                                Senha
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded transition-all outline-none"
                                style={{
                                    background: "#1a1008",
                                    border: "1px solid #c4832a50",
                                    color: "#f4ecd8",
                                    fontFamily: "var(--font-lora)",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "#c4832a")}
                                onBlur={(e) => (e.target.style.borderColor = "#c4832a50")}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-3 rounded font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{
                                background: isPending
                                    ? "#c4832a80"
                                    : "linear-gradient(135deg, #c4832a, #a06020)",
                                color: "#f4ecd8",
                                fontFamily: "var(--font-cinzel)",
                                border: "1px solid #c4832a",
                                letterSpacing: "0.05em",
                            }}
                        >
                            {isPending ? "Verificando..." : "Entrar no Portal"}
                        </button>
                    </form>

                    {/* Link para cadastro */}
                    <div className="mt-6 text-center">
                        <p className="text-sm" style={{ color: "#806040" }}>
                            Ainda não tem uma conta?{" "}
                            <Link
                                href="/cadastro"
                                className="transition-colors"
                                style={{ color: "#c4832a" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#f4d03f")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#c4832a")}
                            >
                                Iniciar jornada
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Ornamento inferior */}
                <div className="flex items-center justify-center mt-6">
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #c4832a)" }} />
                    <div className="mx-4 text-xl" style={{ color: "#c4832a80" }}>◆</div>
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, #c4832a)" }} />
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0a00 0%, #2d1200 40%, #1a0800 100%)" }}>
                <div className="text-white/50 text-sm uppercase tracking-widest font-bold" style={{ fontFamily: "var(--font-cinzel), serif" }}>Carregando Portal...</div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}

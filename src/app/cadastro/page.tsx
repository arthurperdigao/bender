/**
 * src/app/cadastro/page.tsx
 * Página de cadastro temática do Portal das Quatro Nações
 */
"use client";

import { useState, useTransition } from "react";
import { registerUser } from "@/lib/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErro(null);

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const resultado = await registerUser(formData);
            if (!resultado.success) {
                setErro(resultado.error);
            } else {
                setSucesso(true);
                setTimeout(() => router.push("/login"), 2000);
            }
        });
    }

    const inputStyle = {
        background: "#1a1008",
        border: "1px solid #c4832a50",
        color: "#f4ecd8",
        fontFamily: "var(--font-lora)",
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center py-10 px-4 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0a1a0a 0%, #0d1f0d 40%, #0a1a0a 100%)" }}
        >
            {/* Fundo decorativo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-40 h-40 rounded-full" style={{ background: "radial-gradient(circle, #2a8b2a, transparent)" }} />
                <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, #8b6b2a, transparent)" }} />
            </div>

            <div className="relative w-full max-w-lg">
                {/* Ornamento superior */}
                <div className="flex items-center justify-center mb-6">
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #4a8b4a)" }} />
                    <div className="mx-4 text-3xl">🌿</div>
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, #4a8b4a)" }} />
                </div>

                <div
                    className="rounded-lg p-8 shadow-2xl"
                    style={{
                        background: "linear-gradient(145deg, #0d1f0d, #0a1408)",
                        border: "1px solid #4a8b4a40",
                        boxShadow: "0 0 40px #4a8b4a20, inset 0 1px 0 #4a8b4a30",
                    }}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-4xl mb-3">🌍</div>
                        <h1
                            className="text-2xl font-bold mb-1"
                            style={{ fontFamily: "var(--font-cinzel)", color: "#7fc97f" }}
                        >
                            Iniciar a Jornada
                        </h1>
                        <p className="text-sm" style={{ color: "#4a7a4a" }}>
                            Registre-se no Portal das Quatro Nações
                        </p>
                    </div>

                    {/* Mensagem de sucesso */}
                    {sucesso && (
                        <div
                            className="mb-4 p-3 rounded text-sm text-center"
                            style={{ background: "#1a4a1a", border: "1px solid #4a8b4a", color: "#99ff99" }}
                        >
                            ✓ Conta criada com sucesso! Redirecionando para o login...
                        </div>
                    )}

                    {/* Mensagem de erro */}
                    {erro && (
                        <div
                            className="mb-4 p-3 rounded text-sm text-center"
                            style={{ background: "#4a1a1a40", border: "1px solid #8b1a1a", color: "#ff9999" }}
                        >
                            ⚠ {erro}
                        </div>
                    )}

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs mb-1.5" style={{ color: "#7fc97f", fontFamily: "var(--font-cinzel)" }}>
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    required
                                    placeholder="Aang"
                                    className="w-full px-3 py-2.5 rounded transition-all outline-none text-sm"
                                    style={inputStyle}
                                    onFocus={(e) => (e.target.style.borderColor = "#4a8b4a")}
                                    onBlur={(e) => (e.target.style.borderColor = "#c4832a50")}
                                />
                            </div>
                            <div>
                                <label className="block text-xs mb-1.5" style={{ color: "#7fc97f", fontFamily: "var(--font-cinzel)" }}>
                                    Sobrenome
                                </label>
                                <input
                                    type="text"
                                    name="sobrenome"
                                    required
                                    placeholder="Avatar"
                                    className="w-full px-3 py-2.5 rounded transition-all outline-none text-sm"
                                    style={inputStyle}
                                    onFocus={(e) => (e.target.style.borderColor = "#4a8b4a")}
                                    onBlur={(e) => (e.target.style.borderColor = "#c4832a50")}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs mb-1.5" style={{ color: "#7fc97f", fontFamily: "var(--font-cinzel)" }}>
                                    Idade
                                </label>
                                <input
                                    type="number"
                                    name="idade"
                                    required
                                    min={1}
                                    max={120}
                                    placeholder="12"
                                    className="w-full px-3 py-2.5 rounded transition-all outline-none text-sm"
                                    style={inputStyle}
                                    onFocus={(e) => (e.target.style.borderColor = "#4a8b4a")}
                                    onBlur={(e) => (e.target.style.borderColor = "#c4832a50")}
                                />
                            </div>
                            <div>
                                <label className="block text-xs mb-1.5" style={{ color: "#7fc97f", fontFamily: "var(--font-cinzel)" }}>
                                    Cidade
                                </label>
                                <input
                                    type="text"
                                    name="cidade"
                                    required
                                    placeholder="Ba Sing Se"
                                    className="w-full px-3 py-2.5 rounded transition-all outline-none text-sm"
                                    style={inputStyle}
                                    onFocus={(e) => (e.target.style.borderColor = "#4a8b4a")}
                                    onBlur={(e) => (e.target.style.borderColor = "#c4832a50")}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs mb-1.5" style={{ color: "#7fc97f", fontFamily: "var(--font-cinzel)" }}>
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="avatar@mundo.com"
                                className="w-full px-3 py-2.5 rounded transition-all outline-none text-sm"
                                style={inputStyle}
                                onFocus={(e) => (e.target.style.borderColor = "#4a8b4a")}
                                onBlur={(e) => (e.target.style.borderColor = "#c4832a50")}
                            />
                        </div>

                        <div>
                            <label className="block text-xs mb-1.5" style={{ color: "#7fc97f", fontFamily: "var(--font-cinzel)" }}>
                                Senha <span style={{ color: "#50704a" }}>(mín. 6 caracteres)</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="w-full px-3 py-2.5 rounded transition-all outline-none text-sm"
                                style={inputStyle}
                                onFocus={(e) => (e.target.style.borderColor = "#4a8b4a")}
                                onBlur={(e) => (e.target.style.borderColor = "#c4832a50")}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending || sucesso}
                            className="w-full py-3 rounded font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            style={{
                                background:
                                    isPending || sucesso
                                        ? "#4a8b4a80"
                                        : "linear-gradient(135deg, #3a7a3a, #2a5a2a)",
                                color: "#e8f5e8",
                                fontFamily: "var(--font-cinzel)",
                                border: "1px solid #4a8b4a",
                                letterSpacing: "0.05em",
                            }}
                        >
                            {isPending ? "Registrando..." : sucesso ? "Registrado! ✓" : "Entrar para o Portal"}
                        </button>
                    </form>

                    {/* Link para login */}
                    <div className="mt-5 text-center">
                        <p className="text-sm" style={{ color: "#3a5a3a" }}>
                            Já tem uma conta?{" "}
                            <Link
                                href="/login"
                                className="transition-colors"
                                style={{ color: "#7fc97f" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#a0ffa0")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#7fc97f")}
                            >
                                Entrar no Portal
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Ornamento inferior */}
                <div className="flex items-center justify-center mt-6">
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #4a8b4a)" }} />
                    <div className="mx-4 text-xl" style={{ color: "#4a8b4a80" }}>◆</div>
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, #4a8b4a)" }} />
                </div>
            </div>
        </div>
    );
}

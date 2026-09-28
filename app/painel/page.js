"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

export default function ClienteLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/painel/dashboard");
    } catch (err) {
      console.error(err);
      setErro("Email ou senha inválidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-zinc-800 antialiased font-sans bg-fixed bg-cover bg-center relative flex flex-col justify-between"
      style={{ backgroundImage: "url('/fundo-site.jpg')" }}
    >
      {/* Máscara de gradiente idêntica à do site principal */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#1e2022]/70 to-[#121314]/90 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* CABEÇALHO COM LOGO */}
        <header className="w-full px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="C-SEM Gestão"
              width={40}
              height={40}
              priority
              className="w-auto h-auto drop-shadow transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow">
              C-SEM <span className="text-[#c59b27]">Gestão</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-zinc-300 hover:text-[#c59b27] uppercase tracking-wider transition-colors flex items-center gap-1"
          >
            ← Voltar ao site
          </Link>
        </header>

        {/* CARD CENTRAL DE LOGIN DO PAINEL */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <section className="w-full max-w-md bg-[#1e2022]/80 backdrop-blur-xl border border-zinc-700/80 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden text-white transition-all">
            {/* Detalhe estético: barra superior dourada */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c59b27] via-[#e5b839] to-[#9e7410]" />

            {/* TÍTULOS */}
            <div className="text-center mb-8 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Painel C-SEM
              </h1>
              <p className="text-[11px] text-[#e5b839] font-bold tracking-widest uppercase">
                CONSTANTINO SOLUÇÕES ENGENHARIA E MECÂNICA
              </p>
            </div>

            {/* FORMULÁRIO DE AUTENTICAÇÃO */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {/* CAMPO EMAIL */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="flex items-center bg-[#141516]/80 border border-zinc-700 rounded-lg px-3.5 py-3 focus-within:border-[#c59b27] focus-within:ring-1 focus-within:ring-[#c59b27] transition-all">
                  <FiMail className="text-zinc-400 mr-2.5 text-lg shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full outline-none text-sm text-white placeholder-zinc-500 bg-transparent"
                    placeholder="Digite seu email"
                    required
                  />
                </div>
              </div>

              {/* CAMPO SENHA */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Senha
                </label>
                <div className="flex items-center bg-[#141516]/80 border border-zinc-700 rounded-lg px-3.5 py-3 focus-within:border-[#c59b27] focus-within:ring-1 focus-within:ring-[#c59b27] transition-all">
                  <FiLock className="text-zinc-400 mr-2.5 text-lg shrink-0" />
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full outline-none text-sm text-white placeholder-zinc-500 bg-transparent"
                    placeholder="Digite sua senha"
                    required
                  />
                </div>
              </div>

              {/* ERRO DE LOGIN */}
              {erro && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-red-300 text-xs text-center font-medium">
                  {erro}
                </div>
              )}

              {/* BOTÃO SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-2 flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg text-white font-bold uppercase text-xs tracking-wider transition-all duration-300 shadow-lg ${
                  loading
                    ? "bg-zinc-700 cursor-not-allowed opacity-60"
                    : "bg-gradient-to-r from-[#c59b27] to-[#9e7410] hover:from-[#b8860b] hover:to-[#8a630a] hover:scale-[1.02] active:scale-95"
                }`}
              >
                {loading ? (
                  <span className="animate-pulse">Entrando...</span>
                ) : (
                  <>
                    <FiLogIn className="text-base" />
                    Entrar
                  </>
                )}
              </button>
            </form>

            {/* SUPORTE */}
            <div className="mt-8 pt-6 border-t border-zinc-700/60 text-center">
              <p className="text-xs text-zinc-400">
                Problemas para acessar?{" "}
                <a
                  href="https://wa.me/5551994726691"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e5b839] hover:underline font-bold"
                >
                  Suporte Técnico
                </a>
              </p>
            </div>
          </section>
        </main>

        {/* RODAPÉ */}
        <footer className="w-full py-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} C-SEM — Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}
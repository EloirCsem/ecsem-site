"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "../../firebaseConfig";
import {
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/painel/dashboard";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  async function entrar(e) {
    if (e) e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await setPersistence(auth, inMemoryPersistence);
      await signInWithEmailAndPassword(auth, email, senha);
      router.push(redirect);
    } catch {
      setErro("Usuário ou senha inválidos.");
      setCarregando(false);
    }
  }

  return (
    <div
      className="min-h-screen text-zinc-800 antialiased font-sans bg-fixed bg-cover bg-center relative flex flex-col justify-between"
      style={{ backgroundImage: "url('/fundo-site.jpg')" }}
    >
      {/* Máscara de gradiente ajustada com a identidade visual do site */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#1e2022]/70 to-[#121314]/90 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* HEADER / BARRA SUPERIOR SIMPLIFICADA */}
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

        {/* CONTAINER CENTRAL DE LOGIN */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-[#1e2022]/80 backdrop-blur-xl border border-zinc-700/80 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden text-white">
            {/* Detalhe estético: brilho dourado no topo do card */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c59b27] via-[#e5b839] to-[#9e7410]" />

            {/* CABEÇALHO DO CARD */}
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Acesse a Plataforma
              </h1>
              <p className="text-xs text-zinc-400 font-medium">
                Digite suas credenciais para entrar no painel
              </p>
            </div>

            {/* FORMULÁRIO */}
            <form onSubmit={entrar} className="space-y-5">
              {/* CAMPO EMAIL */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    📧
                  </div>
                  <input
                    type="email"
                    placeholder="seu.email@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#141516]/80 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] transition-all"
                  />
                </div>
              </div>

              {/* CAMPO SENHA */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    🔒
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#141516]/80 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] transition-all"
                  />
                </div>
              </div>

              {/* MENSAGEM DE ERRO */}
              {erro && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-red-300 text-xs text-center font-medium">
                  {erro}
                </div>
              )}

              {/* BOTÃO SUBMIT */}
              <button
                type="submit"
                disabled={carregando}
                className="w-full mt-2 bg-gradient-to-r from-[#c59b27] to-[#9e7410] hover:from-[#b8860b] hover:to-[#8a630a] text-white font-bold py-3.5 px-6 rounded-lg shadow-lg uppercase text-xs tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {carregando ? "Autenticando..." : "Entrar no Sistema"}
              </button>
            </form>

            {/* RODAPÉ DO CARD */}
            <div className="mt-8 pt-6 border-t border-zinc-700/60 text-center">
              <p className="text-xs text-zinc-400">
                Precisa de suporte ou acesso?{" "}
                <a
                  href="https://wa.me/5551994726691"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e5b839] hover:underline font-bold"
                >
                  Fale conosco
                </a>
              </p>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="w-full py-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} C-SEM Gestão. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#121314] flex items-center justify-center text-white font-bold text-sm">
          Carregando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
  

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-800 text-white">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-slate-700 bg-slate-800/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="C-SEM"
              width={42}
              height={42}
            />
            <span className="font-bold text-xl tracking-wide">
              C-SEM Gestão
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/5551998218593"
              target="_blank"
              className="hidden md:block text-slate-300 hover:text-white transition"
            >
              WhatsApp
            </a>

            <Link
              href="/painel"
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium transition"
            >
              Área do Cliente
            </Link>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="pt-44 pb-28 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="max-w-4xl">

            <span className="inline-block px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm mb-8">
              Plataforma profissional para assistência técnica, Software de gestão de ordens de serviço e Plataforma para controle de manutenção
            </span>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">

              Gestão profissional de

              <span className="block text-blue-400">
                Assistência Técnica
              </span>

              e Manutenção

            </h1>

            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mt-8 max-w-3xl">

              Centralize ordens de serviço, equipes técnicas,
              clientes, relatórios e indicadores em um único ambiente,
              com atualização em tempo real.

            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/painel"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold transition"
              >
                Área do Cliente
              </Link>

              <a
                href="https://wa.me/5551998218593"
                target="_blank"
                className="border border-slate-600 hover:border-slate-400 px-8 py-4 rounded-lg font-semibold transition"
              >
                Entrar em Contato
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* DIFERENCIAIS */}
      <section className="px-6 pb-24">

        <div className="max-w-7xl mx-auto">

          <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">
                Aplicativo Offline
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                Técnicos podem continuar operando mesmo sem internet,
                sincronizando os dados posteriormente.
              </p>
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">
                Relatórios Automáticos
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                Geração automática de PDFs contendo informações,
                fotos e assinaturas digitais.
              </p>
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">
                Business Intelligence
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                Indicadores operacionais e de desempenho atualizados
                em tempo real.
              </p>
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-3">
                Controle Multiempresa
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                Cada gestor visualiza apenas seus clientes,
                técnicos e ordens de serviço.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-slate-900 py-24 px-6">

        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-4xl font-bold mb-16">
            Fluxo Operacional
          </h2>

          <div className="grid md:grid-cols-4 gap-8">

            <div>
              <div className="text-4xl font-bold text-blue-400 mb-4">
                01
              </div>
              <p>Cliente solicita atendimento via site, abrindo uma OS</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-blue-400 mb-4">
                02
              </div>
              <p>Gestor direciona a um técnico responsável, e insere aviso no campo de informações da ordem de serviço</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-blue-400 mb-4">
                03
              </div>
              <p>Técnico executa o serviço em campo, atualiza o status da ordem de serviço</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-blue-400 mb-4">
                04
              </div>
              <p>Relatórios e indicadores atualizados, todos acessíveis em tempo real</p>
            </div>

          </div>

        </div>

      </section>

      {/* RECURSOS */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Recursos da Plataforma
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              "Ordens de Serviço",
              "Controle de Técnicos",
              "Controle de Clientes",
              "Aplicativo Android",
              "Funcionamento Offline",
              "Registro Fotográfico",
              "Assinatura Digital",
              "PDF Automático",
              "Histórico por QR Code",
              "Business Intelligence",
              "Exportação Excel",
              "Exportação PDF"
            ].map((item) => (
              <div
                key={item}
                className="bg-slate-700/50 border border-slate-600 rounded-xl p-5"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📧 SEÇÃO DE CONTATO PROFISSIONAL (SUBSTITUI O CTA ANTIGO) */}
      <section id="contato" className="py-24 px-6 bg-gradient-to-b from-slate-800 to-slate-900 border-t border-slate-700">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            Atendimento & Suporte
          </span>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Centralize sua operação hoje
          </h2>
          
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-12">
            Fale com a nossa equipe especializada para tirar dúvidas, solicitar demonstrações ou obter suporte técnico imediato.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            
            {/* CARD E-MAIL CORPORATIVO */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl hover:border-blue-500/50 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                  <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">E-mail Comercial</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Canal direto para propostas comerciais, parcerias e faturamento formal.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                <a
                  href="mailto:contato@ecsem.com.br"
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg shadow-blue-600/10"
                >
                  contato@ecsem.com.br
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("contato@ecsem.com.br");
                    alert("E-mail copiado para a área de transferência!");
                  }}
                  title="Copiar e-mail"
                  className="bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 py-3 px-4 rounded-xl transition flex items-center justify-center"
                >
                  <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376A8.965 8.965 0 0 0 12 12.75c-.497 0-.982.04-1.455.12l-.179.032m8.667 3.012A9.03 9.03 0 0 0 19.5 13.5c0-.416-.028-.828-.082-1.231M15.75 17.25a3.75 3.75 0 1 1-7.5 0m7.5 0H12m-5.75 0H3.75m0 0a3.75 3.75 0 0 1 3.75-3.75h1.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* CARD WHATSAPP RAPID */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                  <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.145-.44.02-.927.396-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Suporte via WhatsApp</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Fale com um atendente humano instantaneamente para chamados de urgência.
                </p>
              </div>

              <a
                href="https://wa.me/5551998218593"
                target="_blank"
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg shadow-emerald-600/10"
              >
                Iniciar Conversa no WhatsApp
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-700 py-12 bg-slate-900 text-center text-sm text-slate-400 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} C-SEM Gestão. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="mailto:contato@ecsem.com.br" className="hover:text-white transition">contato@ecsem.com.br</a>
            <a href="https://wa.me/5551998218593" target="_blank" className="hover:text-white transition">Suporte</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

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
              Plataforma profissional para assistência técnica e manutenção
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
              <p>Cliente solicita atendimento</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-blue-400 mb-4">
                02
              </div>
              <p>Gestor cria a ordem de serviço</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-blue-400 mb-4">
                03
              </div>
              <p>Técnico executa o serviço em campo</p>
            </div>

            <div>
              <div className="text-4xl font-bold text-blue-400 mb-4">
                04
              </div>
              <p>Relatórios e indicadores atualizados</p>
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

      {/* CTA */}
      <section className="py-24 px-6">

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Centralize sua operação
          </h2>

          <p className="text-slate-300 text-lg mb-10">
            Organize processos, acompanhe equipes
            e tenha indicadores confiáveis para tomada de decisão.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">

            <a
              href="https://wa.me/5551998218593"
              target="_blank"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold"
            >
              Entrar em Contato
            </a>

            <Link
              href="/painel"
              className="border border-slate-600 hover:border-slate-400 px-8 py-4 rounded-lg font-semibold"
            >
              Área do Cliente
            </Link>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-700 py-10 text-center">

        <p className="text-slate-300">
          © {new Date().getFullYear()} C-SEM Gestão
        </p>

        <p className="text-slate-400 mt-2">
          ecsem@gmail.com
        </p>

      </footer>

    </main>
  );
}
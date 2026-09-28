"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [faqAberto, setFaqAberto] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [isPausado, setIsPausado] = useState(false);
  const [currentYear, setCurrentYear] = useState("");

  const whatsappUrl =
    "https://wa.me/5551994726691?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20C-SEM%20";

  const modulos = [
    {
      id: 0,
      titulo: "Gestão de Ordens de Serviço",
      subtitulo: "Painel Principal",
      tag: "Central de Operações",
      descricao:
        "Acompanhe o status de todas as OSs em tempo real. Filtre por técnico, cliente ou prioridade e garanta controle total sobre prazos e agendamentos.",
      imagem: "/dashboard.jpeg",
      pontos: [
        "Abertura e acompanhamento simplificado de chamados",
        "Atribuição rápida de técnicos e prazos de atendimento",
        "Visão centralizada de pendências e finalizações",
      ],
    },
    {
      id: 1,
      titulo: "Aplicativo Móvel do Técnico",
      subtitulo: "Field Service Offline",
      tag: "Operação em Campo",
      descricao:
        "Permita que seus técnicos trabalhem com total autonomia, mesmo sem conexão à internet. Coleta de assinaturas, checklists e fotos sem complicação.",
      imagem: "/app.jpeg",
      pontos: [
        "Funcionamento 100% offline com sincronização automática",
        "Registro de fotos com compressão e assinatura digital",
        "Histórico completo de equipamentos via leitura de QR Code",
      ],
    },
    {
      id: 2,
      titulo: "BI & Indicadores Operacionais",
      subtitulo: "Relatórios & KPIs",
      tag: "Inteligência de Dados",
      descricao:
        "Tome decisões estratégicas baseadas em dados reais. Analise a produtividade da equipe, tempo médio de atendimento e custo por chamado.",
      imagem: "/bi.jpeg",
      pontos: [
        "Métricas e indicadores consolidados em tempo real",
        "Exportação de relatórios para PDF e Excel com 1 clique",
        "Análise de desempenho por técnico, região e cliente",
      ],
    },
  ];

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (isPausado) return;

    const timer = setInterval(() => {
      setAbaAtiva((prev) => (prev + 1) % modulos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPausado, modulos.length]);

  const toggleFaq = (index) => {
    setFaqAberto(faqAberto === index ? null : index);
  };

  const faqs = [
    {
      pergunta: "Como funciona o modo offline no aplicativo do técnico?",
      resposta:
        "O técnico pode preencher laudos, capturar fotos e coletar assinaturas mesmo sem acesso à internet. Todas as informações ficam armazenadas com segurança no dispositivo e são sincronizadas automaticamente assim que houver conexão.",
    },
    {
      pergunta: "Como funciona a leitura de histórico por QR Code?",
      resposta:
        "Cada equipamento possui um QR Code exclusivo vinculado ao seu número de série. Ao ler o código com a câmera do celular, o técnico ou gestor acessa instantaneamente todo o histórico de manutenções.",
    },
    {
      pergunta: "O cliente final precisa pagar ou instalar algum aplicativo?",
      resposta:
        "Não! O cliente final acessa um portal web leve e intuitivo direto pelo navegador para abrir chamados e acompanhar o status das ordens de serviço.",
    },
    {
      pergunta: "Posso exportar os relatórios para PDF e Excel?",
      resposta:
        "Sim. A plataforma gera automaticamente PDFs profissionais completos com fotos comprimidas e assinaturas digitais, além de permitir exportação em Excel.",
    },
  ];

  return (
    <main
      className="min-h-screen text-zinc-800 antialiased font-sans selection:bg-[#b8860b] selection:text-white bg-fixed bg-cover bg-center relative"
      style={{ backgroundImage: "url('/fundo-site.jpg')" }}
    >
      {/* 
        MÁSCARA DE DEGRADÊ SUAVE:
        - Começa bem suave no topo (from-black/30) deixando o fundo claro.
        - Escurece devagar pelo meio (via-[#1e2022]/65).
        - Termina em um escuro moderado no final (to-[#121314]/90).
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparente/10 via-[#1e2022]/40 to-[#121314]/60 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* NAVBAR */}
        <header className="fixed top-0 left-0 w-full z-50 border-b border-zinc-700/40 bg-[#1e2022]/70 backdrop-blur-md shadow-lg text-white">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="C-SEM Gestão"
                width={42}
                height={42}
                priority
                className="w-auto h-auto drop-shadow transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow">
                C-SEM <span className="text-[#c59b27]">Gestão</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 font-semibold text-xs tracking-wider text-zinc-200 uppercase">
              <a href="#" className="hover:text-[#c59b27] transition-colors border-b-2 border-[#c59b27] pb-1">
                Início
              </a>
              <a href="#modulos" className="hover:text-[#c59b27] transition-colors">
                Serviços
              </a>
              <a href="#integracao" className="hover:text-[#c59b27] transition-colors">
                Funcionalidades
              </a>
              <a href="#demonstracao-video" className="hover:text-[#c59b27] transition-colors">
                Vídeo
              </a>
              <a href="#faq" className="hover:text-[#c59b27] transition-colors">
                Dúvidas
              </a>
              <a href="#contato" className="hover:text-[#c59b27] transition-colors">
                Contato
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="bg-gradient-to-r from-[#c59b27] to-[#9e7410] hover:from-[#b8860b] hover:to-[#8a630a] text-white font-bold px-6 py-2.5 rounded-md shadow-md uppercase text-xs tracking-wider transition-all duration-200 active:scale-95"
              >
                Entrar
              </Link>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="pt-36 pb-20 px-6 min-h-[620px] flex items-center">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center w-full">
            <div className="lg:col-span-6 space-y-6 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#e5b839] leading-[1.15] tracking-tight uppercase drop-shadow-lg">
                PLATAFORMA INTELIGENTE PARA GESTÃO DE MANUTENÇÃO E SERVIÇOS
              </h1>

              <p className="text-white text-base sm:text-lg font-medium leading-relaxed max-w-lg drop-shadow">
                Sua operação eficiente: técnicos conectados, clientes informados e gestão baseada em dados reais.
              </p>

              <div className="pt-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-[#c59b27] to-[#9e7410] hover:from-[#b8860b] hover:to-[#8a630a] text-white font-bold px-8 py-4 rounded-md shadow-lg uppercase text-sm tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  SOLICITAR DEMONSTRAÇÃO
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center items-center">
              <div className="relative w-full max-w-xl">
                <div className="relative z-10 rounded-xl overflow-hidden border border-zinc-600/50 shadow-2xl bg-black/40 backdrop-blur-md p-2">
                  <Image
                    src="/dashboard.jpeg"
                    alt="Painel C-SEM Gestão"
                    width={700}
                    height={450}
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="w-full h-auto rounded-lg object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ECOSSISTEMA / MÓDULOS */}
        <section id="modulos" className="py-20 px-6 bg-[#1a1b1d]/60 backdrop-blur-md border-y border-zinc-700/50 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#c59b27] font-bold text-xs uppercase tracking-widest block mb-2">
                Conheça o Ecossistema
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-100">
                Tudo o que você precisa em uma única solução
              </h2>
            </div>

            {/* Trava de altura ajustada para evitar oscilações */}
            <div
              className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[560px] items-stretch"
              onMouseEnter={() => setIsPausado(true)}
              onMouseLeave={() => setIsPausado(false)}
            >
              {modulos.map((modulo) => {
                const isAtivo = abaAtiva === modulo.id;

                return (
                  <div
                    key={modulo.id}
                    onClick={() => setAbaAtiva(modulo.id)}
                    className={`cursor-pointer rounded-xl transition-all duration-500 ease-in-out border overflow-hidden flex flex-col justify-between p-6 h-full backdrop-blur-md ${
                      isAtivo
                        ? "lg:flex-[3] bg-[#282a2d]/90 border-[#c59b27] shadow-2xl shadow-black/60"
                        : "lg:flex-[1] bg-[#1e2022]/50 hover:bg-[#25272a]/70 border-zinc-700/50 opacity-85"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-zinc-700/60 pb-3 mb-2 shrink-0 h-10">
                      <span className="px-3 py-1 rounded text-xs font-bold uppercase bg-[#c59b27]/20 text-[#e5b839] border border-[#c59b27]/40">
                        {modulo.tag}
                      </span>
                      <span className="text-zinc-400 font-mono text-sm">0{modulo.id + 1}</span>
                    </div>

                    {isAtivo ? (
                      <div className="grid md:grid-cols-12 gap-6 items-center flex-1 overflow-hidden py-2 h-[calc(100%-2.5rem)]">
                        <div className="md:col-span-5 space-y-3 flex flex-col justify-center">
                          <h3 className="text-2xl font-bold text-white leading-tight">
                            {modulo.titulo}
                          </h3>
                          <p className="text-zinc-300 text-xs md:text-sm leading-relaxed">
                            {modulo.descricao}
                          </p>

                          <div className="pt-2 space-y-2">
                            {modulo.pontos.map((ponto, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                                <span className="text-[#c59b27] font-bold">✓</span>
                                <span>{ponto}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-7 h-full max-h-[380px] relative rounded-lg overflow-hidden border border-zinc-700 bg-black/60 p-2 flex items-center justify-center">
                          <Image
                            src={modulo.imagem}
                            alt={modulo.titulo}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-contain p-2"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-between flex-1 py-2 overflow-hidden h-[calc(100%-2.5rem)]">
                        <div className="shrink-0 h-14">
                          <h3 className="text-lg font-bold text-zinc-300 mb-1 line-clamp-1">
                            {modulo.titulo}
                          </h3>
                          <p className="text-xs text-zinc-400 truncate">{modulo.subtitulo}</p>
                        </div>

                        <div className="w-full flex-1 relative rounded-md overflow-hidden border border-zinc-700/60 my-2 bg-black/40 p-1 min-h-[160px]">
                          <Image
                            src={modulo.imagem}
                            alt={modulo.titulo}
                            fill
                            sizes="(max-width: 1024px) 100vw, 25vw"
                            className="object-contain p-1"
                          />
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold text-[#c59b27] uppercase tracking-wider shrink-0 mt-2 h-6">
                          <span>Ver Detalhes</span>
                          <span>→</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* INTEGRAÇÃO INTELIGENTE DE DADOS */}
        <section id="integracao" className="py-20 px-6">
          <div className="max-w-5xl mx-auto bg-[#1e2022]/70 backdrop-blur-md border border-zinc-700/70 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-white">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Integração Inteligente de Dados
              </h2>
              <p className="text-[#e5b839] font-bold text-base mt-3">
                Chega de dados espalhados em planilhas ou conversas de WhatsApp.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#282a2d]/80 border border-zinc-700/80 rounded-xl p-6 text-center hover:border-[#c59b27] transition-all shadow-md backdrop-blur-sm">
                <div className="w-12 h-12 bg-[#c59b27]/20 text-[#e5b839] border border-[#c59b27]/40 rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  📍
                </div>
                <h3 className="font-bold text-white mb-2 text-sm md:text-base">Central Unificada</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Tudo o que acontece na Central vai direto para o seu sistema de gestão.
                </p>
              </div>

              <div className="bg-[#282a2d]/80 border border-zinc-700/80 rounded-xl p-6 text-center hover:border-[#c59b27] transition-all shadow-md backdrop-blur-sm">
                <div className="w-12 h-12 bg-[#c59b27]/20 text-[#e5b839] border border-[#c59b27]/40 rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  📊
                </div>
                <h3 className="font-bold text-white mb-2 text-sm md:text-base">Relatórios Automáticos</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Relatórios automáticos e precisos com documentação fotográfica.
                </p>
              </div>

              <div className="bg-[#282a2d]/80 border border-zinc-700/80 rounded-xl p-6 text-center hover:border-[#c59b27] transition-all shadow-md backdrop-blur-sm">
                <div className="w-12 h-12 bg-[#c59b27]/20 text-[#e5b839] border border-[#c59b27]/40 rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  ⚡
                </div>
                <h3 className="font-bold text-white mb-2 text-sm md:text-base">Poder de Análise</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Poder de análise real sobre o seu atendimento e desempenho da equipe.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-zinc-700/60 text-center">
              <p className="text-xs font-bold text-zinc-300 tracking-wider uppercase">
                Tecnologia e informação a serviço da sua operação.
              </p>
            </div>
          </div>
        </section>

        {/* DEMONSTRAÇÃO EM VÍDEO (YOUTUBE) */}
        <section id="demonstracao-video" className="py-20 px-6 bg-[#18191a]/70 backdrop-blur-md border-t border-zinc-700/50 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[#c59b27] font-bold text-xs uppercase tracking-widest block mb-2">
              Veja na Prática
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Demonstração do Sistema
            </h2>
            <p className="text-zinc-300 text-sm md:text-base max-w-2xl mx-auto mb-8">
              Confira como o C-SEM Gestão simplifica o acompanhamento de ordens de serviço e a rotina de campo.
            </p>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-700/80 shadow-2xl bg-black/60">
              <iframe
                src="https://www.youtube-nocookie.com/embed/GCJw9i9rZ0U"
                title="Demonstração do C-SEM Gestão"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 px-6 bg-[#141516]/85 backdrop-blur-md border-t border-zinc-700/50 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#c59b27] font-bold text-xs uppercase tracking-widest block mb-2">
                Tire suas dúvidas
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Perguntas Frequentes</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-[#222426]/80 border border-zinc-700/70 rounded-xl overflow-hidden transition-all shadow-sm backdrop-blur-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-6 font-bold text-white flex justify-between items-center gap-4 hover:bg-[#2a2c2e]/90 transition-colors"
                  >
                    <span>{faq.pergunta}</span>
                    <span className="text-xl text-[#c59b27] font-bold">
                      {faqAberto === index ? "−" : "+"}
                    </span>
                  </button>

                  {faqAberto === index && (
                    <div className="px-6 pb-6 text-zinc-300 text-sm leading-relaxed border-t border-zinc-700/60 pt-4">
                      {faq.resposta}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTATO */}
        <section id="contato" className="py-16 px-6 bg-[#121314]/90 backdrop-blur-md border-t border-zinc-800 text-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-extrabold text-white">Pronto para transformar sua gestão?</h2>
            <p className="text-zinc-300 text-sm md:text-base max-w-xl mx-auto">
              Fale com nossa equipe técnica pelo WhatsApp ou envie um e-mail. Atendimento rápido e focado na sua operação.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-[#c59b27] to-[#9e7410] hover:from-[#b8860b] hover:to-[#8a630a] text-white font-bold px-8 py-3.5 rounded-md shadow-lg uppercase text-xs tracking-wider transition-all hover:scale-105 active:scale-95"
              >
                Falar com Consultor no WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-auto border-t border-zinc-800 py-8 bg-[#0d0e0f]/95 text-zinc-400 text-sm px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {currentYear} C-SEM Gestão. Todos os direitos reservados.</p>
            <div className="flex gap-6 font-medium text-xs uppercase tracking-wider">
              <a href="mailto:contato@ecsem.com.br" className="hover:text-[#c59b27] transition-colors">
                contato@ecsem.com.br
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#c59b27] transition-colors"
              >
                Suporte WhatsApp
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
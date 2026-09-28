"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [modalVideo, setModalVideo] = useState(false);
  const [faqAberto, setFaqAberto] = useState(null);

  const whatsappUrl =
    "https://wa.me/5551994726691?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20C-SEM%20";

  const toggleFaq = (index) => {
    setFaqAberto(faqAberto === index ? null : index);
  };

  const faqs = [
    {
      pergunta: "Como funciona o modo offline no aplicativo do técnico?",
      resposta:
        "O técnico pode preencher laudos, capturar fotos e coletar assinaturas mesmo sem acesso à internet. Todas as informações ficam armazenadas com segurança no dispositivo e são sincronizadas automaticamente (ou via botão forçado) assim que houver conexão.",
    },
    {
      pergunta: "Como funciona a leitura de histórico por QR Code?",
      resposta:
        "Cada equipamento possui um QR Code exclusivo vinculado ao seu número de série. Ao ler o código com a câmera do celular, o técnico ou gestor acessa instantaneamente todo o histórico de manutenções, peças trocadas e fotos do ativo.",
    },
    {
      pergunta: "O cliente final precisa pagar ou instalar algum aplicativo?",
      resposta:
        "Não! O cliente final acessa um portal web leve e intuitivo direto pelo navegador para abrir chamados e acompanhar o status das ordens de serviço em tempo real.",
    },
    {
      pergunta: "Posso exportar os relatórios para PDF e Excel?",
      resposta:
        "Sim. A plataforma gera automaticamente PDFs profissionais completos com fotos comprimidas e assinaturas digitais, além de permitir exportação em Excel para análises contábeis e operacionais.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-slate-200/80 bg-slate-100/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="C-SEM Gestão"
              width={42}
              height={42}
              className="drop-shadow-sm transition transform group-hover:scale-105"
            />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              C-SEM <span className="text-blue-600 font-extrabold">Gestão</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 font-medium text-slate-600 hover:text-emerald-600 transition-colors text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              WhatsApp
            </a>

            <Link
              href="/painel"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-95 text-sm"
            >
              Área do Cliente
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION COM CAPTURA DE ECRÃ REAL DO DASHBOARD */}
      <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-slate-200/60 via-slate-100 to-slate-200/40 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-tr from-blue-400/10 via-slate-300/30 to-indigo-400/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* TEXTO HERO */}
            <div className="lg:col-span-6 text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-white/80 text-blue-700 text-xs md:text-sm font-semibold shadow-sm mb-6 backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Plataforma Completa para Manutenção & Field Service
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                Gestão profissional de{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Assistência Técnica
                </span>{" "}
                e Manutenção
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mt-6 font-normal">
                Centralize ordens de serviço, equipes técnicas em campo, clientes, relatórios fotográficos e indicadores em tempo real em um único ambiente.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/painel"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                  Área do Cliente
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-3.5 rounded-xl font-semibold shadow-sm transition-all hover:border-slate-400 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-sm"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>

            {/* IMAGEM REAL DO DASHBOARD */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-300/80 bg-white p-2 transition-transform duration-300 hover:scale-[1.01]">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-t-xl border-b border-slate-200/80 mb-2">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="text-xs text-slate-500 font-medium ml-2">Painel de Ordens de Serviço — C-SEM</span>
                </div>
                
                <div className="relative w-full h-[320px] sm:h-[380px] rounded-lg overflow-hidden">
                  <Image
                    src="/dashbord.jpeg"
                    alt="Painel de Gestão de Ordens de Serviço C-SEM"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAIXA DE MÉTRICAS & PROVA SOCIAL */}
      <section className="bg-slate-900 py-10 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-blue-400">+10.000</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">OSs Processadas</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Operação Offline</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-400">&lt; 800 KB</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">PDFs Otimizados</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-400">99.9%</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Disponibilidade</p>
          </div>
        </div>
      </section>

      {/* DEMONSTRAÇÃO VISUAL DAS TELAS REAIS (APP & BI) */}
      <section className="py-20 px-6 bg-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest block mb-2">Interface Real</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Projetado para Agilidade em Campo e Decisões na Gestão
            </h2>
            <p className="text-slate-600 text-sm md:text-base mt-3 max-w-2xl mx-auto">
              Conheça a experiência intuitiva do aplicativo para os técnicos e o poder dos relatórios para os gestores.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-stretch">
            {/* CARD APP MÓVEL */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Aplicação Móvel</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Aplicativo do Técnico (Android)</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Operação fluida e sem complicação mesmo em áreas sem sinal de internet. Preenchimento rápido de relatórios, captura de fotografias e recolha de assinatura do cliente.
                </p>
              </div>
              <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <Image
                  src="/app.jpeg"
                  alt="Aplicativo do Técnico C-SEM"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>

            {/* CARD BI & INDICADORES */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Business Intelligence</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Indicadores e KPIs em Tempo Real</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Painel analítico completo para monitorar o desempenho da equipa, tempo de atendimento, produtividade por técnico e volume de ordens concluídas.
                </p>
              </div>
              <div className="relative w-full h-[320px] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <Image
                  src="/bi.jpeg"
                  alt="Painel de KPIs e BI C-SEM"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="px-6 py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Aplicativo Offline
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Técnicos podem continuar operando mesmo sem internet, sincronizando os dados posteriormente de forma segura.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Relatórios Automáticos
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Geração automática de PDFs otimizados contendo informações, fotos e assinaturas digitais.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Business Intelligence
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Indicadores operacionais, tempo improdutivo e métricas de desempenho atualizados em tempo real.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Controle Multiempresa
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Isolamento total de dados: cada gestor visualiza apenas seus clientes, técnicos e ordens de serviço.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FLUXO OPERACIONAL COM VÍDEO DEMO */}
      <section className="bg-slate-900 py-24 px-6 text-white relative">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-blue-400 font-semibold text-xs tracking-widest uppercase mb-3 block">
            Simplicidade & Eficiência
          </span>
          <h2 className="text-4xl font-extrabold mb-16 tracking-tight">
            Fluxo Operacional Integrado
          </h2>

          <div className="grid md:grid-cols-4 gap-8 mb-16 text-left">
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
              <div className="text-3xl font-extrabold text-blue-400 mb-3">01</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Cliente solicita atendimento via site, gerando a ordem de serviço automaticamente.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
              <div className="text-3xl font-extrabold text-blue-400 mb-3">02</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Gestor direciona ao técnico responsável e envia avisos no campo de informações da OS.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
              <div className="text-3xl font-extrabold text-blue-400 mb-3">03</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Técnico executa o serviço em campo, coleta fotos/assinaturas e atualiza os status.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
              <div className="text-3xl font-extrabold text-blue-400 mb-3">04</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Relatórios e indicadores de KPIs são atualizados e consolidados em tempo real.
              </p>
            </div>
          </div>

          {/* BANNER GATILHO */}
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-left border border-blue-400/30">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Quer ver o C-SEM em ação?</h3>
              <p className="text-blue-100 text-sm max-w-md">
                Assista à demonstração de 2 minutos sobre a abertura de OS e o controle do gestor em tempo real.
              </p>
            </div>
            <button
              onClick={() => setModalVideo(true)}
              className="bg-white text-blue-600 hover:bg-slate-100 transition-all font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 whitespace-nowrap text-sm shadow-lg hover:scale-105"
            >
              ▶ Assistir Demonstração
            </button>
          </div>
        </div>

        {/* POP-UP CINEMA DO YOUTUBE */}
        {modalVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 w-full max-w-4xl shadow-2xl relative">
              <button
                onClick={() => setModalVideo(false)}
                className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl transition text-xs tracking-wider"
              >
                ✕ FECHAR VÍDEO
              </button>

              <div className="relative w-full pb-[56.25%] h-0 rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-800">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/GCJw9i9rZ0U"
                  title="Vídeo demonstrativo C-SEM"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* RECURSOS DA PLATAFORMA */}
      <section className="py-24 px-6 bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest block mb-2">Recursos</span>
            <h2 className="text-4xl font-extrabold text-slate-900">
              Tudo o que sua equipe precisa para escalar
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { nome: "Ordens de Serviço", icon: "📋" },
              { nome: "Controle de Técnicos", icon: "👷" },
              { nome: "Controle de Clientes", icon: "🏢" },
              { nome: "Aplicativo Android", icon: "📱" },
              { nome: "Funcionamento Offline", icon: "⚡" },
              { nome: "Registro Fotográfico", icon: "📷" },
              { nome: "Assinatura Digital", icon: "✍️" },
              { nome: "PDF Automático", icon: "📄" },
              { nome: "Histórico por QR Code", icon: "🔍" },
              { nome: "Business Intelligence", icon: "📊" },
              { nome: "Exportação Excel", icon: "📈" },
              { nome: "Rastreamento GPS / Horários", icon: "📍" },
            ].map((item) => (
              <div
                key={item.nome}
                className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:border-blue-400/60 hover:shadow transition-all flex items-center gap-4 text-slate-800 font-semibold text-sm"
              >
                <span className="text-xl">{item.icon}</span>
                {item.nome}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO DE PERGUNTAS FREQUENTES (FAQ ACCORDION) */}
      <section className="py-20 px-6 bg-slate-200/50 border-t border-slate-300/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest block mb-2">Tire suas dúvidas</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 font-bold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50 transition"
                >
                  <span>{faq.pergunta}</span>
                  <span className="text-xl text-blue-600 font-bold">{faqAberto === index ? "−" : "+"}</span>
                </button>

                {faqAberto === index && (
                  <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.resposta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO PROFISSIONAL */}
      <section id="contato" className="py-24 px-6 bg-gradient-to-b from-slate-200/80 to-slate-300/60 border-t border-slate-300/80">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/10 text-blue-700 border border-blue-600/20 mb-4">
            Atendimento & Suporte
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Centralize sua operação hoje
          </h2>

          <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-12">
            Fale com a nossa equipe especializada para tirar dúvidas, solicitar demonstrações ou obter suporte técnico imediato.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            {/* CARD E-MAIL CORPORATIVO */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">E-mail Comercial</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Canal direto para propostas comerciais, parcerias e faturamento formal.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                <a
                  href="mailto:contato@ecsem.com.br"
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-md shadow-blue-600/10 text-sm"
                >
                  contato@ecsem.com.br
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("contato@ecsem.com.br");
                    alert("E-mail copiado para a área de transferência!");
                  }}
                  title="Copiar e-mail"
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 py-3 px-4 rounded-xl transition flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376A8.965 8.965 0 0 0 12 12.75c-.497 0-.982.04-1.455.12l-.179.032m8.667 3.012A9.03 9.03 0 0 0 19.5 13.5c0-.416-.028-.828-.082-1.231M15.75 17.25a3.75 3.75 0 1 1-7.5 0m7.5 0H12m-5.75 0H3.75m0 0a3.75 3.75 0 0 1 3.75-3.75h1.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* CARD WHATSAPP DIRETO */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.145-.44.02-.927.396-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Atendimento WhatsApp</h3>
                <p className="text-slate-600 text-sm mb-2 leading-relaxed">
                  Fale diretamente com nossa equipe técnica ou comercial.
                </p>
                <p className="text-slate-900 font-bold text-sm mb-6">
                  (51) 99472-6691
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-md shadow-emerald-600/10 text-sm"
              >
                Iniciar Conversa no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-300/80 py-12 bg-slate-200/90 text-center text-sm text-slate-600 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} C-SEM Gestão. Todos os direitos reservados.</p>
          <div className="flex gap-6 font-medium">
            <a href="mailto:contato@ecsem.com.br" className="hover:text-slate-900 transition">
              contato@ecsem.com.br
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition">
              Suporte WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
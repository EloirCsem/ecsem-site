"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { 
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi"; // ícone de lixeira
import { FiFileText } from "react-icons/fi";
// Bibliotecas para exportação
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { runTransaction } from "firebase/firestore";
// Bibliotecas para gráficos
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);



export default function Dashboard() {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrdem, setSelectedOrdem] = useState(null);
  const [novoStatus, setNovoStatus] = useState("aberto");
  const [novaObs, setNovaObs] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [busca, setBusca] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("ordens");
    // 🌟 NOVO: Controla se o menu lateral está expandido ou compacto
  const [sidebarAberta, setSidebarAberta] = useState(true);

  const [modalCriar, setModalCriar] = useState(false);
  const [novoCliente, setNovoCliente] = useState("");
  const [novoModelo, setNovoModelo] = useState("");
  const [novoSerie, setNovoSerie] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [numeroVisita, setNumeroVisita] = useState("1");
  const [apontamentos, setApontamentos] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
    // 🌟 NOVOS ESTADOS PARA O CALENDÁRIO SEMANAL
  const [diaSelecionado, setDiaSelecionado] = useState(new Date().toLocaleDateString("pt-BR")); // Ex: "04/08/2026"
  const [filtroTecnico, setFiltroTecnico] = useState("Todos");
  const [filtroTipoAtividade, setFiltroTipoAtividade] = useState("Todas");
  const [dataInicioSemana, setDataInicioSemana] = useState(new Date()); // Controla qual semana está sendo exibida

  

  const router = useRouter();

  // busca usuarios (admin e gestor)
  const fetchUsuarios = async (userData) => {
    if (!userData) return;

    try {
      let q;

      if (userData.isAdmin) {
        // 👑 Admin vê todos
        q = query(
          collection(db, "usuarios"),
          where("tipo", "==", "tecnico")
        );
      } else {
        // 👔 Gestor vê só os dele
        q = query(
          collection(db, "usuarios"),
          where("tipo", "==", "tecnico"),
          where("clienteId", "==", userData.uid)
        );
      }

      const snapshot = await getDocs(q);

      const lista = snapshot.docs.map(d => ({
        uid: d.id,
        ...d.data(),
      }));

      console.log("TÉCNICOS FILTRADOS:", lista);

      setUsuarios(lista);
    } catch (err) {
      console.error("Erro ao buscar técnicos:", err);
      setUsuarios([]);
    }
  };

  // 📆 🌟 REGRA DE SEGURANÇA: Busca os apontamentos de campo para a Aba Agenda fora do useEffect
  const fetchApontamentos = async (userData) => {
    if (!userData) return;
    try {
      let q;
      if (userData.isAdmin) {
        // Admins visualizam tudo
        q = query(collection(db, "deslocamentos"), orderBy("dataCriacao", "desc"));
      } else if (userData.isGestor) {
        // 🔒 SEGURANÇA: Gestor visualiza unicamente o que está na sua carteira
        q = query(
          collection(db, "deslocamentos"), 
          where("gestorId", "==", userData.uid),
          orderBy("dataCriacao", "desc")
        );
      } else {
        // Clientes e técnicos não carregam esse bloco
        return;
      }

      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApontamentos(lista);
    } catch (error) {
      console.error("Erro ao buscar apontamentos:", error);
    }
  };

  // detectar login + buscar dados + ordens + usuários
  useEffect(() => {
    let unsubscribeOrdens = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (unsubscribeOrdens) {
          unsubscribeOrdens();
          unsubscribeOrdens = null;
        }
        router.push("/login");
        return;
      }

      try {
        const userRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);

        console.log("UID LOGADO:", user.uid);
        console.log("DOC EXISTS:", userSnap.exists());

        let userData = {
          uid: user.uid,
          isAdmin: false,
          isGestor: false,
          isCliente: false,
          nome: "",
          gestorId: "",
        };

        if (userSnap.exists()) {
          const u = userSnap.data();

          console.log("USER FIREBASE:", u);
          console.log("TIPO USUÁRIO:", u.tipo);

          userData.isAdmin = u.isAdmin || false;
          userData.isGestor = u.isGestor || false;
          userData.isCliente = u.tipo === "cliente";

          userData.nome = u.nome || u.email || "";
          userData.gestorId = u.gestorId || "";

          if (u.tipo === "cliente") {
            setClienteSelecionado(user.uid);
            setNovoCliente(u.nome || u.email);
          }
        }

        setUsuario(userData);

        if (unsubscribeOrdens) {
          unsubscribeOrdens();
        }

        // Carrega as ordens e ouvintes em tempo real
        unsubscribeOrdens = await fetchOrdens(userData);
        
        // Carrega os técnicos da carteira do gestor
        await fetchUsuarios(userData);

        // 🌟 GATILHO DA AGENDA: Puxa os apontamentos de forma assíncrona e sem erros
        await fetchApontamentos(userData);

      } catch (e) {
        console.error("Erro auth:", e);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeOrdens) {
        unsubscribeOrdens();
      }
      unsubscribeAuth();
    };
  }, []);


const handleAtribuirTecnico = async (ordemId, novoTecnicoUid) => {
  if (!ordemId) return;
  try {
    const ordemRef = doc(db, "ordens_servico", ordemId);
    // Atualiza apenas o campo tecnicoId (e opcionalmente tecnico para exibir nome)
    await updateDoc(ordemRef, {
      tecnicoId: novoTecnicoUid,
      // opcional: tecnico: nomeString  // se você quiser salvar também o nome
    });

    // atualiza estado local para refletir na UI imediatamente
    setOrdens(prev => prev.map(o => o.id === ordemId ? { ...o, tecnicoId: novoTecnicoUid } : o));

    // se modal aberto, atualiza selectedOrdem
    if (selectedOrdem && selectedOrdem.id === ordemId) {
      setSelectedOrdem(prev => ({ ...prev, tecnicoId: novoTecnicoUid }));
    }
  } catch (err) {
    console.error("Erro ao atribuir técnico:", err);
    alert("Erro ao atribuir técnico. Veja console.");
  }
};



  // Logout
  const handleLogout = async () => {
    await auth.signOut();
    router.push("/painel");
  };

  // Buscar ordens
  // 🔍 Buscar ordens de serviço conforme o tipo de usuário

  const fetchOrdens = async (userData) => {
  if (!userData) return;

  try {
    let q;

    if (userData.isAdmin) {
      q = query(
        collection(db, "ordens_servico"),
        orderBy("numeroOs", "asc")
      );

    } else if (userData.isCliente) {
      q = query(
        collection(db, "ordens_servico"),
        where("clienteId", "==", userData.uid),
        orderBy("numeroOs", "asc")
      );

    } else if (userData.isGestor) {
      q = query(
        collection(db, "ordens_servico"),
        where("gestorId", "==", userData.uid),
        orderBy("numeroOs", "asc")
      );

    } else {
      q = query(
        collection(db, "ordens_servico"),
        where("tecnicoId", "==", userData.uid),
        orderBy("numeroOs", "asc")
      );
    }


    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrdens(lista);
      setLoading(false);
    });

    return unsubscribe;

  } catch (error) {
    console.error("Erro ao buscar OS:", error);
    setLoading(false);
  }
};

useEffect(() => {
  const user = auth.currentUser;
  if (!user || !usuario) return;

  const buscarClientes = async () => {
    try {

      // 👤 SE FOR CLIENTE → ele só vê ele mesmo
      if (usuario?.isCliente) {
  setClientes([
    {
      id: usuario.uid,
      nome: usuario.nome || usuario.email || "Cliente"
    }
  ]);

  setClienteSelecionado(usuario.uid);
  setNovoCliente(usuario.nome || usuario.email || "");

  return;
}

      // 👔 SE FOR GESTOR → busca clientes dele
      const q = query(
        collection(db, "usuarios"),
        where("tipo", "==", "cliente"),
        where("gestorId", "==", user.uid),
        where("ativo", "==", true)
      );

      const snapshot = await getDocs(q);

      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setClientes(lista);

    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  buscarClientes();
}, [usuario]);


  // Cores
  const getStatusColor = (status = "") => {
    switch (status.toLowerCase()) {
      case "aberto":
        return "bg-green-500";
      case "em andamento":
        return "bg-blue-500";
      case "fechado":
      case "encerrado":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const handleSelectOrdem = (ordem) => {
    setSelectedOrdem(ordem);
    setNovoStatus(ordem.status || "aberto");
    setNumeroVisita(ordem.numeroVisita || "1"); // 🔑 Sincroniza o seletor com a visita atual da OS
  };

  const handleSalvar = async () => {
    if (!selectedOrdem) return;

    const ordemRef = doc(db, "ordens_servico", selectedOrdem.id);
    try {
      // 💾 1. SALVA NO FIREBASE: Adicionado o campo numeroVisita na gravação
      await updateDoc(ordemRef, {
        status: novoStatus,
        numeroVisita: numeroVisita, 
        observacoes: arrayUnion(novaObs),
      });

      // 🔄 2. ATUALIZA A TELA DO USUÁRIO: Inclui o numeroVisita no estado local
      setOrdens((prev) =>
        prev.map((o) =>
          o.id === selectedOrdem.id
            ? { 
                ...o, 
                status: novoStatus, 
                numeroVisita: numeroVisita,
                observacoes: [...(o.observacoes || []), novaObs] 
              }
            : o
        )
      );

      setNovaObs("");
      setSelectedOrdem(null);
      alert("OS atualizada com sucesso!"); // Feedback visual opcional de sucesso
    } catch (err) {
      console.error("Erro ao salvar OS:", err);
      alert("Erro ao salvar OS, veja o console.");
    }
  };


  // Criar nova OS com número sequencial global

// imports necessários (verifique se já existem no topo do arquivo)
// import { collection, query, orderBy, limit, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

const handleCriarOS = async () => {
  if (!novoCliente || !novoModelo || !novoSerie || !novaDescricao) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("Usuário não autenticado");
    return;
  }

  try {
    // 🔢 Buscar próximo número da OS
    const contadorRef = doc(db, "contadores", "ordemServico");

const numeroOsStr = await runTransaction(db, async (transaction) => {
  const contadorDoc = await transaction.get(contadorRef);

  let novoNumero = 1;

  if (!contadorDoc.exists()) {
    transaction.set(contadorRef, { ultimoNumero: 1 });
    return 1;
  }

  const ultimoNumero = contadorDoc.data().ultimoNumero || 0;
  novoNumero = ultimoNumero + 1;

  transaction.update(contadorRef, {
    ultimoNumero: novoNumero,
  });

  return novoNumero;
});

    

    // 👤 Buscar dados do usuário logado
    const userSnap = await getDoc(doc(db, "usuarios", user.uid));

    let clienteIdFinal = user.uid;
    let gestorIdFinal = user.uid;
    let gestorNomeFinal = "";

    if (userSnap.exists()) {
      const u = userSnap.data();

      if (u.tipo === "cliente") {
        // 👤 Cliente criando
        clienteIdFinal = user.uid;
        gestorIdFinal = u.gestorId;

        // 🔥 Buscar nome do gestor
        if (u.gestorId) {
          const gestorSnap = await getDoc(doc(db, "usuarios", u.gestorId));
          if (gestorSnap.exists()) {
            const gestorData = gestorSnap.data();
            gestorNomeFinal = gestorData.nome || gestorData.email || "";
          }
        }

      } else if (u.isGestor) {
        // 👔 Gestor criando
        clienteIdFinal = clienteSelecionado || user.uid;
        gestorIdFinal = user.uid;
        gestorNomeFinal = u.nome || u.email || "";
      }
    }

    // 📦 Criar objeto da OS
    const novaOS = {
      numeroOs: numeroOsStr,
      cliente: novoCliente,
      clienteId: clienteIdFinal,

      gestorId: gestorIdFinal,
      gestorNome: gestorNomeFinal, // 🔥 AGORA SALVA

      modelo: novoModelo,
      numeroSerie: novoSerie,
      descricao: novaDescricao,
      status: "aberto",

      usuarioId: user.uid,
      tecnicoId: "",
      tecnico: "",

      inicio: "",
      fim: "",
      observacoes: [],
      solicitacaoPecas: "",
      pecasUsadas: "",

      dataCriacao: new Date().toISOString()
    };

    // 💾 Salvar
    await setDoc(
      doc(db, "ordens_servico", numeroOsStr.toString()),
      novaOS
    );

    alert(`OS ${numeroOsStr} criada com sucesso`);

    // 🧹 Limpar formulário
    setNovoCliente("");
    setNovoModelo("");
    setNovoSerie("");
    setNovaDescricao("");
    setModalCriar(false);

  } catch (error) {
    console.error("Erro ao criar OS:", error);
    alert("Erro ao criar OS");
  }
};

  // Apagar OS com ícone de lixeira
  const handleApagarOS = async (numeroOs) => {
    if (!confirm("Deseja realmente apagar esta OS?")) return;
    await deleteDoc(doc(db, "ordens_servico", numeroOs.toString()));
    setOrdens((prev) => prev.filter((o) => o.numeroOs !== numeroOs));
  };

  // Filtros
    // 🔍 NOVO MOTOR DE FILTRAGEM: Cruzamento inteligente entre Sidebar e as Novas Abas
  const ordensFiltradas = ordens.filter((os) => {
    const statusLimpo = os.status?.toLowerCase().trim();
    
    // 1. Regra de Filtro por Status (Sidebar vs Abas da Dashboard)
    let bateStatus = false;
    
    if (filtro === "encerrado") {
      // Se clicou em "Ordens Concluídas" na Sidebar, mostra só o histórico fechado
      bateStatus = statusLimpo === "encerrado" || statusLimpo === "fechado";
    } else if (filtro === "abertas") {
      // Aba interna da Dashboard: Abertas
      bateStatus = statusLimpo === "aberto";
    } else if (filtro === "em andamento") {
      // Aba interna da Dashboard: Em andamento
      bateStatus = statusLimpo === "em andamento";
    } else {
      // Aba interna da Dashboard: "todas" (Traz tudo que está na rua rodando)
      bateStatus = statusLimpo === "aberto" || statusLimpo === "em andamento";
    }

    // 2. Sua regra original de Busca pela Lupa (Mantida 100% intacta)
    const filtroBusca =
      busca === "" || os.numeroOs?.toString().toLowerCase().includes(busca.toLowerCase());

    return bateStatus && filtroBusca;
  });


    // 📊 Exportar Excel - Ajustado para baixar TUDO do banco sem filtros de tela
  const exportExcel = () => {
    // 🚀 MUDANÇA ESSENCIAL: Trocado 'ordensFiltradas' por 'ordens' (Puxa todas as OS)
    const ws = XLSX.utils.json_to_sheet(ordens); 
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Todas as Ordens");
    XLSX.writeFile(wb, "ECSEM_Relatorio_Geral.xlsx");
  };

  // 📕 Exportar PDF - Ajustado para baixar TUDO do banco sem filtros de tela
  const exportPDF = () => {
    const docPDF = new jsPDF();
    const head = [["Nº OS", "Cliente", "Técnico", "Status", "Início", "Fim"]];
    
    // 🚀 MUDANÇA ESSENCIAL: Trocado 'ordensFiltradas' por 'ordens' para montar o PDF completo
    const body = ordens.map((o) => [
      o.numeroOs,
      o.cliente,
      o.tecnico,
      o.status,
      o.inicio,
      o.fim,
    ]);

    autoTable(docPDF, { head, body });
    docPDF.save("ECSEM_Relatorio_Gerencial.pdf");
  };


  // Gráficos
  const ordensPorTecnico = ordensFiltradas.reduce((acc, os) => {
    acc[os.tecnico] = (acc[os.tecnico] || 0) + 1;
    return acc;
  }, {});


  
  const ordensPorMes = ordensFiltradas.reduce((acc, os) => {
    const mes = os.inicio
      ? new Date(os.inicio).toLocaleString("default", { month: "short", year: "numeric" })
      : "Sem início";
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {});

    // 🔍 FILTRAGEM AVANÇADA DE AUDITORIA: Cruza data e filtros do Gestor sem falhas
  const apontamentosFiltradosNaAgenda = apontamentos.filter((item) => {
    // Corrige compatibilidade de datas: Remove possíveis espaços e garante o padrão "DD/MM/AAAA"
    const dataTratadaItem = item.data?.trim();
    const dataTratadaSelecionada = diaSelecionado?.trim();
    const bateDia = dataTratadaItem === dataTratadaSelecionada;
    
    // Filtro por Técnico da carteira
    const bateTecnico = filtroTecnico === "Todos" || item.tecnicoId === filtroTecnico;
    
    // Mapeia os tipos criados no App (check_in, check_out, deslocamento) para os seletores da Web
    let bateTipo = false;
    if (filtroTipoAtividade === "Todas") {
      bateTipo = true;
    } else if (filtroTipoAtividade === "deslocamento") {
      bateTipo = item.tipoAtividade === "deslocamento";
    } else if (filtroTipoAtividade === "outras") {
      // "outras" na Web engloba atividades administrativas e os carimbos de auditoria física do app
      bateTipo = item.tipoAtividade === "outras" || item.tipoAtividade === "check_in" || item.tipoAtividade === "check_out";
    }

    return bateDia && bateTecnico && bateTipo;
  });

  // 📊 FILTRO DA LINHA DO TEMPO: Isola os pontos cronológicos unicamente pela data escolhida
  const apontamentosDoDiaParaTimeline = apontamentos.filter((item) => {
    return item.data?.trim() === diaSelecionado?.trim();
  });

  // 👨‍🔧 PROVEDOR DE LISTA DE TÉCNICOS: Garante que todos os técnicos do Gestor apareçam na lista,
  // mesmo que não tenham feito nenhum apontamento no dia (A régua aparece vazia esperando dados)
  const linhaTempoAgrupadaPorTecnico = (() => {
    const agrupamento = {};

    // 1º Passo: Alimenta a lista injetando todos os técnicos oficiais cadastrados sob a tutela do gestor
    usuarios.forEach((tecnicoDoc) => {
      agrupamento[tecnicoDoc.uid] = {
        nome: tecnicoDoc.nome || tecnicoDoc.email || "Técnico de Campo",
        eventos: []
      };
    });

    // 2º Passo: Varre as auditorias de campo de hoje vindas do Firebase e distribui nas réguas corretas
    apontamentosDoDiaParaTimeline.forEach((item) => {
      const idTecnico = item.tecnicoId || "desconhecido";
      
      // Se por algum motivo o técnico não estava pré-cadastrado na lista de usuários, cria um card dinâmico para ele
      if (!agrupamento[idTecnico]) {
        agrupamento[idTecnico] = {
          nome: item.tecnicoNome || "Técnico Externo",
          eventos: []
        };
      }
      agrupamento[idTecnico].eventos.push(item);
    });

    return agrupamento;
  })();


// 🕒 Transforma uma string "HH:MM" em minutos totais desde o início do dia
function converterHoraParaMinutos(horaString) {
  if (!horaString || !horaString.includes(":")) return 0;
  const [horas, minutos] = horaString.split(":").map(Number);
  return (horas * 60) + minutos;
}

// 📐 Calcula a porcentagem exata da esquerda (0% a 100%) para posicionar a bolinha na régua das 24 horas
function calcularPorcentagemLinhaTempo(horaString) {
  const minutosTotaisDia = 24 * 60; // 1440 minutos em um dia inteiro
  const minutosEvento = converterHoraParaMinutos(horaString);
  const porcentagem = (minutosEvento / minutosTotaisDia) * 100;
  return Math.min(Math.max(porcentagem, 0), 100); // Garante que fique entre 0 e 100
}

  // Funções de controle da semana e calendário
  const alterarSemana = (semanas) => {
    const novaData = new Date(dataInicioSemana);
    novaData.setDate(novaData.getDate() + (semanas * 7));
    setDataInicioSemana(novaData);
    const diaAjustado = new Date(novaData);
    setDiaSelecionado(diaAjustado.toLocaleDateString("pt-BR"));
  };

  // 🌟 COLA EXATAMENTE ESTA FUNÇÃO AQUI (ACIMA DO RETURN):
  const obterNomeMesAnoDaSemana = () => {
    return dataInicioSemana.toLocaleString("pt-BR", { month: "long", year: "numeric" }).toUpperCase();
  };

    // 🌟 ADICIONE ESTA LINHA EXATAMENTE AQUI (DENTRO DA FUNÇÃO, ACIMA DO RETURN):
  const diasDaSemanaExibida = gerarDiasDaSemana(dataInicioSemana);
  // 🗺️ FUNÇÃO DEFINITIVA DE REDIRECIONAMENTO DE MAPAS (BLINDADA)
  const abrirLocalizacaoNoGoogleMaps = (latitude, longitude) => {
    if (!latitude || !longitude || latitude === 0 || longitude === 0) {
      alert("Este evento não possui coordenadas de GPS registradas.");
      return;
    }

    
    
    // 🚀 BLINDAGEM MÁXIMA: String fatiada em array obriga o Next.js a destruir qualquer cache de texto antigo
    const partesUrl = [
      "https://www.",
      "google.com",
      "/maps/search/?api=1&query=",
      latitude,
      ",",
      longitude
    ];
    
    // Junta as peças formando o link perfeito: https://google.com
    const urlLegitima = partesUrl.join("");
    
    window.open(urlLegitima, "_blank", "noopener,noreferrer");
  };


  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800 antialiased font-sans w-full">
      
      {/* 🧭 1. BARRA LATERAL FIXA (SIDEBAR PREMIUM) */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-slate-900 text-slate-300 border-r border-slate-800 z-50 flex flex-col justify-between transition-all duration-300 shadow-2xl ${
          sidebarAberta ? "w-64" : "w-20"
        }`}
      >
        <div>
          {/* Logo + Título do Software */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="min-w-[32px] h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-md tracking-wider">
                EC
              </div>
              {sidebarAberta && (
                <span className="font-extrabold text-white text-md tracking-wide whitespace-nowrap bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Olá, {usuario?.nome || "Usuário"}
                </span>
              )}
            </div>
            
            {/* Botão Retrátil */}
            <button 
              onClick={() => setSidebarAberta(!sidebarAberta)}
              className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              title={sidebarAberta ? "Recolher Menu" : "Expandir Menu"}
            >
              {sidebarAberta ? "◀" : "▶"}
            </button>
          </div>
          {/* Itens de Navegação Verticais Atualizados */}
          <nav className="p-4 flex flex-col gap-1.5">
            
            {/* 1. Ordens de Serviço (Foca apenas nas Ativas/Para Executar) */}
            <button
              onClick={() => {
                setAbaAtiva("ordens");
                setFiltro("ativas"); // 🌟 Força a exibição apenas das que estão pendentes/abertas
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                abaAtiva === "ordens" && (filtro === "Todas" || filtro === "Pendentes" || filtro === "ativas")
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="text-base">📋</span>
              {sidebarAberta && <span>Ordens em Aberto</span>}
            </button>

            {/* 🌟 NOVO BOTÃO: Filtra direto as ordens encerradas/fechadas do banco */}
            <button
              onClick={() => {
                setAbaAtiva("ordens");
                setFiltro("encerrado"); // 🌟 Força o filtro do Firebase a isolar as concluídas
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                abaAtiva === "ordens" && filtro === "encerrado"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="text-base">✅</span>
              {sidebarAberta && <span>Ordens Concluídas</span>}
            </button>

            {/* 2. Escala Semanal (Agenda) */}
            {(usuario?.isGestor || usuario?.isAdmin) && (
              <button
                onClick={() => setAbaAtiva("agenda")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  abaAtiva === "agenda" 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                    : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-base">📆</span>
                {sidebarAberta && <span>Escala Semanal</span>}
              </button>
            )}

            {/* 3. Linha do Tempo */}
            {(usuario?.isGestor || usuario?.isAdmin) && (
              <button
                onClick={() => setAbaAtiva("timeline")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  abaAtiva === "timeline" 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                    : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-base">📊</span>
                {sidebarAberta && <span>Linha do Tempo</span>}
              </button>
            )}

            {/* 🌟 NOVA ABA: Central de Exportação de Relatórios */}
            {(usuario?.isGestor || usuario?.isAdmin) && (
              <button
                onClick={() => setAbaAtiva("exportar")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  abaAtiva === "exportar" 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                    : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-base">📥</span>
                {sidebarAberta && <span>Exportar Relatórios</span>}
              </button>
            )}          
          </nav>
        </div>
      
        {/* Rodapé da Sidebar (Informações Legais ou Perfil Curto) */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
          >
            <span>🚪</span>
            {sidebarAberta && <span>Sair do Sistema</span>}
          </button>
        </div>
      </aside>

{/* 🏙️ CONTAINER DA DIREITA */}
      <div 
        // 🚀 UPGRADE PRATA: O fundo agora segue o degradê platinado contínuo do cabeçalho
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 bg-gradient-to-b from-slate-200 to-gray-300"
        style={{ paddingLeft: sidebarAberta ? "16.5rem" : "5.25rem" }}
      >

                {/* 👑 2. CABEÇALHO GRANDE E PREMIUM (CORREÇÃO DE COR: PRATA / PLATINADO) */}
        <header className="h-20 bg-gradient-to-r from-slate-100 to-gray-600 border-b border-slate-300 px-8 flex items-center justify-between shadow-sm sticky top-0 z-40">
          <div>
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Painel Administrativo</span>
            <h1 className="text-xl font-black text-slate-800 tracking-tight mt-0.5 drop-shadow-sm">
              {abaAtiva === "ordens" && "Gerenciamento de Ordens de Serviço"}
              {abaAtiva === "agenda" && "Escala Semanal de Atendimentos"}
              {abaAtiva === "timeline" && "Linha do Tempo e Auditoria Digital"}
            </h1>
          </div>


          {/* Botões de Ações Rápidas no Cabeçalho */}
          <div className="flex items-center gap-3">
                        {/* 👑 Botão no Cabeçalho Prata Ajustado para Resetar o Formulário */}
            <button
              onClick={() => {
                // 🌟 LIMPEZA COMPLETA: Garante que o campo de cliente abra 100% vazio todas as vezes
                if (typeof setClienteSelecionado === "function") setClienteSelecionado("");
                if (typeof setNovoCliente === "function") setNovoCliente("");
                if (typeof setNovoModelo === "function") setNovoModelo("");
                if (typeof setNovoSerie === "function") setNovoSerie("");
                if (typeof setNovaDescricao === "function") setNovaDescricao("");
                
                // Abre o modal de fato
                setModalCriar(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/10 flex items-center gap-2"
            >
              <span>➕</span> Criar Nova OS
            </button>


            {(usuario?.isGestor || usuario?.isAdmin) && (
              <button
                onClick={() => router.push("/painel/bi")}
                className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 text-sm font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
              >
                <span>📈</span> Inteligência BI
              </button>
            )}
          </div>
        </header>

        {/* 🚀 3. MIOLO DE CONTEÚDO PRINCIPAL */}
                {/* 🚀 3. MIOLO DE CONTEÚDO PRINCIPAL */}
        <main className="p-8 flex-1 max-w-7xl w-full mx-auto bg-transparent">

          
          {/* Renderização da Aba Ordens */}
          {abaAtiva === "ordens" && (
            <>
              
                            {/* Barra de Filtros e Lupa Integrada (Atualizado sem Concluídas) */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                
                {/* 🌟 NOVA ESCALA DE BOTÕES: Abertas, Em andamento e Todas por último */}
                {filtro !== "encerrado" && (
                  <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200/40">
                    {[
                      { id: "abertas", label: "Abertas" },
                      { id: "em andamento", label: "Em andamento" },
                      { id: "todas", label: "Todas" }
                    ].map((abaItem) => (
                      <button
                        key={abaItem.id}
                        onClick={() => setFiltro(abaItem.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                          filtro === abaItem.id
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {abaItem.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Se estiver na aba de concluídas pela sidebar, mostra apenas um indicador fixo */}
                {filtro === "encerrado" && (
                  <div className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">
                    📂 Histórico de Arquivos Encerrados
                  </div>
                )}

                <div className="relative w-full sm:w-80">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar por OS, cliente ou técnico..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>


              {/* Loader e Início do Loop de Cards */}
              {loading ? (
                <div className="flex items-center justify-center py-12"><p className="text-gray-400 animate-pulse font-medium text-sm">Sincronizando banco de dados...</p></div>
              ) : ordensFiltradas.length === 0 ? (
                <p className="text-gray-400 text-center py-12 bg-white rounded-2xl border border-dashed">Nenhuma ordem de serviço localizada com os filtros atuais.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {ordensFiltradas.map((os) => (
          
                <div
                  key={os.numeroOs}
                  className="flex cursor-pointer rounded shadow hover:shadow-lg transition relative bg-white"
                  onClick={() => handleSelectOrdem(os)}
                >
                  <div className="flex flex-col p-3 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">OS #{os.numeroOs}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(os.status)}`}>
                        {os.status}
                      </span>
                    </div>

                    <p className="text-gray-700 mt-2">👤 {os.cliente}</p>
                    <p className="text-gray-700">🔧 {os.modelo}</p>
                    <p className="text-gray-500 text-sm mt-2">Técnico: {os.tecnico || "Não atribuído"}</p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!os.pdfUrl) {
                          alert("PDF ainda não disponível.");
                          return;
                        }
                        window.open(os.pdfUrl, "_blank");
                      }}
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <FiFileText size={14} />
                      Visualizar Relatório
                    </button>
                  </div>
                  
                  <div className={`w-2 rounded-l ${getStatusColor(os.status)}`}></div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApagarOS(os.numeroOs);
                    }}
                    className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 📥 Aba Exportar: Central de Downloads e Fechamento de Relatórios da Empresa */}
      {abaAtiva === "exportar" && (usuario?.isGestor || usuario?.isAdmin) && (
        <div className="w-full max-w-4xl bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-6">
          <div className="border-b pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">Central de Relatórios Operacionais</h2>
            <p className="text-sm text-gray-500">Extraia planilhas e auditorias completas de todas as ordens de serviço cadastradas na sua carteira.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloco 1: Planilha Excel */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-gray-50 to-emerald-50/10 border border-gray-200 hover:border-emerald-500/30 transition duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold mb-4">
                  📊
                </div>
                <h3 className="font-extrabold text-gray-800 text-md mb-2">Base de Dados em Excel</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Gere um arquivo .xlsx completo contendo números de OS, clientes, equipamentos, laudos técnicos, fotos registradas e dados de auditoria física de campo para cruzamento em planilhas.
                </p>
              </div>
              <button
                onClick={exportExcel}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow"
              >
                📥 Baixar Planilha Completa
              </button>
            </div>

            {/* Bloco 2: Relatório Executivo PDF */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-gray-50 to-amber-50/10 border border-gray-200 hover:border-amber-500/30 transition duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl font-bold mb-4">
                  📕
                </div>
                <h3 className="font-extrabold text-gray-800 text-md mb-2">Relatório Sintético em PDF</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Gere uma tabela executiva padronizada em formato PDF contendo os horários de início e fim, status atuais e técnicos encarregados. Ideal para auditorias diretas com clientes ou arquivamento.
                </p>
              </div>
              <button
                onClick={exportPDF}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow"
              >
                📥 Baixar Relatório Gerencial
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 📅 Aba Agenda: Visual de Calendário Semanal com Título do Mês e Busca Manual */}
      {abaAtiva === "agenda" && (usuario?.isGestor || usuario?.isAdmin) && (
        <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow mb-6">
          
          {/* Topo: Títulos e Filtros Cruzados */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b">
            <div>
              {/* 🌟 MOSTRA O MÊS E ANO ATUAL DA AGENDA EX: "AGOSTO DE 2026" */}
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                📆 Escala de Apontamentos: <span className="text-blue-600 font-extrabold">{obterNomeMesAnoDaSemana()}</span>
              </h2>
              <p className="text-sm text-gray-500">Navegue pelas semanas ou escolha um dia específico para isolar os dados.</p>
            </div>

            {/* Controles de Filtro Rápidos */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {/* 🌟 NOVO FILTRO: Calendário de Data Direta */}
              <div className="flex flex-col">
                <input
                  type="date"
                  onChange={(e) => handleFiltroDataManual(e.target.value)}
                  className="border p-2 rounded text-sm bg-gray-50 font-medium text-gray-700 focus:outline-blue-500"
                  title="Ir direto para uma data específica"
                />
              </div>

              <select
                value={filtroTecnico}
                onChange={(e) => setFiltroTecnico(e.target.value)}
                className="border p-2 rounded text-sm bg-gray-50 font-medium text-gray-700 focus:outline-blue-500"
              >
                <option value="Todos">Todos os Técnicos</option>
                {usuarios.map(t => (
                  <option key={t.uid} value={t.uid}>{t.nome || t.email}</option>
                ))}
              </select>

              <select
                value={filtroTipoAtividade}
                onChange={(e) => setFiltroTipoAtividade(e.target.value)}
                className="border p-2 rounded text-sm bg-gray-50 font-medium text-gray-700 focus:outline-blue-500"
              >
                <option value="Todas">Todas as Atividades</option>
                <option value="deslocamento">🚗 Deslocamento</option>
                <option value="outras">⚙️ Outras Atividades</option>
              </select>
            </div>
          </div>

          {/* BARRA DO CALENDÁRIO VISUAL SEMANAL */}
          <div className="flex items-center justify-between gap-2 bg-gray-50 p-4 rounded-xl mb-6 shadow-inner">
            <button
              onClick={() => alterarSemana(-1)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 px-3 rounded-lg transition text-sm shadow"
            >
              ◀ Sem. Anterior
            </button>

            {/* Linha dos 7 dias da Semana */}
            <div className="grid grid-cols-7 gap-2 flex-1 max-w-3xl mx-4">
              {diasDaSemanaExibida.map((dataObj, index) => {
                const stringData = dataObj.toLocaleDateString("pt-BR");
                const diaMes = dataObj.getDate();
                const nomeDiaSemana = dataObj.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
                const isSelecionado = stringData === diaSelecionado;

                return (
                  <button
                    key={index}
                    onClick={() => setDiaSelecionado(stringData)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition ${
                      isSelecionado
                        ? "bg-blue-600 text-white border-blue-600 shadow-md font-bold scale-105"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-blue-400"
                    }`}
                  >
                    <span className={`text-xs uppercase tracking-wider ${isSelecionado ? "text-blue-200" : "text-gray-400"}`}>
                      {nomeDiaSemana}
                    </span>
                    <span className="text-lg mt-0.5">{diaMes}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => alterarSemana(1)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 px-3 rounded-lg transition text-sm shadow"
            >
              Próx. Sem. ▶
            </button>
          </div>

          {/* LISTA DOS APONTAMENTOS FILTRADOS DO DIA */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
              📌 Apontamentos técnicos para o dia {diaSelecionado}:
            </h3>

            {apontamentosFiltradosNaAgenda.length === 0 ? (
              <p className="text-gray-400 text-center py-8 bg-gray-50 rounded-xl border border-dashed">
                Nenhum apontamento técnico registrado para este dia com os filtros selecionados.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {apontamentosFiltradosNaAgenda.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-xl border-l-4 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 hover:bg-gray-100 transition ${
                      item.tipoAtividade === "deslocamento" ? "border-blue-500" : "border-purple-500"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded text-white ${
                          item.tipoAtividade === "deslocamento" ? "bg-blue-600" : "bg-purple-600"
                        }`}>
                          {item.tipoAtividade === "deslocamento" ? "🚗 Deslocamento" : "⚙️ Outra Atividade"}
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          {item.tecnicoNome || "Técnico Não Identificado"}
                        </span>
                      </div>
                      {item.descricao && (
                        <p className="text-sm text-gray-600 font-medium italic mt-1 bg-white p-2 rounded border border-gray-100 shadow-inner inline-block">
                          "{item.descricao}"
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">ID Técnico: {item.tecnicoId}</p>
                    </div>

                    <div className="mt-2 md:mt-0 text-right flex flex-col items-end justify-center">
                      <span className="text-xs text-gray-500 font-semibold bg-gray-200 px-2.5 py-1 rounded-full">
                        🕒 {item.horaInicio} às {item.horaFim}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

            {/* 📊 Aba Linha do Tempo: Monitoramento Gráfico Horizontal 24h (Padrão de Logística Avançada) */}
      {abaAtiva === "timeline" && (usuario?.isGestor || usuario?.isAdmin) && (
        <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow mb-6">
          <div className="border-b pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">Linha do Tempo Diária da Equipe</h2>
            <p className="text-sm text-gray-500">
              Régua cronológica com o histórico de atendimentos e atividades para o dia <span className="font-bold text-blue-600">{diaSelecionado}</span>.
            </p>
          </div>

          {/* Legenda Dinâmica de Cores */}
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg border">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-400"></span> 📍 Check-In</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> 🏁 Check-Out</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-700"></span> 🚗 Deslocamento</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-600"></span> ⚙️ Outra Atividade</span>
          </div>

          {Object.keys(linhaTempoAgrupadaPorTecnico).length === 0 ? (
            <p className="text-gray-400 text-center py-10 bg-gray-50 rounded-xl border border-dashed">
              Nenhuma atividade de campo ou registro de auditoria detectado para este dia.
            </p>
          ) : (
            <div className="flex flex-col gap-8">
              {Object.entries(linhaTempoAgrupadaPorTecnico).map(([tecnicoId, dados]) => (
                <div key={tecnicoId} className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                  {/* Nome do Técnico e ID */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-md flex items-center gap-2">
                      👨‍🔧 {dados.nome}
                    </h3>
                    <span className="text-xs text-gray-400">UID: {tecnicoId}</span>
                  </div>

                  {/* CONTAINER DA RÉGUA GRÁFICA HORIZONTAL */}
                  <div className="relative w-full h-12 bg-gray-200 rounded-lg border border-gray-300 shadow-inner flex items-center">
                    
                    {/* Linhas de Grade de Apoio Visual (Fundo do Gráfico) */}
                    <div className="absolute left-[25%] top-0 bottom-0 w-px bg-gray-300/60 border-dashed"></div>
                    <div className="absolute left-[50%] top-0 bottom-0 w-px bg-gray-300/60 border-dashed"></div>
                    <div className="absolute left-[75%] top-0 bottom-0 w-px bg-gray-300/60 border-dashed"></div>

                    {/* 🌟 PLOTAGEM DINÂMICA DOS PONTOS DO HISTÓRICO COM FUNÇÃO INDEPENDENTE */}
                    {dados.eventos.map((evento) => {
                      const posEsquerda = calcularPorcentagemLinhaTempo(evento.horaInicio);
                      
                      // Seleção de Cores em Tailwind com base no tipo exato de auditoria
                      let corBolinha = "bg-purple-600"; // Padrão "outras"
                      if (evento.tipoAtividade === "deslocamento") corBolinha = "bg-blue-700";
                      else if (evento.tipoAtividade === "check_in") corBolinha = "bg-sky-400";
                      else if (evento.tipoAtividade === "check_out") corBolinha = "bg-rose-500";

                      return (
                        <div
                          key={evento.id}
                          className="absolute group z-10 cursor-pointer"
                          style={{ left: posEsquerda + "%", transform: "translateX(-50%)" }}
                          // 🚀 CHAMA A FUNÇÃO BLINDADA DO TOPO ENVIANDO APENAS OS PARÂMETROS NÚMERICOS PUROS
                          onClick={() => abrirLocalizacaoNoGoogleMaps(evento.latitude, evento.longitude)}
                        >
                          {/* Bolinha Pulsante Indicativa */}
                          <div className={"w-4 h-4 rounded-full border-2 border-white shadow transition-all duration-200 group-hover:scale-150 " + corBolinha}></div>

                          {/* 🎈 Balão Informativo Flutuante (Tooltip Inteligente ao Passar o Mouse) */}
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap min-w-[160px] border border-gray-700">
                            <p className="font-bold text-blue-400">{evento.horaInicio}</p>
                            <p className="font-semibold">{evento.descricao || "Atividade de Campo"}</p>
                            {evento.numeroOs && <p className="text-gray-400 text-[10px]">Ordem: #{evento.numeroOs}</p>}
                            {evento.latitude && evento.longitude && (
                              <p className="text-blue-300 text-[10px] mt-1 text-center font-bold">🗺️ Clique para abrir o Mapa</p>
                            )}
                          </div>
                        </div>
                      );
                    })}


                  </div>

                  {/* Régua Numérica de Horas (Marcadores de Rodapé da Linha) */}
                  <div className="relative w-full flex justify-between text-[11px] font-bold text-gray-400 mt-2 px-1">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:59</span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}



      {/* Modal Criar OS */}
      {modalCriar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Criar Nova OS</h2>
            <div className="flex flex-col gap-3">
              <select
                value={clienteSelecionado}
                onChange={(e) => {
                  const clienteId = e.target.value;
                  setClienteSelecionado(clienteId);
                  const clienteObj = clientes.find(c => c.id === clienteId);
                  setNovoCliente(clienteObj?.nome || "");
                }}
                className="border p-2 rounded"
              >
                <option value="">Selecione o cliente *</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Modelo *"
                value={novoModelo}
                onChange={(e) => setNovoModelo(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Número de Série *"
                value={novoSerie}
                onChange={(e) => setNovoSerie(e.target.value)}
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Descrição/Observação *"
                value={novaDescricao}
                onChange={(e) => setNovaDescricao(e.target.value)}
                className="border p-2 rounded"
              ></textarea>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleCriarOS}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Criar
                </button>
                <button
                  onClick={() => setModalCriar(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Detalhes OS */}
      {selectedOrdem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-2">OS #{selectedOrdem.numeroOs}</h2>
            <p><strong>Cliente:</strong> {selectedOrdem.cliente}</p>
            <p><strong>Modelo:</strong> {selectedOrdem.modelo}</p>
            <p><strong>Número de Série:</strong> {selectedOrdem.numeroSerie}</p>
            <p><strong>Técnico:</strong> {selectedOrdem.tecnico}</p>
            <p><strong>Início:</strong> {selectedOrdem.inicio || "-"}</p>
            <p><strong>Fim:</strong> {selectedOrdem.fim || "-"}</p>
            <p className="mt-2 font-semibold">Solicitação de Peças:</p>
            <div className="border rounded p-2 bg-gray-100 text-sm mb-2">
              {selectedOrdem.solicitacaoPecas || "Nenhuma solicitação"}
            </div>
            <p><strong>Descrição:</strong> {selectedOrdem.descricao}</p>
            <p>
              <strong>Status atual:</strong>{" "}
              <span className={`font-bold ${getStatusColor(selectedOrdem.status)}`}>
                {selectedOrdem.status}
              </span>
            </p>
            
            {usuario?.isAdmin || usuario?.isGestor ? (
              <div className="mt-4">
                <label className="font-semibold">Responsável:</label>
                <select
                  value={selectedOrdem.tecnicoId || ""}
                  className="border p-1 rounded w-full mt-1"
                  onChange={async (e) => {
                    const novoTecnicoUid = e.target.value;
                    if (!novoTecnicoUid) return;

                    const ordemRef = doc(db, "ordens_servico", selectedOrdem.id);
                    const tecnicoSelecionado = usuarios.find(u => u.uid === novoTecnicoUid);

                    try {
                      await updateDoc(ordemRef, {
                        tecnicoId: novoTecnicoUid,
                        tecnico: tecnicoSelecionado?.nome || tecnicoSelecionado?.email || "",
                        tecnicoNome: tecnicoSelecionado?.nome || "",
                        tecnicoEmail: tecnicoSelecionado?.email || "",
                      });

                      setSelectedOrdem(prev => ({
                        ...prev,
                        tecnicoId: novoTecnicoUid,
                        tecnico: tecnicoSelecionado?.nome || tecnicoSelecionado?.email || "",
                      }));

                      setOrdens(prev =>
                        prev.map(o =>
                          o.numeroOs === selectedOrdem.numeroOs
                            ? {
                                ...o,
                                tecnicoId: novoTecnicoUid,
                                tecnico: tecnicoSelecionado?.nome || tecnicoSelecionado?.email || "",
                              }
                            : o
                        ) 
                      );
                    } catch (err) {
                      console.error("Erro ao atribuir técnico:", err);
                      alert("Erro ao atribuir técnico");
                    }
                  }}
                >
                  <option value="">Selecione um técnico</option>
                  {usuarios.map(u => (
                    <option key={u.uid} value={u.uid}>
                      {u.nome || u.email}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {/* STATUS */}
            <div className="mt-4">
              <label className="font-semibold">Novo status:</label>
              <select
                value={novoStatus}
                onChange={(e) => setNovoStatus(e.target.value)}
                className="border p-1 rounded w-full mt-1"
              >
                <option value="aberto">aberto</option>
                <option value="em andamento">em andamento</option>
                <option value="encerrado">encerrado</option>
              </select>
            </div>

            {/* SELETOR DE NÚMERO DE VISITA */}
            <div className="mt-4">
              <label className="font-semibold">Número de visita:</label>
              <select
                value={numeroVisita || "1"} 
                onChange={(e) => setNumeroVisita(e.target.value)}
                className="border p-1 rounded w-full mt-1 bg-white"
              >
                <option value="1">1ª Visita</option>
                <option value="2">2ª Visita</option>
              </select>
            </div>

            {/* OBSERVAÇÃO */}
            <div className="mt-4">
              <label className="font-semibold">Observação:</label>
              <input
                type="text"
                value={novaObs}
                onChange={(e) => setNovaObs(e.target.value)}
                className="border p-1 rounded w-full mt-1"
                placeholder="Digite uma observação"
              />
            </div>

            {/* BOTÕES */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleSalvar}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Salvar
              </button>
              <button
                onClick={() => setSelectedOrdem(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Fechar
              </button>
            </div>

            {selectedOrdem.observacoes && selectedOrdem.observacoes.length > 0 && (
              <div className="mt-4 max-h-40 overflow-y-auto border-t pt-2">
                <h3 className="font-semibold mb-2">Histórico:</h3>
                {selectedOrdem.observacoes
                  .slice()
                  .reverse()
                  .map((obs, idx) => (
                    <p key={idx} className="text-sm border-b py-1">{obs}</p>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );

</div>
    </div>
  );
}
// 🗓️ Função auxiliar para gerar os 7 dias da semana com base em uma data de referência
function gerarDiasDaSemana(dataReferencia) {
  const data = new Date(dataReferencia);
  const diaSemana = data.getDay();
  // Ajusta para a segunda-feira ser o primeiro dia (0 = Domingo, 1 = Segunda...)
  const distanciaParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
  
  const segundaFeira = new Date(data.setDate(data.getDate() + distanciaParaSegunda));
  
  const dias = [];
  for (let i = 0; i < 7; i++) {
    const diaAtual = new Date(segundaFeira);
    diaAtual.setDate(segundaFeira.getDate() + i);
    dias.push(diaAtual);
  }
  return dias;


}

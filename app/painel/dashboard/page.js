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
  limit
} from "firebase/firestore";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi"; // ícone de lixeira

// Bibliotecas para exportação
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [filtro, setFiltro] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("ordens");
  const [modalCriar, setModalCriar] = useState(false);
  const [novoCliente, setNovoCliente] = useState("");
  const [novoModelo, setNovoModelo] = useState("");
  const [novoSerie, setNovoSerie] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  const router = useRouter();


  // busca usuarios (admin e gestor)
  const fetchUsuarios = async (userData) => {
    try {
      let snapshot;
      if (!userData) return;

      if (userData.isAdmin) {
        snapshot = await getDocs(collection(db, "usuarios"));
      } else if (userData.isGestor) {
        const q = query(
          collection(db, "usuarios"),
          where("clienteId", "==", userData.uid)
        );
        snapshot = await getDocs(q);
      } else {
        setUsuarios([]);
        return;
      }

      const listaUsuarios = snapshot.docs.map(d => ({
        uid: d.id,
        ...d.data(),
      }));

      setUsuarios(listaUsuarios);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setUsuarios([]);
    }
  };

  // detectar login + buscar dados + ordens + usuários
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setOrdens([]);
        setUsuario(null);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userDocRef);

        let userData = { uid: user.uid, isGestor: false, isAdmin: false };

        if (userSnap.exists()) {
  const u = userSnap.data();
  userData = {
    uid: user.uid,
    nome: u.nome || null,            // caso use "nome"
    tecnicoNome: u.tecnicoNome || u.nome || null, 
    email: user.email,
    isGestor: !!u.isGestor,
    isAdmin: !!u.isAdmin,
  };
}

        setUsuario(userData);

        fetchOrdens(userData);

        if (userData.isAdmin || userData.isGestor) {
          fetchUsuarios(userData);
        } else {
          setUsuarios([]);
        }

      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
      }
    });

    return () => unsubscribe();
  }, []);  // Aqui você adiciona a função fetchOrdens(userData) como já tem


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
  
  const fetchOrdens = async (userData) => {
  if (!userData) return;
  setLoading(true);
  try {
    let q;
    if (userData.isAdmin) {
      // super-admin: vê tudo
      q = query(collection(db, "ordens_servico"), orderBy("numeroOs", "asc"));
    } else if (userData.isGestor) {
      // gestor/cliente: vê apenas ordens do seu cliente
      q = query(
        collection(db, "ordens_servico"),
        where("clienteId", "==", userData.uid),
        orderBy("numeroOs", "asc")
      );
    } else {
      // técnico: vê apenas ordens atribuidas a ele (ou que ele criou — escolha)
      q = query(
        collection(db, "ordens_servico"),
        where("tecnicoId", "==", userData.uid),
        orderBy("numeroOs", "asc")
      );
    }

    const snapshot = await getDocs(q);
    const ordensUsuario = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrdens(ordensUsuario);
  } catch (error) {
    console.error("Erro ao buscar OS:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setOrdens([]);
      setUsuario(null);
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userDocRef);
      let userData = { uid: user.uid, isGestor: false, isAdmin: false };

      if (userSnap.exists()) {
        const u = userSnap.data();
        userData.isGestor = u.isGestor || false;
        userData.isAdmin = u.isAdmin || false;
      }

      setUsuario(userData);
      fetchOrdens(userData);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
    }
  });

  return () => unsubscribe();
}, []);
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
  };

  const handleSalvar = async () => {
  if (!selectedOrdem) return;

  const ordemRef = doc(db, "ordens_servico", selectedOrdem.id); // <-- usar o id real
  try {
    await updateDoc(ordemRef, {
      status: novoStatus,
      observacoes: arrayUnion(novaObs),
    });

    // Atualiza estado local
    setOrdens((prev) =>
      prev.map((o) =>
        o.id === selectedOrdem.id
          ? { ...o, status: novoStatus, observacoes: [...(o.observacoes || []), novaObs] }
          : o
      )
    );

    setNovaObs("");
    setSelectedOrdem(null);
  } catch (err) {
    console.error("Erro ao salvar OS:", err);
    alert("Erro ao salvar OS, veja o console.");
  }
};

  // Criar nova OS com número sequencial global

// imports necessários (verifique se já existem no topo do arquivo)
// import { collection, query, orderBy, limit, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

const handleCriarOS = async () => {
  // validação simples dos campos do modal
  if (!novoCliente || !novoModelo || !novoSerie || !novaDescricao) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  const user = auth.currentUser;
  if (!user) return alert("Usuário não autenticado");

  setLoading(true);
  try {
    // 1) pegar maior numeroOs existente (ordenado desc)
    const q = query(collection(db, "ordens_servico"), orderBy("numeroOs", "desc"), limit(1));
    const snapshot = await getDocs(q);
    let proximoNumero = 1;
    if (!snapshot.empty) {
      const maior = snapshot.docs[0].data().numeroOs;
      proximoNumero = Number(maior) + 1;
    }
    const novaId = proximoNumero.toString(); // id do documento

    // 2) pegar doc do usuário para achar clienteId (se técnico)
    const userDocRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userDocRef);
    let clienteIdParaSalvar = user.uid; // default (se gestor cria para si)
    if (userSnap.exists()) {
      const u = userSnap.data();
      if (u.clienteId) {
        // se for técnico, usa o clienteId do seu doc
        clienteIdParaSalvar = u.clienteId;
      } else if (u.isGestor) {
        // se for gestor, clienteId = proprio uid
        clienteIdParaSalvar = user.uid;
      } else {
        clienteIdParaSalvar = user.uid; // fallback seguro
      }
    }

    // 3) montar objeto da OS
    const novaOSData = {
      numeroOs: novaId,
      cliente: novoCliente,
      modelo: novoModelo,
      numeroSerie: novoSerie,
      descricao: novaDescricao,
      status: "Aberto",
      usuarioId: user.uid,            // quem criou
      clienteId: clienteIdParaSalvar, // vinculo do cliente/gestor
    
      inicio: "",
      fim: "",
      observacoes: [],
      solicitacaoPecas: "",
      pecasUsadas: "",
      dataCriacao: new Date().toISOString()
    };

    // 4) salvar no Firestore usando o numero como ID (compatibilidade com app)
    await setDoc(doc(db, "ordens_servico", novaId), novaOSData);

    // 5) atualizar state local para aparecer imediatamente na UI
    setOrdens(prev => [...prev, { id: novaId, ...novaOSData }]);

    // 6) limpar modal e campos
    setNovoCliente("");
    setNovoModelo("");
    setNovoSerie("");
    setNovaDescricao("");
    setModalCriar(false);

    // opcional: sucesso
    alert(`OS criada: ${novaId}`);
  } catch (err) {
    console.error("Erro ao criar OS:", err);
    alert("Erro ao criar OS. Veja o console.");
  } finally {
    setLoading(false);
  }
};

  // Apagar OS com ícone de lixeira
  const handleApagarOS = async (numeroOs) => {
    if (!confirm("Deseja realmente apagar esta OS?")) return;
    await deleteDoc(doc(db, "ordens_servico", numeroOs.toString()));
    setOrdens((prev) => prev.filter((o) => o.numeroOs !== numeroOs));
  };

  // Filtros
  const ordensFiltradas = ordens.filter((os) => {
    const filtroStatus =
      filtro === "Pendentes"
        ? os.status !== "encerrado"
        : filtro === "Concluídas"
        ? os.status === "encerrado"
        : true;
    const filtroBusca =
      busca === "" || os.numeroOs?.toString().includes(busca);
    return filtroStatus && filtroBusca;
  });

  // Exportar Excel/PDF
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(ordensFiltradas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ordens");
    XLSX.writeFile(wb, "Ordens.xlsx");
  };

  const exportPDF = () => {
    const docPDF = new jsPDF();
    const head = [["Nº OS", "Cliente", "Técnico", "Status", "Início", "Fim"]];
    const body = ordensFiltradas.map((o) => [
      o.numeroOs,
      o.cliente,
      o.tecnico,
      o.status,
      o.inicio,
      o.fim,
    ]);

    autoTable(docPDF, { head, body });
    docPDF.save("Ordens.pdf");
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



  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-6 pt-16">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Image src="/logo-icon.png" alt="Logo C-SEM" width={40} height={40} />
          <h1 className="text-2xl font-bold text-blue-500">Bem vindo, este é seu Painel de operações</h1>
      
      
        </div>
      <div className="flex items-center gap-2">
  <button
    onClick={() => setModalCriar(true)}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
  >
    Criar OS
  </button>

  {(usuario?.isGestor || usuario?.isAdmin) && (
    <button
      onClick={() => router.push("/painel/bi")}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
    >
      BI
    </button>
  )}

  <button
    onClick={handleLogout}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
  >
    Logout
  </button>
</div>

      </div>

      {/* Abas */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold transition ${
            abaAtiva === "ordens" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setAbaAtiva("ordens")}
        >
          Ordens
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold transition ${
            abaAtiva === "relatorios" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setAbaAtiva("relatorios")}
        >
          Relatórios
        </button>
      </div>

      {/* Aba Ordens */}
      {abaAtiva === "ordens" && (
        <>
          {/* Filtros e busca */}
          <div className="flex flex-wrap gap-4 mb-6 w-full max-w-6xl">
            <div className="flex gap-2">
              {["Todas", "Pendentes", "Concluídas"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFiltro(status)}
                  className={`px-4 py-2 rounded font-semibold transition ${
                    filtro === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Buscar por número da OS"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="border p-2 rounded flex-1 min-w-[200px]"
            />
          </div>

          {/* Lista de Ordens */}
          {loading ? (
            <p className="text-gray-500">Carregando ordens...</p>
          ) : ordensFiltradas.length === 0 ? (
            <p className="text-gray-500">Nenhuma ordem encontrada.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-6xl">
              {ordensFiltradas.map((os) => (
                <div
                  key={os.numeroOs}
                  className="flex cursor-pointer rounded shadow hover:shadow-lg transition relative"
                  onClick={() => handleSelectOrdem(os)}
                >
                  <div className={`w-2 rounded-l ${getStatusColor(os.status)}`}></div>
                  <div className="flex flex-col p-2 text-sm flex-1">
                    <p className="font-semibold">#{os.numeroOs}</p>
                    <p className="capitalize">{os.status}</p>
                    <p>{os.data}</p>
                  </div>
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

      {/* Aba Relatórios */}
      {abaAtiva === "relatorios" && (
        <div className="w-full max-w-6xl flex flex-col gap-6">
          <div className="flex gap-4">
            <button
              onClick={exportExcel}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Exportar Excel
            </button>
            <button
              onClick={exportPDF}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Exportar PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Ordens por Técnico</h3>
              <Bar
                data={{
                  labels: Object.keys(ordensPorTecnico),
                  datasets: [
                    {
                      label: "Qtd. de OS",
                      data: Object.values(ordensPorTecnico),
                      backgroundColor: "rgba(59,130,246,0.7)",
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Ordens por Mês</h3>
              <Line
                data={{
                  labels: Object.keys(ordensPorMes),
                  datasets: [
                    {
                      label: "Qtd. de OS",
                      data: Object.values(ordensPorMes),
                      borderColor: "rgba(59,130,246,1)",
                      backgroundColor: "rgba(59,130,246,0.3)",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar OS */}
      {modalCriar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Criar Nova OS</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Cliente *"
                value={novoCliente}
                onChange={(e) => setNovoCliente(e.target.value)}
                className="border p-2 rounded"
              />
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
      onChange={async (e) => {
        const novoTecnicoUid = e.target.value;
        const ordemRef = doc(db, "ordens_servico", selectedOrdem.numeroOs.toString());

        // Buscar dados completos do técnico selecionado
        const tecnicoSelecionado = usuarios.find(u => u.uid === novoTecnicoUid);

        // Atualizar Firestore com TODOS os campos necessários
        await updateDoc(ordemRef, {
          tecnicoId: novoTecnicoUid,     // <- CAMPO CORRETO!!!
          tecnicoUid: novoTecnicoUid,    // compatibilidade
          usuarioId: novoTecnicoUid,     // opcional, se usa esse campo também
          tecnico: tecnicoSelecionado?.nome || tecnicoSelecionado?.email || "",
          tecnicoEmail: tecnicoSelecionado?.email || "",
          tecnicoNome: tecnicoSelecionado?.nome || "",
        });

        // Atualizar no modal
        setSelectedOrdem(prev => ({
          ...prev,
          tecnicoId: novoTecnicoUid,
          tecnicoUid: novoTecnicoUid,
          usuarioId: novoTecnicoUid,
          tecnico: tecnicoSelecionado?.nome || tecnicoSelecionado?.email || "",
        }));

        // Atualizar lista principal
        setOrdens(prev =>
          prev.map(o =>
            o.numeroOs === selectedOrdem.numeroOs
              ? {
                  ...o,
                  tecnicoId: novoTecnicoUid,
                  tecnicoUid: novoTecnicoUid,
                  usuarioId: novoTecnicoUid,
                  tecnico: tecnicoSelecionado?.nome || tecnicoSelecionado?.email || "",
                }
              : o
          )
        );
      }}
      className="border p-1 rounded w-full mt-1"
    >
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
          <option value="aberto">Aberto</option>
          <option value="em andamento">Em andamento</option>
          <option value="encerrado">Encerrado</option>
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
}
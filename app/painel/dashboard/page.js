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
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import Image from "next/image";

// Bibliotecas para exportação
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Bibliotecas para gráficos
import { Bar, Pie, Line } from "react-chartjs-2";
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
  const [abaAtiva, setAbaAtiva] = useState("ordens"); // controla aba ativa
  const router = useRouter();

  // Logout
  const handleLogout = async () => {
    await auth.signOut();
    router.push("/painel");
  };

  // Busca ordens do usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setOrdens([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const q = query(
          collection(db, "ordens_servico"),
          where("usuarioId", "==", user.uid)
        );
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
    });

    return () => unsubscribe();
  }, []);

  // Define cor do status
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

    const ordemRef = doc(db, "ordens_servico", selectedOrdem.id);
    await updateDoc(ordemRef, {
      status: novoStatus,
      observacoes: arrayUnion(novaObs),
    });

    setOrdens((prev) =>
      prev.map((o) =>
        o.id === selectedOrdem.id
          ? {
              ...o,
              status: novoStatus,
              observacoes: [...(o.observacoes || []), novaObs],
            }
          : o
      )
    );
    setNovaObs("");
    setSelectedOrdem(null);
  };

  // Filtra ordens
  const ordensFiltradas = ordens.filter((os) => {
    const filtroStatus =
      filtro === "Pendentes"
        ? os.status !== "encerrado"
        : filtro === "Concluídas"
        ? os.status === "encerrado"
        : true;

    const filtroBusca =
      busca === "" || os.numeroOs.toLowerCase().includes(busca.toLowerCase());

    return filtroStatus && filtroBusca;
  });

  // --- Funções para exportar ---
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

    autoTable(docPDF, { head: head, body: body });
    docPDF.save("Ordens.pdf");
  };

  // --- Dados para gráficos ---
  const ordensPorTecnico = ordensFiltradas.reduce((acc, os) => {
    acc[os.tecnico] = (acc[os.tecnico] || 0) + 1;
    return acc;
  }, {});

  const ordensPorMes = ordensFiltradas.reduce((acc, os) => {
    const mes = new Date(os.inicio).toLocaleString("default", { month: "short", year: "numeric" });
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {});

  const tempoMedio = ordensFiltradas
    .filter((o) => o.inicio && o.fim)
    .map((o) => (new Date(o.fim) - new Date(o.inicio)) / (1000 * 60)) // minutos
  const mediaTempo = tempoMedio.length ? (tempoMedio.reduce((a, b) => a + b, 0) / tempoMedio.length).toFixed(2) : 0;

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-6 pt-16">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Logo C-SEM" width={50} height={50} />
          <h1 className="text-3xl font-bold text-blue-600">Painel do Cliente</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
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

      {/* --- Aba Ordens --- */}
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
                  key={os.id}
                  className="flex cursor-pointer rounded shadow hover:shadow-lg transition"
                  onClick={() => handleSelectOrdem(os)}
                >
                  <div className={`w-2 rounded-l ${getStatusColor(os.status)}`}></div>
                  <div className="flex flex-col p-2 text-sm">
                    <p className="font-semibold">#{os.numeroOs}</p>
                    <p className="capitalize">{os.status}</p>
                    <p>{os.data}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

{/* --- Aba Relatórios --- */}
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

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Tempo médio de reparo (minutos)</h3>
        <p className="text-xl font-bold">
          {(() => {
            // Cálculo da média de tempo
            const tempos = ordens
              .filter(
                (os) =>
                  os.inicio &&
                  os.fim &&
                  os.inicio.includes("-") &&
                  os.fim.includes("-")
              )
              .map((os) => {
                const inicioTS = Number(os.inicio.split("-")[1].trim());
                const fimTS = Number(os.fim.split("-")[1].trim());
                if (isNaN(inicioTS) || isNaN(fimTS)) return 0;
                return (fimTS - inicioTS) / 1000 / 60; // minutos
              });

            if (tempos.length === 0) return "0 min";

            const mediaMinutos =
              tempos.reduce((acc, t) => acc + t, 0) / tempos.length;
            const horas = Math.floor(mediaMinutos / 60);
            const minutos = Math.round(mediaMinutos % 60);

            return horas > 0 ? `${horas}h ${minutos}min` : `${minutos}min`;
          })()}
        </p>
      </div>
    </div>
  </div>
)}

      {/* --- Modal de detalhes --- */}
      {selectedOrdem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-2">OS #{selectedOrdem.numeroOs}</h2>
            <p><strong>Cliente:</strong> {selectedOrdem.cliente}</p>
            <p><strong>Modelo:</strong> {selectedOrdem.modelo}</p>
            <p><strong>Número de Série:</strong> {selectedOrdem.numeroSerie}</p>
            <p><strong>Técnico:</strong> {selectedOrdem.tecnico}</p>
            <p><strong>Início:</strong> {selectedOrdem.inicio}</p>
            <p><strong>Fim:</strong> {selectedOrdem.fim}</p>

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
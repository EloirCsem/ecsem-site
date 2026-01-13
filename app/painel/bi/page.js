"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";


/* 🔹 KPI COMPONENT */
function KPI({ titulo, valor, destaque }) {
  return (
    <div
      className={`rounded-2xl p-8 text-center font-bold shadow-xl ${
        destaque
          ? "bg-red-300 text-red-900"
          : "bg-white"
      }`}
    >
      <p className="text-lg tracking-widest uppercase">
        {titulo}
      </p>

      <p className="text-4xl mt-8">
        {valor}
      </p>
    </div>
  );
}

export default function BI() {
  const [ordens, setOrdens] = useState([]);
  const [user, setUser] = useState(null);
  const [hora, setHora] = useState(new Date());

  /* 🔐 Usuário logado */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      if (u) setUser(u);
    });
    return () => unsub();
  }, []);

  const [mounted, setMounted] = useState(false);

  
useEffect(() => {
  setMounted(true);
}, []);

  /* ⏱️ Relógio ao vivo */
  useEffect(() => {
    const timer = setInterval(() => {
      setHora(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* 🔥 Firestore em tempo real (segurança por gestor) */
  useEffect(() => {
    if (!user) return;

    const q = query(
  collection(db, "ordens_servico"),
  where("clienteId", "==", user.uid)
);

    const unsub = onSnapshot(q, snap => {
      const dados = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setOrdens(dados);
    });

    return () => unsub();
  }, [user]);

  /* 🧠 Nome do gestor (sem e-mail feio) */
  const nomeGestor = user?.email
    ? user.email.split("@")[0].toUpperCase()
    : "";

  /* 📊 KPIs */
  const abertas = ordens.filter(o => o.status === "Aberto").length;
  const andamento = ordens.filter(o => o.status === "Em andamento").length;
  const encerradas = ordens.filter(o => o.status === "Encerrado").length;

  /* 🚨 OS paradas */
  const DIAS_LIMITE = 2;
  const agora = Date.now();

  const osParadas = ordens.filter(o => {
    if (o.status === "Encerrado") return false;
    if (!o.inicioTS) return false;
    const dias = (agora - o.inicioTS) / (1000 * 60 * 60 * 24);
    return dias >= DIAS_LIMITE;
  });

  /* 🧠 Tempo médio por técnico */
  const tempoPorTecnico = {};

  ordens.forEach(o => {
    if (!o.tecnico || !o.inicioTS || !o.fimTS) return;

    const horas = (o.fimTS - o.inicioTS) / (1000 * 60 * 60);

    if (!tempoPorTecnico[o.tecnico]) {
      tempoPorTecnico[o.tecnico] = { total: 0, qtd: 0 };
    }

    tempoPorTecnico[o.tecnico].total += horas;
    tempoPorTecnico[o.tecnico].qtd += 1;
  });

  const mediaPorTecnico = Object.entries(tempoPorTecnico).map(
    ([tecnico, v]) => ({
      tecnico,
      media: Number((v.total / v.qtd).toFixed(1))
    })
  );

  /* 🏆 Ranking produtividade */
  const ranking = Object.entries(
    ordens.reduce((acc, o) => {
      if (o.status === "Encerrado" && o.tecnico) {
        acc[o.tecnico] = (acc[o.tecnico] || 0) + 1;
      }
      return acc;
    }, {})
  )
    .map(([tecnico, total]) => ({ tecnico, total }))
    .sort((a, b) => b.total - a.total);

  /* 📈 Gráfico */
  const chartData = [
    { name: "Abertas", value: abertas },
    { name: "Em andamento", value: andamento },
    { name: "Encerradas", value: encerradas }
  ];

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  return (
   <div className="min-h-screen bg-slate-800 text-gray-900 p-10">
      
      {/* 🟡 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-yellow-500">
          {nomeGestor}
        </h1>

        <div className="text-right text-gray-600">
            {mounted && (
  <>
    <p className="text-xl font-bold">
      {hora.toLocaleTimeString()}
    </p>
    <p className="text-sm">
      {hora.toLocaleDateString()}
    </p>
  </>
)}
          <p className="text-xl font-bold">
            {hora.toLocaleTimeString()}
          </p>
          <p className="text-sm">
            {hora.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* 📊 KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPI titulo="ABERTAS" valor={abertas} />
        <KPI titulo="EM ANDAMENTO" valor={andamento} />
        <KPI titulo="ENCERRADAS" valor={encerradas} />
        <KPI
          titulo={`OS PARADAS +${DIAS_LIMITE} DIAS`}
          valor={osParadas.length}
          destaque
        />
      </div>

      {/* 📈 GRÁFICOS */}
      <div className="grid grid-cols-3 gap-4 mb-6 h-64">
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-center text-gray-500 mb-2">
            Status das OS
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" label>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 bg-white rounded-xl p-4 shadow">
          <p className="font-bold mb-2">
            Tempo médio por técnico (h)
          </p>
          <ul className="space-y-1">
            {mediaPorTecnico.map(t => (
              <li key={t.tecnico}>
                {t.tecnico}: {t.media}h
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 🏆 RANKING */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow">
        <p className="font-bold mb-2">
          Ranking de Produtividade
        </p>
        <ol className="list-decimal ml-6 space-y-1">
          {ranking.map(r => (
            <li key={r.tecnico}>
              {r.tecnico} — {r.total} OS
            </li>
          ))}
        </ol>
      </div>

      {/* 📋 TABELA */}
      <div className="bg-white rounded-xl overflow-auto shadow">
        <table className="w-full text-lg">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-3 text-center">OS</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Técnico</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Início</th>
              <th className="p-3 text-center">Fim</th>
            </tr>
          </thead>
          <tbody>
            {ordens.map(o => (
              <tr
                key={o.id}
                className={`border-b ${
                  osParadas.find(p => p.id === o.id)
                    ? "bg-red-200 animate-pulse"
                    : ""
                }`}
              >
                <td className="p-3 text-center font-bold">
                  {o.numeroOs}
                </td>
                <td className="p-3">{o.cliente}</td>
                <td className="p-3">{o.tecnico || "-"}</td>
                <td className="p-3 text-center font-bold">
                  {o.status}
                </td>
                <td className="p-3 text-center">{o.inicio}</td>
                <td className="p-3 text-center">{o.fim}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
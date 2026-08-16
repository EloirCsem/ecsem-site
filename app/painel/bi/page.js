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
              : "bg-gradient-to-br from-white to-slate-100"
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
      const [dataInicial, setDataInicial] = useState("");
     const [dataFinal, setDataFinal] = useState("");
     const [tecnicoFiltro, setTecnicoFiltro] = useState("");
     const [clienteFiltro, setClienteFiltro] = useState("");
     const [listaTecnicos, setListaTecnicos] = useState([]);
     const [listaClientes, setListaClientes] = useState([]);

      /* 🔐 Usuário logado */
      useEffect(() => {
        const unsub = auth.onAuthStateChanged(u => {
          if (u) setUser(u);
        });
        return () => unsub();
      }, []);

    useEffect(() => {
  if (!user?.uid) return;

  const unsub = onSnapshot(collection(db, "usuarios"), snap => {
    const techs = snap.docs
      .map(d => {
        const u = d.data();

        const tipo = String(u.tipo || u.role || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim();

        const gestorOk = u.gestorId === user.uid;

        if (tipo !== "tecnico") return null;
        if (!gestorOk) return null;

        return (u.nome || u.displayName || "").trim();
      })
      .filter(Boolean);

    setListaTecnicos([...new Set(techs)]);
  });

  return () => unsub();
}, [user?.uid]);

useEffect(() => {
  if (!user) return;

  const unsub = onSnapshot(collection(db, "usuarios"), snap => {
    const clients = snap.docs
      .map(d => {
        const u = d.data();

        const tipo = String(u.tipo || u.role || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim();

        const gestorOk = u.gestorId === user.uid;

        if (tipo !== "cliente") return null;
        if (!gestorOk) return null;

        return (u.nome || u.displayName || "").trim();
      })
      .filter(Boolean);

    setListaClientes([...new Set(clients)]);
  });

  return () => unsub();
}, [user]);


      const [mounted, setMounted] = useState(false);

      const [aba, setAba] = useState("operacao");
      
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
      where("gestorId", "==", user.uid)
    );

        const unsub = onSnapshot(q, snap => {
          const dados = snap.docs
      .map(d => ({
        id: d.id,
        ...d.data()
      }))
      .sort((a, b) => Number(b.numeroOs) - Number(a.numeroOs));
          setOrdens(dados);
        });

        return () => unsub();
      }, [user]);

      /* 🧠 Nome do gestor (sem e-mail feio) */
      const nomeGestor = user?.email
        ? user.email.split("@")[0].toUpperCase()
        : "";

        
    const ordensFiltradas = ordens.filter(o => {

      if (!o.dataCriacao) return false;

      if (dataInicial && dataFinal) {

        const dataOS = new Date(o.dataCriacao);

        const inicio = new Date(dataInicial);
        const fim = new Date(dataFinal);

        fim.setHours(23, 59, 59, 999);

        if (
          dataOS < inicio ||
          dataOS > fim
        ) {
          return false;
        }
      }
    const norm = (v) => (v || "").trim();

    if (
      tecnicoFiltro &&
      norm(o.tecnico) !== norm(tecnicoFiltro)
    ) {
      return false;
    }

      if (
        clienteFiltro &&
        o.cliente !== clienteFiltro
      ) {
        return false;
      }

      return true;
    });

    const tecnicos = [
      ...new Set([
        ...listaTecnicos, // Garante que todos os cadastrados apareçam primeiro
        ...ordens.map(o => String(o.tecnico || "").trim()) // Adiciona os das OS se houver
      ])
    ]
    .filter(nome => nome && nome !== "undefined" && nome !== "")
    .sort((a, b) => a.localeCompare(b, "pt-BR"));


    const clientes = [
      ...new Set(
        ordens
          .filter(o => o.cliente)
          .map(o => o.cliente)
      )
    ].sort();

    const dados = ordensFiltradas;


        
      /* 📊 KPIs */
      const abertas = dados.filter(
      o => (o.status || "").toLowerCase() === "aberto"
    ).length;

    const andamento = dados.filter(
      o => (o.status || "").toLowerCase() === "em andamento"
    ).length;


    const encerradas = dados.filter(
      o => (o.status || "").toLowerCase() === "encerrado"
    ).length;

    /* =========================
      TÉCNICOS ATIVOS
    ========================= */

    const tecnicosAtivos = listaTecnicos.length;

const tecnicosComOS = new Set(
  dados
    .filter(o => o.tecnico && o.tecnico.trim() !== "")
    .map(o => o.tecnico)
).size;

    /* =========================
      % CONCLUÍDO
    ========================= */

    const percentualConcluido =
      dados.length > 0
        ? Math.round((encerradas / dados.length) * 100)
        : 0;

    /* =========================
      MTTR
    ========================= */

    const osEncerradasComTempo = dados.filter(
      o =>
        (o.status || "").toLowerCase() === "encerrado" &&
        o.inicioTimestamp &&
        o.fimTimestamp
    );

    const mttr =
      osEncerradasComTempo.length > 0
        ? (
            osEncerradasComTempo.reduce(
              (acc, o) =>
                acc +
                (o.fimTimestamp - o.inicioTimestamp) /
                  (1000 * 60 * 60),
              0
            ) /
            osEncerradasComTempo.length
          ).toFixed(1)
        : "0";

    const horasProdutivas =
      (
        dados
          .filter(
            o =>
              (o.status || "").toLowerCase() === "encerrado" &&
              o.duracaoMinutos
          )
          .reduce(
            (acc, o) => acc + Number(o.duracaoMinutos || 0),
            0
          ) / 60
      ).toFixed(1);

      const mediaHorasOS =
      encerradas > 0
        ? (
            Number(horasProdutivas) /
            encerradas
          ).toFixed(1)
        : 0;

        const produtividadeTecnicos = {};

    dados.forEach(o => {

      if (
        (o.status || "").toLowerCase() !== "encerrado"
      ) return;

      if (!o.tecnico) return;

      produtividadeTecnicos[o.tecnico] =
        (produtividadeTecnicos[o.tecnico] || 0) +
        Number(o.duracaoMinutos || 0);

    });

    const tecnicoTop =
      Object.entries(produtividadeTecnicos)
        .sort((a, b) => b[1] - a[1])[0];

    const datasUnicas = [
      ...new Set(
        dados
          .filter(o => o.dataCriacao)
          .map(o =>
            new Date(o.dataCriacao)
              .toLocaleDateString("pt-BR")
          )
      )
    ];

    let horasDisponiveis = 0;

    datasUnicas.forEach(dataStr => {

      const [dia, mes, ano] = dataStr.split("/");

      const data = new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia)
      );

      const semana = data.getDay();

      // sexta
      if (semana === 5) {
        horasDisponiveis +=
      9 * tecnicosAtivos;
      }

      // seg a qui
      else if (
        semana >= 1 &&
        semana <= 4
      ) {
        horasDisponiveis +=
      10 * tecnicosAtivos;
      }
    });

    const horasImprodutivas =
    (
      horasDisponiveis -
      Number(horasProdutivas)
    ).toFixed(1);

    const ocupacao =
    horasDisponiveis > 0
      ? (
          Number(horasProdutivas) /
          horasDisponiveis *
          100
        ).toFixed(0)
      : 0;

    console.log("Horas Produtivas:", horasProdutivas);
    console.log("Horas Disponiveis:", horasDisponiveis);
    console.log("Tecnicos Ativos:", tecnicosAtivos);

    /* =========================
      SLA
    ========================= */


        
    const totalOS = dados.length;

      /* 🚨 OS paradas */
      const DIAS_LIMITE = 2;
      const agora = Date.now();

      const osParadas = dados.filter(o => {

      if ((o.status || "").toLowerCase() === "encerrado")
        return false;

      if (!o.dataCriacao)
        return false;

      const dias =
        (Date.now() -
          new Date(o.dataCriacao).getTime()) /
        (1000 * 60 * 60 * 24);

      return dias >= 7;
    });

          /* 🧠 Tempo médio por técnico (Blindagem Total contra NaN) */
      const tempoPorTecnico = {};
      let totalHorasEmpresa = 0;
      let totalQtdEmpresa = 0;

      dados.forEach(o => {
        // Se a OS não tiver técnico cadastrado, pula para não quebrar o gráfico
        if (!o.tecnico) return;

        let duracaoEmHoras = 0;

        // Plano A: Puxa a duração direta se o app já tiver calculado em minutos
        if (o.duracaoMinutos && !isNaN(Number(o.duracaoMinutos)) && Number(o.duracaoMinutos) > 0) {
          duracaoEmHoras = Number(o.duracaoMinutos) / 60;
        } 
        // Plano B: Se não tiver a duração em minutos, tenta calcular pelas strings "HH:MM" de texto
        else if (o.inicio && o.fim && o.inicio.includes(":") && o.fim.includes(":")) {
          const partsIni = o.inicio.split(":");
          const partsFim = o.fim.split(":");

          if (partsIni.length === 2 && partsFim.length === 2) {
            const hIni = parseInt(partsIni[0], 10);
            const mIni = parseInt(partsIni[1], 10);
            const hFim = parseInt(partsFim[0], 10);
            const mFim = parseInt(partsFim[1], 10);

            // Garante que todas as conversões para número deram certo antes de somar
            if (!isNaN(hIni) && !isNaN(mIni) && !isNaN(hFim) && !isNaN(mFim)) {
              const minutosInicio = (hIni * 60) + mIni;
              const minutosFim = (hFim * 60) + mFim;
              const diferencaMinutos = minutosFim - minutosInicio;
              
              if (diferencaMinutos > 0) {
                duracaoEmHoras = diferencaMinutos / 60;
              }
            }
          }
        }

        // 🛡️ TRAVA ANT-NaN: Se por qualquer motivo o cálculo falhou ou deu zero, descarta esta OS
        if (duracaoEmHoras <= 0 || isNaN(duracaoEmHoras)) return;

        // Inicializa o acumulador do técnico de forma limpa com números puros
        if (!tempoPorTecnico[o.tecnico]) {
          tempoPorTecnico[o.tecnico] = { totalHoras: 0, qtdOs: 0, media: 0 };
        }

        // Acumula os valores com segurança
        tempoPorTecnico[o.tecnico].totalHoras += duracaoEmHoras;
        tempoPorTecnico[o.tecnico].qtdOs += 1;

        totalHorasEmpresa += duracaoEmHoras;
        totalQtdEmpresa += 1;
      });

      // 🔥 CÁLCULO DA MÉDIA REAL POR TÉCNICO
      Object.keys(tempoPorTecnico).forEach(tecnicoNome => {
        const t = tempoPorTecnico[tecnicoNome];
        if (t.qtdOs > 0 && t.totalHoras > 0) {
          t.media = Number((t.totalHoras / t.qtdOs).toFixed(1));
        } else {
          t.media = 0;
        }
      })

      // 🏆 CÁLCULO DO KPI GERAL DA EMPRESA
      const kpiTempoMedioGeral = totalQtdEmpresa > 0 && totalHorasEmpresa > 0
        ? Number((totalHorasEmpresa / totalQtdEmpresa).toFixed(1)) 
        : 0;

      // 🚀 CONVERSÃO PARA ARRAY DO GRÁFICO (CORRIGIDO E SEGURO)
      const mediaPorTecnico = Object.entries(tempoPorTecnico).map(
        ([tecnico, v]) => {
          // Garante que só faça a divisão se houver horas e ordens válidas acumuladas
          const mediaCalculada = v.qtdOs > 0 ? (v.totalHoras / v.qtdOs) : 0;
          
          return {
            tecnico,
            // Arredonda para 1 casa decimal sem risco de gerar NaN
            media: Number(mediaCalculada.toFixed(1))
          };
        }
      );


      /* 🏆 Ranking produtividade */
      const ranking = Object.entries(
        dados.reduce((acc, o) => {
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

        <div className="text-right text-white">
  {mounted && (
    <>
      <p className="text-2xl font-bold">
        {hora.toLocaleTimeString()}
      </p>
      <p className="text-sm">
        {hora.toLocaleDateString()}
      </p>
    </>
  )}
</div>
      </div>

<div className="bg-white rounded-xl p-4 mb-6 shadow flex gap-4 flex-wrap">

  <input
    type="date"
    value={dataInicial}
    onChange={(e) =>
      setDataInicial(e.target.value)
    }
  />

  <input
    type="date"
    value={dataFinal}
    onChange={(e) =>
      setDataFinal(e.target.value)
    }
  />

  <select
    value={tecnicoFiltro}
    onChange={(e) =>
      setTecnicoFiltro(e.target.value)
    }
    className="border rounded px-3"
  >
    <option value="">
      Todos os técnicos
    </option>

    {tecnicos.map(t => (
      <option key={t} value={t}>
        {t}
      </option>
    ))}
  </select>

  <select
    value={clienteFiltro}
    onChange={(e) =>
      setClienteFiltro(e.target.value)
    }
    className="border rounded px-3"
  >
    <option value="">
      Todos os clientes
    </option>

    {listaClientes.map(c => (
      <option key={c} value={c}>
        {c}
      </option>
    ))}
  </select>

</div>


<div className="flex gap-2 mb-6">

  <button
    onClick={() => setAba("operacao")}
    className={`px-4 py-2 rounded-xl font-bold ${
      aba === "operacao"
        ? "bg-yellow-500 text-black"
        : "bg-white"
    }`}
  >
    Operação
  </button>

  <button
    onClick={() => setAba("produtividade")}
    className={`px-4 py-2 rounded-xl font-bold ${
      aba === "produtividade"
        ? "bg-yellow-500 text-black"
        : "bg-white"
    }`}
  >
    Produtividade
  </button>

  <button
    onClick={() => setAba("tecnicos")}
    className={`px-4 py-2 rounded-xl font-bold ${
      aba === "tecnicos"
        ? "bg-yellow-500 text-black"
        : "bg-white"
    }`}
  >
    Técnicos
  </button>

</div>


      {/* 📊 KPIs */}

  {/* OPERAÇÃO */}

{aba === "operacao" && (

<div className="grid grid-cols-3 gap-4 mb-6">

  <KPI titulo="TOTAL OS" valor={totalOS} />

  <KPI titulo="ABERTAS" valor={abertas} />

  <KPI titulo="EM ANDAMENTO" valor={andamento} />

  <KPI titulo="ENCERRADAS" valor={encerradas} />

  <KPI
    titulo="% CONCLUÍDO"
    valor={`${percentualConcluido}%`}
  />

  <KPI
    titulo="OS PARADAS"
    valor={osParadas.length}
    destaque
  />

</div>

)}



{aba === "produtividade" && (

<div className="grid grid-cols-3 gap-4 mb-6">

  <KPI
    titulo="MTTR"
    valor={`${mttr}h`}
  />

  <KPI
    titulo="HORAS PRODUTIVAS"
    valor={`${horasProdutivas}h`}
  />

  <KPI
    titulo="HORAS IMPRODUTIVAS"
    valor={`${horasImprodutivas}h`}
  />

  <KPI
    titulo="OCUPAÇÃO"
    valor={`${ocupacao}%`}
  />

  <KPI
    titulo="MÉDIA POR OS"
    valor={`${mediaHorasOS}h`}
  />

  <KPI
    titulo="TOP TÉCNICO"
    valor={tecnicoTop?.[0] || "-"}
  />

</div>

)}


{aba === "tecnicos" && (

<div className="grid grid-cols-3 gap-4 mb-6">

<KPI
  titulo="TÉCNICOS CADASTRADOS"
  valor={tecnicosAtivos}
/>

<KPI
  titulo="TÉCNICOS COM OS"
  valor={tecnicosComOS}
/>

<KPI
  titulo="TOP TÉCNICO"
  valor={tecnicoTop?.[0] || "-"}
/>

</div>

)}



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
            {dados.map(o => (
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
                 <td className="p-3">{o.tecnico || "Não atribuído"}</td>
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
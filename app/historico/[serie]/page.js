"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { use } from "react";

export default function Historico({ params }) {

  const [ordens, setOrdens] = useState([]);

  const { serie } = use(params);

  useEffect(() => {

    async function carregar() {

      const q = query(
        collection(db, "ordens_servico"),
        where("numeroSerie", "==", serie)
      );

      const snap = await getDocs(q);

      const dados = snap.docs
  .map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  .sort(
    (a, b) =>
      Number(b.numeroOs) -
      Number(a.numeroOs)
  );

      setOrdens(dados);
    }

    carregar();

  }, [serie]);

return (

  <div className="min-h-screen bg-slate-900">

```
{/* HEADER */}

<div className="bg-gradient-to-r from-slate-950 to-slate-800 border-b border-slate-700">

  <div className="max-w-6xl mx-auto px-6 py-10">

    <div className="flex items-center gap-4">

      <div className="text-5xl">
        🔧
      </div>

      <div>

        <h1 className="text-4xl font-bold text-white">
          CSEM
        </h1>

        <p className="text-slate-300">
          Histórico do Equipamento
        </p>

      </div>

    </div>

  </div>

</div>

<div className="max-w-6xl mx-auto p-6">

  {/* RESUMO */}

  <div className="grid md:grid-cols-3 gap-4 mb-8">

    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">

      <p className="text-slate-400 text-sm uppercase">
        Número de Série
      </p>

      <p className="text-white text-2xl font-bold mt-2">
        {serie}
      </p>

    </div>

    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">

      <p className="text-slate-400 text-sm uppercase">
        Modelo
      </p>

      <p className="text-white text-2xl font-bold mt-2">
        {ordens[0]?.modelo || "-"}
      </p>

    </div>

    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">

      <p className="text-slate-400 text-sm uppercase">
        Total de Manutenções
      </p>

      <p className="text-yellow-400 text-3xl font-bold mt-2">
        {ordens.length}
      </p>

    </div>

  </div>

  {/* TITULO */}

  <div className="flex items-center gap-3 mb-6">

    <span className="text-2xl">
      📋
    </span>

    <h2 className="text-2xl font-bold text-white">
      Histórico de Manutenções
    </h2>

  </div>

  {/* LISTA */}

  <div className="space-y-4">

    {ordens.map(os => (

      <div
        key={os.id}
        className="
          bg-white
          rounded-2xl
          p-6
          shadow-xl
          hover:shadow-2xl
          transition
        "
      >

        <div className="flex justify-between items-start flex-wrap gap-4">

          <div>

            <h3 className="text-2xl font-bold text-slate-800">
              OS #{os.numeroOs}
            </h3>

            <div className="mt-3 space-y-1">

              <p className="text-slate-600">
                👨‍🔧 Técnico: {os.tecnico || "-"}
              </p>

              <p className="text-slate-600">
                📅 Data: {
                  os.dataCriacao
                    ? new Date(
                        os.dataCriacao
                      ).toLocaleDateString("pt-BR")
                    : "-"
                }
              </p>

              <p className="text-slate-600">
                📦 Modelo: {os.modelo || "-"}
              </p>

            </div>

          </div>

          <div className="flex flex-col items-end gap-3">

            <span
              className={`
                px-4 py-2 rounded-full text-sm font-bold
                ${
                  (os.status || "").toLowerCase() === "encerrado"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }
              `}
            >
              {os.status}
            </span>

            {os.pdfUrl && (

              <a
                href={os.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-5
                  py-3
                  rounded-xl
                  font-bold
                "
              >
                📄 Visualizar PDF
              </a>

            )}

          </div>

        </div>

      </div>

    ))}

  </div>

</div>
```

  </div>
);
}
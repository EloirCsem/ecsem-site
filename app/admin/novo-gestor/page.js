"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

import { useRouter } from "next/navigation";

export default function NovoGestor() {

  const router = useRouter();

  const [usuarios, setUsuarios] = useState([]);
  const [gestorId, setGestorId] = useState("");
  const [tecnicos, setTecnicos] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    async function carregar() {

      const snap = await getDocs(collection(db, "usuarios"));

      const lista = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsuarios(lista);
    }

    carregar();
  }, []);

  function toggleTecnico(id) {
    setTecnicos(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }

  function toggleCliente(id) {
    setClientes(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }

  async function salvar() {

  if (!gestorId) {
    alert("Selecione um gestor");
    return;
  }

  // GESTOR
  await updateDoc(doc(db, "usuarios", gestorId), {
    tipo: "gestor",
    isGestor: true,
    isAdmin: false,
    usuarioId: gestorId,
    gestorId: gestorId // 🔥 garante consistência geral
  });

  // TÉCNICOS
  for (const id of tecnicos) {
    await updateDoc(doc(db, "usuarios", id), {
      tipo: "tecnico",
      usuarioId: id,
      gestorId: gestorId, // ✅ ISSO É O QUE VOCÊ QUERIA GARANTIR
      isGestor: false,
      isAdmin: false
    });
  }

  // CLIENTES
  for (const id of clientes) {

    const cliente = usuarios.find(u => u.id === id);

    await updateDoc(doc(db, "usuarios", id), {
      tipo: "cliente",
      clienteId: id,
      gestorId: gestorId, // ✅ já estava certo
      cliente: cliente?.nome || "",
      ativo: true
    });
  }

  alert("Cadastro realizado");
  router.push("/admin");
}

  const gestores = usuarios.filter(u => u.email);

  const tecnicosLista = usuarios.filter(u =>
    !u.tipo || u.tipo === "tecnico"
  );

  const clientesLista = usuarios.filter(u =>
    !u.tipo || u.tipo === "cliente"
  );

  return (
    <div className="min-h-screen bg-slate-900 p-10 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Novo Gestor
      </h1>

      <div className="bg-white text-black rounded-xl p-6">

        {/* GESTOR */}
        <h2 className="font-bold text-xl mb-4">
          Gestor
        </h2>

        {gestores.map(u => (
          <div key={u.id} className="mb-2">
            <label>
              <input
                type="radio"
                name="gestor"
                onChange={() => setGestorId(u.id)}
              />
              <span className="ml-2">{u.nome}</span>
            </label>
          </div>
        ))}

        <hr className="my-6" />

        {/* TECNICOS */}
        <h2 className="font-bold text-xl mb-4">
          Técnicos
        </h2>

        {tecnicosLista.map(u => (
          <div key={u.id} className="mb-2">
            <label>
              <input
                type="checkbox"
                checked={tecnicos.includes(u.id)}
                onChange={() => toggleTecnico(u.id)}
              />
              <span className="ml-2">{u.nome}</span>
            </label>
          </div>
        ))}

        <hr className="my-6" />

        {/* CLIENTES */}
        <h2 className="font-bold text-xl mb-4">
          Clientes
        </h2>

        {clientesLista.map(u => (
          <div key={u.id} className="mb-2">
            <label>
              <input
                type="checkbox"
                checked={clientes.includes(u.id)}
                onChange={() => toggleCliente(u.id)}
              />
              <span className="ml-2">{u.nome}</span>
            </label>
          </div>
        ))}

        <button
          onClick={salvar}
          className="mt-8 bg-green-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Salvar
        </button>

      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { db } from "../../../../firebaseConfig";
import { useParams } from "next/navigation";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc
} from "firebase/firestore";

export default function GestorPage() {

  const params = useParams();
  const id = params.id;

  const [gestor, setGestor] = useState(null);
  const [usuariosPendentes, setUsuariosPendentes] = useState([]);

  const [selecionadosTecnicos, setSelecionadosTecnicos] = useState([]);
  const [selecionadosClientes, setSelecionadosClientes] = useState([]);

  async function carregar() {

    const gestorSnap = await getDoc(
      doc(db, "usuarios", id)
    );

    if (gestorSnap.exists()) {
      setGestor({
        id: gestorSnap.id,
        ...gestorSnap.data()
      });
    }

    const usuariosSnap = await getDocs(
      collection(db, "usuarios")
    );

    const usuarios = usuariosSnap.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(u => !u.tipo && u.email);

    setUsuariosPendentes(usuarios);
  }

  useEffect(() => {
    carregar();
  }, [id]);

  function toggleTecnico(uid) {
    setSelecionadosTecnicos(prev =>
      prev.includes(uid)
        ? prev.filter(x => x !== uid)
        : [...prev, uid]
    );
  }

  function toggleCliente(uid) {
    setSelecionadosClientes(prev =>
      prev.includes(uid)
        ? prev.filter(x => x !== uid)
        : [...prev, uid]
    );
  }

  async function salvar() {

    // TECNICOS
    for (const uid of selecionadosTecnicos) {

      await updateDoc(
        doc(db, "usuarios", uid),
        {
          tipo: "tecnico",
          clienteId: id,
          usuarioId: uid,
          gestorId: id, // ✅ corrigido aqui
          isGestor: false,
          isAdmin: false
        }
      );
    }

    // CLIENTES
    for (const uid of selecionadosClientes) {

      const cliente = usuariosPendentes.find(
        u => u.id === uid
      );

      await updateDoc(
        doc(db, "usuarios", uid),
        {
          tipo: "cliente",
          clienteId: uid,
          gestorId: id,
          cliente: cliente?.nome || "",
          ativo: true
        }
      );
    }

    alert("Vinculações realizadas");

    setSelecionadosClientes([]);
    setSelecionadosTecnicos([]);

    carregar();
  }

  if (!gestor) {
    return (
      <div className="p-10 text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-10">

      <h1 className="text-4xl text-white font-bold mb-8">
        {gestor.nome}
      </h1>

      <div className="bg-white rounded-xl p-6 mb-6">

        <p>
          <strong>Email:</strong> {gestor.email}
        </p>

        <p>
          <strong>UID:</strong> {gestor.id}
        </p>

      </div>

      <div className="bg-white rounded-xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Adicionar usuários ao gestor
        </h2>

        <h3 className="font-bold text-lg mb-3">
          Técnicos
        </h3>

        {usuariosPendentes.map(u => (
          <label key={`tec-${u.id}`} className="block mb-2">

            <input
              type="checkbox"
              checked={selecionadosTecnicos.includes(u.id)}
              onChange={() => toggleTecnico(u.id)}
            />

            <span className="ml-2">{u.nome}</span>

          </label>
        ))}

        <hr className="my-6" />

        <h3 className="font-bold text-lg mb-3">
          Clientes
        </h3>

        {usuariosPendentes.map(u => (
          <label key={`cli-${u.id}`} className="block mb-2">

            <input
              type="checkbox"
              checked={selecionadosClientes.includes(u.id)}
              onChange={() => toggleCliente(u.id)}
            />

            <span className="ml-2">{u.nome}</span>

          </label>
        ))}

        <button
          onClick={salvar}
          className="mt-8 bg-green-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Salvar Vinculações
        </button>

      </div>
    </div>
  );
}
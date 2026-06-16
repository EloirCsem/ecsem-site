"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";

import {
  collection,
  getDocs
} from "firebase/firestore";

import Link from "next/link";

export default function AdminPage() {


  const [gestores, setGestores] = useState([]);
const [pendentes, setPendentes] = useState([]);

useEffect(() => {

  async function carregar() {

    const snap = await getDocs(
      collection(db, "usuarios")
    );

    const usuarios = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setGestores(

      usuarios.filter(
        u =>
          u.tipo === "gestor" ||
          u.isGestor === true
      )

    );

    setPendentes(

      usuarios.filter(
        u =>
          !u.tipo &&
          u.email
      )

    );

  }

  carregar();

}, []);
return (

  <div className="min-h-screen bg-slate-900 p-10">

    <h1 className="text-4xl text-white font-bold mb-8">
      Painel Admin
    </h1>

    {/* GESTORES */}

    <h2 className="text-2xl text-yellow-400 mb-4">
      Gestores cadastrados
    </h2>

    <div className="space-y-3 mb-10">

      {gestores.map(gestor => (

        <Link
          key={gestor.id}
          href={`/admin/gestor/${gestor.id}`}
          className="
            block
            bg-white
            rounded-xl
            p-4
            font-bold
          "
        >
          {gestor.nome}
        </Link>

      ))}

    </div>

    {/* PENDENTES */}

    <h2 className="text-2xl text-yellow-400 mb-4">
      Usuários pendentes
    </h2>

    <div className="space-y-3 mb-10">

      {pendentes.map(usuario => (

        <div
          key={usuario.id}
          className="
            bg-slate-800
            text-white
            rounded-xl
            p-4
          "
        >
          <p className="font-bold">
            {usuario.nome}
          </p>

          <p className="text-sm opacity-70">
            {usuario.email}
          </p>
        </div>

      ))}

    </div>

    <Link
      href="/admin/novo-gestor"
      className="
        inline-block
        bg-green-600
        text-white
        px-6
        py-3
        rounded-xl
        font-bold
      "
    >
      + Novo Gestor
    </Link>

  </div>

);
}
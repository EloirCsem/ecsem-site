"use client";

import { useState, Suspense } from "react";
import { auth } from "../../firebaseConfig";
import {
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence
} from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";

function LoginForm() {

  const searchParams = useSearchParams();

  const redirect =
    searchParams.get("redirect") ||
    "/painel/dashboard";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const router = useRouter();

  async function entrar() {

    try {

      await setPersistence(
        auth,
        inMemoryPersistence
      );

      await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      router.push(redirect);

    } catch {

      setErro("Usuário ou senha inválidos");

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-white mb-6">
          Login CSEM
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded mb-3"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-3 rounded mb-3"
        />

        {erro && (
          <p className="text-red-400 mb-3">
            {erro}
          </p>
        )}

        <button
          onClick={entrar}
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Entrar
        </button>

      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
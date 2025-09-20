"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // ajuste o caminho se necessário

export default function ClienteLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/painel/dashboard"); // redireciona para o dashboard
    } catch (err) {
      setErro("Email ou senha inválidos.");
      console.error(err);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <section className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Área do Cliente
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border rounded text-gray-900"
              placeholder="Digite seu email"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700">Senha</span>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 p-2 border rounded text-gray-900"
              placeholder="Digite sua senha"
              required
            />
          </label>

          {erro && <p className="text-red-600">{erro}</p>}

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
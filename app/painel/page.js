"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

export default function ClienteLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/painel/dashboard");
    } catch (err) {
      console.error(err);
      setErro("Email ou senha inválidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 px-6">
      <section className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md transition-all hover:shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-2">
          Painel C-SEM
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          CONSTANTINO SOLUÇÕES ENGENHARIA E MECÂNICA
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Campo Email */}
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <div className="flex items-center mt-1 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FiMail className="text-gray-500 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none text-gray-900 bg-transparent"
                placeholder="Digite seu email"
                required
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label className="text-gray-700 font-medium">Senha</label>
            <div className="flex items-center mt-1 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FiLock className="text-gray-500 mr-2" />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full outline-none text-gray-900 bg-transparent"
                placeholder="Digite sua senha"
                required
              />
            </div>
          </div>

          {erro && (
            <p className="text-red-600 text-center text-sm font-medium mt-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 flex items-center justify-center gap-2 py-2 rounded-lg text-white font-semibold transition-all ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <span className="animate-pulse">Entrando...</span>
            ) : (
              <>
                <FiLogIn className="text-lg" />
                Entrar
              </>
            )}
          </button>
        </form>
      </section>

      <footer className="mt-8 text-xs text-gray-500">
        © {new Date().getFullYear()} C-SEM — Todos os direitos reservados.
      </footer>
    </main>
  );
}
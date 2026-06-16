"use client";

import { useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginAdmin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);

      const uid = cred.user.uid;

      const snap = await getDoc(doc(db, "usuarios", uid));

      if (!snap.exists()) {
        alert("Usuário não encontrado no banco");
        return;
      }

      const data = snap.data();

      if (data.admin !== true) {
        alert("Você não é admin");
        return;
      }

      router.push("/admin");
    } catch (e) {
      alert("Erro no login: " + e.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-96">
        
        <h1 className="text-2xl font-bold mb-6">
          Login Admin
        </h1>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}
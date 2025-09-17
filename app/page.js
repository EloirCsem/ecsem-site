"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Sobre Nós", href: "/sobre" },
    { name: "Contato", href: "/contato" },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar fixa */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Image src="/logo.png" alt="Logo C-SEM" width={50} height={50} />
              <span className="font-bold text-xl text-blue-600">C-SEM</span>
            </div>
          </Link>

          {/* Links */}
          <nav className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold transition-all duration-300 ${
                  pathname === link.href
                    ? "text-blue-600 underline"
                    : "text-gray-700 hover:text-blue-600 hover:scale-105"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Espaço para compensar header fixo */}
      <div className="h-[80px]" />

      {/* Banner */}
      <section className="flex flex-col items-center justify-center h-[70vh] bg-black/82 text-white text-center px-6 transition-all duration-1000 ease-out transform hover:-translate-y-1 hover:scale-101">
        <Image
          src="/logo.png"
          alt="Logo C-SEM"
          width={500}
          height={500}
          className="mb-6 animate-fadeIn"
        />
        <h1 className="text-5xl font-bold mb-2 animate-fadeIn">C-SEM</h1>
        <p className="mt-4 text-xl animate-fadeIn">ELOIR CONSTANTINO SOLUÇÕES ENGENHARIA E MECÂNICA</p>

        {/* Botões da Home */}
        <div className="flex gap-4 mt-6 flex-wrap justify-center">
          <Link
            href="/painel" // CORRIGIDO: agora abre a página do Painel do Cliente
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow transform transition duration-300 hover:bg-blue-700 hover:scale-105"
          >
            Área do Cliente
          </Link>

          <Link
            href="/sobre"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow transform transition duration-300 hover:bg-blue-700 hover:scale-105"
          >
            Sobre Nós
          </Link>

          <Link
            href="/contato"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow transform transition duration-300 hover:bg-blue-700 hover:scale-105"
          >
            Contato
          </Link>
        </div>
      </section>

      {/* Serviços */}
      <section className="flex flex-col items-center py-16 px-6 animate-fadeIn">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Nossos Serviços</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="bg-white p-6 rounded-lg shadow text-center transform transition duration-300 hover:scale-105">
            <h3 className="font-semibold text-xl mb-2">Manutenção</h3>
            <p className="text-gray-600">Serviços de manutenção preventiva e corretiva em equipamentos.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center transform transition duration-300 hover:scale-105">
            <h3 className="font-semibold text-xl mb-2">Engenharia</h3>
            <p className="text-gray-600">Projetos personalizados para atender às necessidades de sua empresa.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center transform transition duration-300 hover:scale-105">
            <h3 className="font-semibold text-xl mb-2">Consultoria</h3>
            <p className="text-gray-600">Suporte técnico especializado e acompanhamento de processos.</p>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-blue-600 text-white text-center py-6 mt-auto animate-fadeIn">
        <p>&copy; {new Date().getFullYear()} C-SEM - Todos os direitos reservados.</p>
      </footer>

      {/* Animações CSS */}
      <style jsx>{`
        .animate-fadeIn {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeIn 1s forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
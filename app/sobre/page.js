"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sobre() {
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
                className={`font-semibold ${
                  pathname === link.href
                    ? "text-blue-600 underline"
                    : "text-gray-700 hover:text-blue-600"
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
      <section className="flex flex-col items-center justify-center h-[50vh] bg-black/82 text-white text-center px-6">
        <h1 className="text-5xl font-bold mb-4">Sobre Nós</h1>
        <p className="max-w-3xl text-lg leading-relaxed">
          A <strong>C-SEM (Constantino Soluções Engenharia e Mecânica)</strong> nasceu com o
          objetivo de fornecer soluções completas em engenharia, manutenção e consultoria técnica.
          <br /><br />
          Nossa missão é unir conhecimento técnico e inovação para garantir eficiência, segurança
          e qualidade em cada projeto realizado.
        </p>

        {/* Botões */}
        <div className="flex gap-4 mt-6 flex-wrap justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
          >
            Home
          </Link>
          <Link
            href="/contato"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
          >
            Contato
          </Link>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-blue-600 text-white text-center py-6 mt-auto">
        <p>&copy; {new Date().getFullYear()} C-SEM - Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
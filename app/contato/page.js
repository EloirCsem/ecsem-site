export default function Contato() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-center">
      <h1 className="text-3xl font-bold text-blue-600">Contato</h1>
      <p className="mt-4 text-gray-700">Entre em contato pelo WhatsApp:</p>
      <a
        href="https://wa.me/5500000000000"
        target="_blank"
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        WhatsApp
      </a>
    </main>
  );
}
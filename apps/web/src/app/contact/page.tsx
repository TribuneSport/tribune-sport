import Link from "next/link";

export const metadata = {
  title: "Contact | Tribune Foot",
  description: "Contacter Tribune Foot.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/"
          className="text-sm font-bold text-red-600 hover:text-red-700"
        >
          ← Retour à Tribune Foot
        </Link>

        <article className="mt-8 rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <h1 className="text-4xl font-black text-gray-900">
            Contact
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Une question, une remarque ou une demande concernant
            Tribune Foot ?
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6">
            <h2 className="text-xl font-black text-gray-900">
              Nous contacter
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              Les coordonnées de contact de Tribune Foot seront
              indiquées ici.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
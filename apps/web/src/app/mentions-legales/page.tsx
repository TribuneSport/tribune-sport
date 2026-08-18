import Link from "next/link";

export const metadata = {
  title: "Mentions légales | Tribune Foot",
  description: "Mentions légales de Tribune Foot.",
};

export default function MentionsLegalesPage() {
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
            Mentions légales
          </h1>

          <div className="mt-8 space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-black text-gray-900">
                Éditeur du site
              </h2>

              <p className="mt-3 leading-7">
                Tribune Foot
              </p>

              <p className="mt-2 leading-7">
                Informations relatives à l'éditeur à compléter.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-gray-900">
                Responsable de publication
              </h2>

              <p className="mt-3 leading-7">
                Informations relatives au responsable de publication
                à compléter.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-gray-900">
                Hébergement
              </h2>

              <p className="mt-3 leading-7">
                Informations relatives à l'hébergeur à compléter.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-gray-900">
                Contact
              </h2>

              <p className="mt-3 leading-7">
                Pour toute question concernant le site, utilisez la
                page Contact.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
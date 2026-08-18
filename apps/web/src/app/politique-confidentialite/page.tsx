import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité | Tribune Foot",
  description: "Politique de confidentialité de Tribune Foot.",
};

export default function PolitiqueConfidentialitePage() {
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
            Politique de confidentialité
          </h1>

          <div className="mt-8 space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-black text-gray-900">
                Données personnelles
              </h2>

              <p className="mt-3 leading-7">
                Tribune Foot accorde une attention particulière à la
                protection des données personnelles de ses visiteurs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-gray-900">
                Données collectées
              </h2>

              <p className="mt-3 leading-7">
                Les informations effectivement collectées par le site,
                leurs finalités et leur durée de conservation doivent
                être précisées ici selon les services utilisés par
                Tribune Foot.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-gray-900">
                Cookies
              </h2>

              <p className="mt-3 leading-7">
                Les éventuels cookies et technologies similaires
                utilisés par le site doivent être détaillés ici.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-gray-900">
                Vos droits
              </h2>

              <p className="mt-3 leading-7">
                Pour toute demande concernant vos données personnelles,
                veuillez utiliser les coordonnées indiquées sur la
                page Contact.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
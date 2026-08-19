import Link from "next/link";
import { db } from "@/lib/db";

import PublishButton from "@/components/PublishButton";
import EditArticleButton from "@/components/EditArticleButton";
import FootballSeederButton from "@/components/admin/FootballSeederButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const now = new Date();

  /*
   * Début de la journée.
   */
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  /*
   * Début de la semaine.
   * Lundi = premier jour.
   */
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();

  const diffToMonday =
    day === 0 ? 6 : day - 1;

  startOfWeek.setDate(
    startOfWeek.getDate() -
      diffToMonday
  );

  startOfWeek.setHours(0, 0, 0, 0);

  /*
   * Début du mois.
   */
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const [
    articles,
    clubs,
    players,
    competitions,
    matches,
    totalVisits,
    todayVisits,
    weekVisits,
    monthVisits,
    rewrittenArticles,
  ] = await Promise.all([
    db.article.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    db.club.count(),

    db.player.count(),

    db.competition.count(),

    db.match.count(),

    db.visit.count(),

    db.visit.count({
      where: {
        createdAt: {
          gte: startOfDay,
        },
      },
    }),

    db.visit.count({
      where: {
        createdAt: {
          gte: startOfWeek,
        },
      },
    }),

    db.visit.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),

    db.article.count({
      where: {
        aiRewritten: true,
      },
    }),
  ]);

  const total = articles.length;

  const published = articles.filter(
    (article) => article.published
  ).length;

  const drafts = total - published;

  const categories = new Set(
    articles.map(
      (article) => article.category
    )
  ).size;

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-5xl font-black">
              Administration
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Tableau de bord Tribune Foot
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <FootballSeederButton />

            <Link
              href="/admin/articles/new"
              className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
            >
              + Nouvel article
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-red-700 px-6 py-3 font-bold text-white transition hover:bg-red-800"
            >
              Voir le site
            </Link>
          </div>
        </div>

        {/* VISITES */}

        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-3xl font-black">
              Visites du site
            </h2>

            <p className="mt-1 text-gray-500">
              Nombre de pages vues enregistrées.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-3xl bg-white p-6 shadow">
              <p className="text-gray-500">
                Aujourd'hui
              </p>

              <h2 className="mt-3 text-5xl font-black text-blue-600">
                {todayVisits}
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Depuis minuit
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow">
              <p className="text-gray-500">
                Cette semaine
              </p>

              <h2 className="mt-3 text-5xl font-black text-indigo-600">
                {weekVisits}
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Depuis lundi
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow">
              <p className="text-gray-500">
                Ce mois
              </p>

              <h2 className="mt-3 text-5xl font-black text-purple-600">
                {monthVisits}
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Depuis le 1er du mois
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow">
              <p className="text-gray-500">
                Total
              </p>

              <h2 className="mt-3 text-5xl font-black text-green-600">
                {totalVisits}
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Depuis l'installation
              </p>
            </div>

          </div>
        </section>

        {/* ARTICLES */}

        <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Articles
            </p>

            <h2 className="mt-3 text-5xl font-black">
              {total}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Publiés
            </p>

            <h2 className="mt-3 text-5xl font-black text-green-600">
              {published}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Brouillons
            </p>

            <h2 className="mt-3 text-5xl font-black text-orange-600">
              {drafts}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Catégories
            </p>

            <h2 className="mt-3 text-5xl font-black">
              {categories}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Réécrits par IA
            </p>

            <h2 className="mt-3 text-5xl font-black text-violet-600">
              {rewrittenArticles}
            </h2>
          </div>

        </div>

        {/* DONNÉES FOOTBALL */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-10">

          <div className="rounded-3xl bg-blue-600 p-6 text-white shadow">
            <div className="text-4xl">
              ⚽
            </div>

            <h2 className="mt-4 text-4xl font-black">
              {clubs}
            </h2>

            <p className="mt-2 text-blue-100">
              Clubs
            </p>
          </div>

          <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow">
            <div className="text-4xl">
              👤
            </div>

            <h2 className="mt-4 text-4xl font-black">
              {players}
            </h2>

            <p className="mt-2 text-indigo-100">
              Joueurs
            </p>
          </div>

          <div className="rounded-3xl bg-purple-600 p-6 text-white shadow">
            <div className="text-4xl">
              🏆
            </div>

            <h2 className="mt-4 text-4xl font-black">
              {competitions}
            </h2>

            <p className="mt-2 text-purple-100">
              Compétitions
            </p>
          </div>

          <div className="rounded-3xl bg-red-600 p-6 text-white shadow">
            <div className="text-4xl">
              🏟️
            </div>

            <h2 className="mt-4 text-4xl font-black">
              {matches}
            </h2>

            <p className="mt-2 text-red-100">
              Matchs
            </p>
          </div>

        </div>

        {/* MENU */}

        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <Link
            href="/admin/articles"
            className="rounded-3xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-5xl">
              📰
            </div>

            <h2 className="mt-5 text-2xl font-black">
              Articles
            </h2>

            <p className="mt-3 text-gray-500">
              Gestion complète des articles.
            </p>
          </Link>

          <Link
            href="/admin/rss"
            className="rounded-3xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-5xl">
              📡
            </div>

            <h2 className="mt-5 text-2xl font-black">
              RSS
            </h2>

            <p className="mt-3 text-gray-500">
              Import automatique.
            </p>
          </Link>

          <Link
            href="/admin/agents"
            className="rounded-3xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-5xl">
              🤖
            </div>

            <h2 className="mt-5 text-2xl font-black">
              Agents IA
            </h2>

            <p className="mt-3 text-gray-500">
              Réécriture et automatisations.
            </p>
          </Link>

          <Link
            href="/"
            className="rounded-3xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-5xl">
              🌐
            </div>

            <h2 className="mt-5 text-2xl font-black">
              Site public
            </h2>

            <p className="mt-3 text-gray-500">
              Ouvrir Tribune Foot.
            </p>
          </Link>

        </div>

        {/* ARTICLES RÉCENTS */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

          <div className="border-b p-6">
            <h2 className="text-3xl font-black">
              Derniers articles
            </h2>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>
                  <th className="p-4 text-left">
                    Article
                  </th>

                  <th className="p-4 text-left">
                    Catégorie
                  </th>

                  <th className="p-4 text-left">
                    IA
                  </th>

                  <th className="p-4 text-left">
                    Vues
                  </th>

                  <th className="p-4 text-left">
                    Statut
                  </th>

                  <th className="p-4 text-left">
                    Date
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {articles.map((article) => (

                  <tr
                    key={article.id}
                    className="border-t transition hover:bg-slate-50"
                  >

                    <td className="p-4 font-semibold">
                      {article.title}
                    </td>

                    <td className="p-4">
                      {article.category}
                    </td>

                    <td className="p-4">

                      {article.aiRewritten ? (

                        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
                          Réécrit
                        </span>

                      ) : (

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
                          À traiter
                        </span>

                      )}

                    </td>

                    <td className="p-4 font-bold">
                      {article.views}
                    </td>

                    <td className="p-4">

                      {article.published ? (

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                          Publié
                        </span>

                      ) : (

                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                          Brouillon
                        </span>

                      )}

                    </td>

                    <td className="p-4">
                      {new Date(
                        article.createdAt
                      ).toLocaleDateString(
                        "fr-FR"
                      )}
                    </td>

                    <td className="p-4">

                      <div className="flex flex-wrap gap-2">

                        <PublishButton
                          id={article.id}
                          published={
                            article.published
                          }
                        />

                        <EditArticleButton
                          id={article.id}
                        />

                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                        >
                          Modifier
                        </Link>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </main>
  );
}
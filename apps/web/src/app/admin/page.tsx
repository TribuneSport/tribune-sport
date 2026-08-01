export default function AdminPage() {
  return (
    <main className="p-10">

      <h1 className="text-4xl font-bold mb-8">
        Tribune Sport Administration
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <div className="rounded-xl border p-6">
          <h2 className="font-bold">
            Brouillons IA
          </h2>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-bold">
            Articles publiés
          </h2>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-bold">
            Sources RSS
          </h2>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-bold">
            Agents IA
          </h2>
        </div>

      </div>

    </main>
  );
}
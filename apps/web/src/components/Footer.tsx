export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 py-10 md:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-red-700">
            Tribune Sport
          </h2>

          <p className="mt-2 text-gray-600">
            Toute l'actualité du FC Metz, de la Ligue 1
            et du football européen.
          </p>
        </div>

        <div className="flex gap-8 text-gray-600">
          <a href="#">Accueil</a>
          <a href="#">Articles</a>
          <a href="#">Classements</a>
          <a href="#">Contact</a>
        </div>

        <div className="text-sm text-gray-500">
          © 2026 Tribune Sport
        </div>
      </div>
    </footer>
  );
}
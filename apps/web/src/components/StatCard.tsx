type StatCardProps = {
  title: string;
  value: string;
};

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold text-red-700">
        {value}
      </h2>
    </div>
  );
}
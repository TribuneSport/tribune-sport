type StatCardProps = {
  title: string;
  value: string;
};

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="mt-3 text-3xl font-bold text-red-900">
        {value}
      </h2>
    </div>
  );
}
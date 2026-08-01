type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="🔍 Rechercher un article..."
        className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 shadow-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-300"
      />
    </div>
  );
}
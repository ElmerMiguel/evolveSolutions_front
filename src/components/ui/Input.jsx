export default function Input({ label, ...props }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
      />
    </label>
  );
}
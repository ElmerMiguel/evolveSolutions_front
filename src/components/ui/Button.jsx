export default function Button({ children, variant = "solid", ...props }) {
  const base = "w-full rounded-xl px-4 py-3 font-medium transition active:scale-[0.99]";
  const styles =
    variant === "solid"
      ? "bg-black text-white hover:opacity-90"
      : "border border-gray-200 bg-white text-black hover:bg-gray-50";

  return (
    <button {...props} className={`${base} ${styles} disabled:opacity-60`}>
      {children}
    </button>
  );
}
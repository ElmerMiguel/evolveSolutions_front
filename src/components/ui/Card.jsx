export default function Card({ children }) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/70 p-8 shadow-sm backdrop-blur">
      {children}
    </div>
  );
}
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-3 overflow-hidden rounded-full bg-kimochi-primary-soft">
      <div className="h-full rounded-full bg-gradient-to-r from-[#ff6f73] to-kimochi-primary transition-all" style={{ width: `${percentage}%` }} />
    </div>
  );
}

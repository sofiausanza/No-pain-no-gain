export function TopBar({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        {title}
      </h1>
    </div>
  );
}

import Link from "next/link";

export function SubTopBar({
  title,
  backHref,
}: {
  title: string;
  backHref: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Link
        href={backHref}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hairline bg-surface-2 text-sm text-accent"
      >
        ←
      </Link>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        {title}
      </h1>
    </div>
  );
}
